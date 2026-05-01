const pool = require("./pool");
const bcrypt = require('bcrypt');

const insertDummyPosts = `
    INSERT INTO posts (image_path, post_date, location, notes)    
    VALUES
        ('/ref_story_0.jpg', '2026-04-08', null, null),
        ('/ref_story_1.jpg', '2026-04-09', null, null),
        ('/ref_story_2.jpg', '2026-04-10', null, null)
;`;

const getAllPosts = `SELECT * FROM posts;`;
const deleteAllPosts = `DELETE FROM posts;`;
const createUsersTable = `
    CREATE TABLE users (
        id INTEGER GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
        email TEXT UNIQUE NOT NULL,
        password_hash TEXT NOT NULL,
        created_at TIMESTAMPTZ DEFAULT NOW(),
        updated_at TIMESTAMPTZ DEFAULT NOW()
    )
`;

async function insertUserToUsersTable(email, password) {
    const passwordHash = await bcrypt.hash(password, 10);
    return pool.query(`
        INSERT INTO users (email, password_hash)
        VALUES ($1, $2)
        RETURNING id, email, created_at;
    `, [email, passwordHash]);
}


async function main() {
    console.log("ad hoc query...");
    // const result = await pool.query(getAllPosts);
    // const result = await pool.query(insertDummyPosts);
    // const result = await pool.query(createUsersTable);
    // const result = await pool.query(deleteAllPosts);
    const result = await insertUserToUsersTable( // node --env-file .env ./src/db/ad_hoc_queries.js james@example.com testpassword
        process.argv[2], process.argv[3]
    );
    console.log(result.rows)
    await pool.end();
    console.log("done");
}

main(); // node --env-file .env ./src/db/ad_hoc_queries.js