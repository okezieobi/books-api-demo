INSERT INTO comments
    ("ipAddress", "bookId", comment)
VALUES($
{ipAddress}, ${bookId}, ${comment}) RETURNING *;