CREATE EXTENSION
IF NOT EXISTS "pgcrypto";

DROP TABLE IF EXISTS comments;

CREATE TABLE comments
(
    id          UUID         PRIMARY KEY DEFAULT gen_random_uuid(),
    "bookId"    INTEGER      NOT NULL,
    body        VARCHAR(500) NOT NULL,
    "ipAddress" INET         NOT NULL,
    "createAt"  TIMESTAMPTZ  DEFAULT NOW()
);
