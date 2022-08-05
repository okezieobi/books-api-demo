SELECT "bookId",
    body,
    "ipAddress",
    "createAt"
FROM comments
ORDER BY "createAt" DESC OFFSET $(page)
LIMIT $(size);