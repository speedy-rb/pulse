const pool = require("./pool");

async function getAllPosts() {
  const { rows } = await pool.query("SELECT * FROM posts");
  return rows;
}

async function getPostForDate(date) {
  const { rows } = await pool.query(`
    SELECT * FROM posts WHERE post_date = $1;
  `, [date]);
  return rows;
}

async function insertPost(post) {
  const query = `
    INSERT INTO posts (image_path, post_date, location, notes)
    VALUES ($1, $2, $3, $4)
    RETURNING *;
  `;
  const values = [
    post.imagePath,
    post.postDate,
    post.location ?? null,
    post.notes ?? null,
  ];
  const { rows } = await pool.query(query, values);
  return rows;
}

module.exports = {
  getAllPosts,
  getPostForDate
};