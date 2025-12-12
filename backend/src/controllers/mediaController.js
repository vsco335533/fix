import { query } from '../config/database.js';

export const getAllMedia = async (req, res) => {
  try {
    const { type, post_id } = req.query;

    let queryText = 'SELECT * FROM media WHERE 1=1';
    const queryParams = [];
    let paramIndex = 1;

    if (type) {
      queryText += ` AND type = $${paramIndex}`;
      queryParams.push(type);
      paramIndex++;
    }

    if (post_id) {
      queryText += ` AND post_id = $${paramIndex}`;
      queryParams.push(post_id);
      paramIndex++;
    }

    queryText += ' ORDER BY created_at DESC';

    const result = await query(queryText, queryParams);
    res.json(result.rows);
  } catch (error) {
    console.error('Get media error:', error);
    res.status(500).json({ error: 'Failed to fetch media' });
  }
};

export const createMedia = async (req, res) => {
  try {
    const {
      title,
      description,
      type,
      url,
      thumbnail_url,
      file_size,
      duration,
      post_id
    } = req.body;

    const result = await query(
      `INSERT INTO media (title, description, type, url, thumbnail_url, file_size, duration, uploaded_by, post_id)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
       RETURNING *`,
      [title, description, type, url, thumbnail_url, file_size, duration, req.user.id, post_id]
    );

    res.status(201).json({
      message: 'Media created successfully',
      media: result.rows[0]
    });
  } catch (error) {
    console.error('Create media error:', error);
    res.status(500).json({ error: 'Failed to create media' });
  }
};

export const deleteMedia = async (req, res) => {
  try {
    const { id } = req.params;

    const existingMedia = await query(
      'SELECT * FROM media WHERE id = $1',
      [id]
    );

    if (existingMedia.rows.length === 0) {
      return res.status(404).json({ error: 'Media not found' });
    }

    if (existingMedia.rows[0].uploaded_by !== req.user.id && req.user.role !== 'super_admin') {
      return res.status(403).json({ error: 'Not authorized to delete this media' });
    }

    await query('DELETE FROM media WHERE id = $1', [id]);

    res.json({ message: 'Media deleted successfully' });
  } catch (error) {
    console.error('Delete media error:', error);
    res.status(500).json({ error: 'Failed to delete media' });
  }
};
