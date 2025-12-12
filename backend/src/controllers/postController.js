import { query } from '../config/database.js';

export const getAllPosts = async (req, res) => {
  try {
    const { status, type, category_id, search, limit = 50, offset = 0 } = req.query;

    let queryText = `
      SELECT p.*,
             json_build_object('full_name', pr.full_name, 'avatar_url', pr.avatar_url) as profiles,
             json_build_object('name', c.name, 'slug', c.slug) as categories
      FROM posts p
      LEFT JOIN profiles pr ON p.author_id = pr.id
      LEFT JOIN categories c ON p.category_id = c.id
      WHERE 1=1
    `;

    const queryParams = [];
    let paramIndex = 1;

    if (status) {
      queryText += ` AND p.status = $${paramIndex}`;
      queryParams.push(status);
      paramIndex++;
    }

    if (type) {
      queryText += ` AND p.type = $${paramIndex}`;
      queryParams.push(type);
      paramIndex++;
    }

    if (category_id) {
      queryText += ` AND p.category_id = $${paramIndex}`;
      queryParams.push(category_id);
      paramIndex++;
    }

    if (search) {
      queryText += ` AND (p.title ILIKE $${paramIndex} OR p.content ILIKE $${paramIndex})`;
      queryParams.push(`%${search}%`);
      paramIndex++;
    }

    queryText += ` ORDER BY p.published_at DESC NULLS LAST, p.created_at DESC`;
    queryText += ` LIMIT $${paramIndex} OFFSET $${paramIndex + 1}`;
    queryParams.push(limit, offset);

    const result = await query(queryText, queryParams);
    res.json(result.rows);
  } catch (error) {
    console.error('Get posts error:', error);
    res.status(500).json({ error: 'Failed to fetch posts' });
  }
};

export const getPostBySlug = async (req, res) => {
  try {
    const { slug } = req.params;

    const result = await query(
      `SELECT p.*,
              json_build_object('full_name', pr.full_name, 'avatar_url', pr.avatar_url) as profiles,
              json_build_object('name', c.name, 'slug', c.slug) as categories,
              COALESCE(
                (SELECT json_agg(json_build_object('tags', json_build_object('name', t.name, 'slug', t.slug)))
                 FROM post_tags pt
                 JOIN tags t ON pt.tag_id = t.id
                 WHERE pt.post_id = p.id),
                '[]'
              ) as post_tags,
              COALESCE(
                (SELECT json_agg(m.*) FROM media m WHERE m.post_id = p.id),
                '[]'
              ) as media
       FROM posts p
       LEFT JOIN profiles pr ON p.author_id = pr.id
       LEFT JOIN categories c ON p.category_id = c.id
       WHERE p.slug = $1`,
      [slug]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Post not found' });
    }

    await query(
      'UPDATE posts SET view_count = view_count + 1 WHERE id = $1',
      [result.rows[0].id]
    );

    res.json(result.rows[0]);
  } catch (error) {
    console.error('Get post error:', error);
    res.status(500).json({ error: 'Failed to fetch post' });
  }
};

export const createPost = async (req, res) => {
  try {
    const {
      title,
      content,
      excerpt,
      type,
      category_id,
      featured_image_url,
      document_url,
      status = 'draft'
    } = req.body;

    const slug = title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '');

    const result = await query(
      `INSERT INTO posts (title, slug, content, excerpt, type, status, author_id, category_id, featured_image_url, document_url)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)
       RETURNING *`,
      [title, slug, content, excerpt, type, status, req.user.id, category_id, featured_image_url, document_url]
    );

    res.status(201).json({
      message: 'Post created successfully',
      post: result.rows[0]
    });
  } catch (error) {
    console.error('Create post error:', error);
    res.status(500).json({ error: 'Failed to create post' });
  }
};

export const updatePost = async (req, res) => {
  try {
    const { id } = req.params;
    const {
      title,
      content,
      excerpt,
      type,
      category_id,
      featured_image_url,
      document_url,
      status
    } = req.body;

    const existingPost = await query(
      'SELECT * FROM posts WHERE id = $1',
      [id]
    );

    if (existingPost.rows.length === 0) {
      return res.status(404).json({ error: 'Post not found' });
    }

    if (existingPost.rows[0].author_id !== req.user.id && req.user.role !== 'super_admin') {
      return res.status(403).json({ error: 'Not authorized to update this post' });
    }

    const slug = title
      ? title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '')
      : existingPost.rows[0].slug;

    const result = await query(
      `UPDATE posts
       SET title = COALESCE($1, title),
           slug = $2,
           content = COALESCE($3, content),
           excerpt = COALESCE($4, excerpt),
           type = COALESCE($5, type),
           category_id = COALESCE($6, category_id),
           featured_image_url = COALESCE($7, featured_image_url),
           document_url = COALESCE($8, document_url),
           status = COALESCE($9, status),
           updated_at = NOW()
       WHERE id = $10
       RETURNING *`,
      [title, slug, content, excerpt, type, category_id, featured_image_url, document_url, status, id]
    );

    res.json({
      message: 'Post updated successfully',
      post: result.rows[0]
    });
  } catch (error) {
    console.error('Update post error:', error);
    res.status(500).json({ error: 'Failed to update post' });
  }
};

export const deletePost = async (req, res) => {
  try {
    const { id } = req.params;

    const existingPost = await query(
      'SELECT * FROM posts WHERE id = $1',
      [id]
    );

    if (existingPost.rows.length === 0) {
      return res.status(404).json({ error: 'Post not found' });
    }

    if (existingPost.rows[0].author_id !== req.user.id && req.user.role !== 'super_admin') {
      return res.status(403).json({ error: 'Not authorized to delete this post' });
    }

    await query('DELETE FROM posts WHERE id = $1', [id]);

    res.json({ message: 'Post deleted successfully' });
  } catch (error) {
    console.error('Delete post error:', error);
    res.status(500).json({ error: 'Failed to delete post' });
  }
};

export const approvePost = async (req, res) => {
  try {
    const { id } = req.params;

    const result = await query(
      `UPDATE posts
       SET status = 'published',
           published_at = NOW(),
           updated_at = NOW()
       WHERE id = $1
       RETURNING *`,
      [id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Post not found' });
    }

    await query(
      `INSERT INTO moderation_log (post_id, moderator_id, action, feedback)
       VALUES ($1, $2, 'approved', NULL)`,
      [id, req.user.id]
    );

    res.json({
      message: 'Post approved successfully',
      post: result.rows[0]
    });
  } catch (error) {
    console.error('Approve post error:', error);
    res.status(500).json({ error: 'Failed to approve post' });
  }
};

export const rejectPost = async (req, res) => {
  try {
    const { id } = req.params;
    const { feedback } = req.body;

    const result = await query(
      `UPDATE posts
       SET status = 'rejected',
           updated_at = NOW()
       WHERE id = $1
       RETURNING *`,
      [id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Post not found' });
    }

    await query(
      `INSERT INTO moderation_log (post_id, moderator_id, action, feedback)
       VALUES ($1, $2, 'rejected', $3)`,
      [id, req.user.id, feedback]
    );

    res.json({
      message: 'Post rejected',
      post: result.rows[0]
    });
  } catch (error) {
    console.error('Reject post error:', error);
    res.status(500).json({ error: 'Failed to reject post' });
  }
};
