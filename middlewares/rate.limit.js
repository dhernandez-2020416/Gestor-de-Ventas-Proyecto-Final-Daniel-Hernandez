import rateLimit from 'express-rate-limit'

export const limiter = rateLimit(
    {
        windowMs: 1000 * 60 * 15,
        max: 100,
        message: {
            message: `You're blocked, wait 15 minutes`
        }
    }
)