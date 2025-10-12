// src/middlewares/validate.js
export function requireFields(fields = []) {
    return (req, res, next) => {
        const missing = fields.filter((f) => !req.body?.[f]);
        if (missing.length) {
            const err = new Error(`필수 필드 누락: ${missing.join(', ')}`);
            err.status = 400;
            return next(err);
        }
        next();
    };
}
