/**
 * Asserts HTTP Method matches expected (e.g., 'POST')
 */
export function assertMethod(req, res, allowedMethod) {
    if (req.method !== allowedMethod) {
        res.status(405).json({ error: `Method ${req.method} Not Allowed` });
        return false;
    }
    return true;
}

/**
 * Validates password sent by the frontend portal
 */
export function assertPortalAuth(req, res) {
    const { password } = req.body || {};
    if (!password || password !== process.env.PORTAL_PASSWORD) {
        res.status(401).json({ error: "Unauthorized: Invalid password" });
        return false;
    }
    return true;
}

/**
 * Validates secret token passed in Koalendar webhook URL
 */
export function assertWebhookSecret(req, res) {
    const secret = req.query.secret;
    if (!secret || secret !== process.env.WEBHOOK_SECRET) {
        res.status(401).json({
            error: "Unauthorized: Missing or invalid secret token",
        });
        return false;
    }
    return true;
}
