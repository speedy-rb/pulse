CREATE TABLE posts (
    id INTEGER PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
    image_path TEXT,
    post_date DATE,
    location TEXT,
    notes TEXT,
    created_at TIMESTAMPTZ NOT  NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT  NULL DEFAULT NOW()
);