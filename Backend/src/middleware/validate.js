const validate = (schema) => {
    return (req, res, next) => {
        // Validate req.body against the provided Joi schema
        const { error } = schema.validate(req.body, { abortEarly: false }); // abortEarly: false returns ALL errors, not just the first one

        if (error) {
            // Map over the Joi errors to create a clean, readable array of messages
            const errorMessage = error.details.map((detail) => detail.message).join(', ');
            return res.status(400).json({ success: false, message: errorMessage });
        }

        // If validation passes, move to the actual route controller
        next();
    };
};

module.exports = validate;
