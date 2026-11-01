-- Give existing authors a private token so email links can manage their subscription
UPDATE authors SET subscription_token = hex(randomblob(16)) WHERE subscription_token IS NULL;
