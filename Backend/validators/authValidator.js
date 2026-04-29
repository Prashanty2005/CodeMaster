const Joi = require('joi');

const registerSchema = Joi.object({
    firstName: Joi.string().min(3).max(20).required(),
    lastName: Joi.string().min(3).max(20).required(),
    email: Joi.string().email().required(),
    age: Joi.number().min(6).max(80).optional(),
    password: Joi.string().required(),
    role: Joi.string().valid('user', 'admin').optional()
});

const loginSchema = Joi.object({
    email: Joi.string().email().required(),
    password: Joi.string().required()
});

module.exports = {
    registerSchema,
    loginSchema
};
