INSERT INTO comments
    ("ipAddress", "bookId", body)
VALUES($(ipAddress), $(bookId), $(body)) RETURNING *;