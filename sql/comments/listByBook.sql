SELECT "bookId", body, "ipAddress", "createAt"
FROM comments
WHERE "bookId" = $(bookId) ORDER BY "createAt" DESC;