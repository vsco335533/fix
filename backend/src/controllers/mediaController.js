import cloudinary from "../config/cloudinary.js";
import { query } from "../config/database.js";

/* =====================================================
   UPLOAD MEDIA (IMAGE / PDF)
   POST /api/media/upload
===================================================== */
export const uploadMedia = async (req, res) => {
  try {
    const { title, post_id = null } = req.body;

    if (!req.file) {
      return res.status(400).json({ error: "File missing" });
    }

    /* ---------- Upload to Cloudinary ---------- */
    const uploadResult = await new Promise((resolve, reject) => {
      cloudinary.uploader.upload_stream(
        {
          folder: "pi-labs-media",
          resource_type: "auto", // ✅ auto is OK ONLY for upload
          access_mode: "public",
        },
        (error, result) => {
          if (error) reject(error);
          else resolve(result);
        }
      ).end(req.file.buffer);
    });

    const mediaType =
      uploadResult.resource_type === "raw" ? "pdf" : "image";

    /* ---------- Save metadata in PostgreSQL ---------- */
    const result = await query(
      `
      INSERT INTO media
        (title, type, url, thumbnail_url, file_size, uploaded_by, post_id, status)
      VALUES
        ($1, $2, $3, $4, $5, $6, $7, $8)
      RETURNING *
      `,
      [
        title || uploadResult.original_filename,
        mediaType,
        uploadResult.secure_url,
        mediaType === "image" ? uploadResult.secure_url : null,
        uploadResult.bytes,
        req.user.id,
        post_id,
        req.user.role === "super_admin" ? "approved" : "pending",
      ]
    );

    res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error("Media upload error:", err);
    res.status(500).json({ error: "Media upload failed" });
  }
};

/* =====================================================
   GET APPROVED MEDIA
   GET /api/media
===================================================== */
export const getMedia = async (req, res) => {
  try {
    const { type } = req.query;

    const rs = await query(
      `
      SELECT *
      FROM media
      WHERE status = 'approved'
      ${type ? "AND type = $1" : ""}
      ORDER BY created_at DESC
      `,
      type ? [type] : []
    );

    res.json(rs.rows);
  } catch (err) {
    console.error("Fetch media error:", err);
    res.status(500).json({ error: "Failed to fetch media" });
  }
};

/* =====================================================
   APPROVE MEDIA (ADMIN)
   POST /api/media/:id/approve
===================================================== */
export const approveMedia = async (req, res) => {
  try {
    if (req.user.role !== "super_admin") {
      return res.status(403).json({ error: "Not allowed" });
    }

    await query(
      `
      UPDATE media
      SET status = 'approved',
          approved_by = $1
      WHERE id = $2
      `,
      [req.user.id, req.params.id]
    );

    res.json({ message: "Media approved" });
  } catch (err) {
    console.error("Approve media error:", err);
    res.status(500).json({ error: "Approval failed" });
  }
};

/* =====================================================
   DELETE MEDIA (ADMIN)
   DELETE /api/media/:id
===================================================== */
export const deleteMedia = async (req, res) => {
  try {
    if (req.user.role !== "super_admin") {
      return res.status(403).json({ error: "Not allowed" });
    }

    const rs = await query(
      `SELECT * FROM media WHERE id = $1`,
      [req.params.id]
    );

    if (!rs.rows.length) {
      return res.status(404).json({ error: "Media not found" });
    }

    const media = rs.rows[0];

    /* ---------- Delete from Cloudinary ---------- */
    if (media.url) {
      const publicId = media.url.split("/").pop().split(".")[0];

      // ✅ FIX: correct resource type
      const resourceType =
        media.type === "pdf" ? "raw" : "image";

      await cloudinary.uploader.destroy(
        `pi-labs-media/${publicId}`,
        { resource_type: resourceType }
      );
    }

    /* ---------- Delete DB record ---------- */
    await query(`DELETE FROM media WHERE id = $1`, [req.params.id]);

    res.json({ message: "Media deleted successfully" });
  } catch (err) {
    console.error("Delete media error:", err);
    res.status(500).json({ error: "Delete failed" });
  }
};
