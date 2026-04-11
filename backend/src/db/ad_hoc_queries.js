const pool = require("./pool");

const insertDummyPosts = `
    INSERT INTO posts (image_path, post_date, location, notes)    
    VALUES
        ('/ref_story_0.jpg', '2026-04-08', null, null),
        ('/ref_story_1.jpg', '2026-04-09', null, null),
        ('/ref_story_2.jpg', '2026-04-10', null, null)
;`;

const getAllPosts = `SELECT * FROM posts;`;
const deleteAllPosts = `DELETE FROM posts;`;

async function main() {
    console.log("ad hoc query...");
    // const result = await pool.query(getAllPosts);
    const result = await pool.query(insertDummyPosts);
    // const result = await pool.query(deleteAllPosts);
    console.log(result.rows)
    await pool.end();
    console.log("done");
}

// node --env-file .env ./src/db/ad_hoc_queries.js
main();