SELECT "bookId",
    body,
    "ipAddress",
    "createAt"
FROM comments
ORDER BY "createAt" DESC
LIMIT $(size) OFFSET $(page);