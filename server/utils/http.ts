export function assertPortalAuth(password?: string): true {
    if (!password || password !== process.env.PORTAL_PASSWORD) {
        throw createError({
            statusCode: 401,
            statusMessage: "Unauthorized: Invalid password",
        });
    }
    return true;
}

export function assertWebhookSecret(secret?: string): true {
    if (!secret || secret !== process.env.WEBHOOK_SECRET) {
        throw createError({
            statusCode: 401,
            statusMessage: "Unauthorized: Invalid secret",
        });
    }
    return true;
}
