const pool = require("./pool");

async function getAllPosts(userId) {
  const { rows } = await pool.query(`
      SELECT * FROM posts
      WHERE user_id = $1
      ORDER BY post_date ASC;
  `, [userId]);
  return rows;
}

async function getPostForDate(date, userId) {
  const { rows } = await pool.query(`
    SELECT * FROM posts
    WHERE post_date = $1
      AND user_id = $2;
  `, [date, userId]);
  return rows;
}

async function createNewPost(post) {
  const query = `
    INSERT INTO posts (user_id, image_path, post_date, location, notes)
    VALUES ($1, $2, $3, $4, $5)
    RETURNING *;
  `;
  const values = [
    post.userId,
    post.imagePath,
    post.postDate,
    post.location ?? null,
    post.notes ?? null,
  ];
  const { rows } = await pool.query(query, values);
  return rows;
}

async function updatePost(post) {
  const query = `
    UPDATE posts
    SET
      image_path = COALESCE($1, image_path),
      post_date = $2,
      location = $3,
      notes = $4,
      updated_at = NOW()
    WHERE id = $5
      AND user_id = $6
    RETURNING *;
  `;
  const values = [
    post.imagePath,
    post.postDate,
    post.location ?? null,
    post.notes ?? null,
    post.id,
    post.userId,
  ];
  const { rows } = await pool.query(query, values);
  return rows;
}

module.exports = {
  getAllPosts,
  getPostForDate,
  createNewPost,
  updatePost,
};