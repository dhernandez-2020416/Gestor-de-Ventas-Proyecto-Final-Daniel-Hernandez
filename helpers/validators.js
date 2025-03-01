import { body } from 'express-validator'
import { existUsername, existEmail, objectIdValid } from './db.validators.js'
import { validateErrors } from './validate.error.js'

export const registerValidator = [
    body('name', 'Name cannot be empty')
        .notEmpty(),
    body('surname', 'Surname cannot be empty')
        .notEmpty(),
    body('email', 'Email cannot be empty or is not a valid email')
        .notEmpty()
        .isEmail()
        .custom(existEmail),
    body('username', 'Username cannot be empty')
        .notEmpty()
        .toLowerCase()
        .custom(existUsername),
    body('password', 'Password cannot be empty')
        .notEmpty()
        .isStrongPassword()
        .withMessage('The password must be strong')
        .isLength({min: 8}),
    body('phone', 'Phone cannot be empty or is not a valid phone')
        .notEmpty()
        .isMobilePhone()
        .isLength({min: 8, max: 8}),
    body('role', 'Role cannot be added')
        .not()
        .exists(),
    body('shoppingCarts', 'ShoppingCarts cannot be added')
        .not()
        .exists(),
    body('status', 'Status cannot be added')
        .not()
        .exists(),
    validateErrors
]

export const loginValidator = [
    body('identifier', 'Username cannot be empty')
        .notEmpty(),
    body('password', 'Password cannot be empty')
        .notEmpty(),
        validateErrors
]

export const updateUserValidator = [
    body('name', 'Name cannot be empty')
        .optional().notEmpty(),
    body('surname', 'Surname cannot be empty')
        .optional().notEmpty(),
    body('email', 'Email cannot be empty or is not a valid email')
        .optional().notEmpty()
        .isEmail()
        .custom(existEmail),
    body('username', 'Username cannot be empty')
        .optional().notEmpty()
        .toLowerCase()
        .custom(existUsername),
    body('password', 'Password cannot be change')
        .not()
        .exists(),
    body('phone', 'Phone cannot be empty or is not a valid phone')
        .optional().notEmpty()
        .isMobilePhone()
        .isLength({min: 8, max: 8}),
    body('role', 'Role cannot be change')
        .not()
        .exists(),
    body('status', 'Status cannnot be cannot be change')
        .not()
        .exists(),
    body('shoppingCarts', 'ShoppingCarts cannot be change')
        .not()
        .exists(),
    validateErrors
]

export const deleteUserValidator = [
    body('password', 'Password cannot be empty')
        .notEmpty(),
    validateErrors
]

export const createCategoryValidator = [
    body('name', 'Name cannot be empty')
        .notEmpty(),
    body('description', 'Description cannot be empty')
        .notEmpty(),
    body('products', 'Products cannot be added')
        .not()
        .exists(),
    validateErrors
]

export const updateCategoryValidator = [
    body('name', 'Name cannot be empty')
        .optional()
        .notEmpty(),
    body('description', 'Description cannot be empty')
        .optional()
        .notEmpty(),
    body('products', 'Products cannnot be updated')
        .not()
        .exists(),
    validateErrors
]

export const createProductValidator = [
    body('name', 'Name cannot be empty')
        .notEmpty(),
    body('description', 'Description cannot be empty')
        .notEmpty(),
    body('price', 'Price cannot be empty')
        .notEmpty(),
    body('stock', 'Stock cannot be empty')
        .notEmpty(),
    body('category', 'Category cannot be empty')
        .notEmpty()
        .custom(objectIdValid),
    body('sale', 'Sales cannot be added')
        .not()
        .exists(),
    validateErrors
]

export const updateProductValidator = [
    body('name', 'Name cannot be empty')
        .optional().notEmpty(),
    body('description', 'Description cannot be empty')
        .optional().notEmpty(),
    body('price', 'Price cannot be empty')
        .optional().notEmpty(),
    body('stock', 'Stock cannot be empty')
        .optional().notEmpty(),
    body('category', 'Category cannot be empty')
        .optional().notEmpty()
        .custom(objectIdValid),
    body('sale', 'Sales cannot be empty')
        .optional().notEmpty(),
    validateErrors
]

export const updatePasswordValidator = [
    body('oldPassword', 'OldPassword cannot be empty')
        .notEmpty(),
    body('newPassword', 'New password cannot be empty')
        .notEmpty()
        .isStrongPassword()
        .withMessage('The password must be strong'),
    validateErrors
]

export const createUserByAdminValidator =[
    body('name', 'Name cannot be empty')
        .notEmpty(),
    body('surname', 'Surname cannot be empty')
        .notEmpty(),
    body('email', 'Email cannot be empty or is not a valid email')
        .notEmpty()
        .isEmail()
        .custom(existEmail),
    body('username', 'Username cannot be empty')
        .notEmpty()
        .toLowerCase()
        .custom(existUsername),
    body('password', 'Password cannot be empty')
        .notEmpty()
        .isStrongPassword()
        .withMessage('The password must be strong')
        .isLength({min: 8}),
    body('phone', 'Phone cannot be empty or is not a valid phone')
        .notEmpty()
        .isMobilePhone()
        .isLength({min: 8, max: 8}),
    body('role', 'Role cannot be empty')
        .notEmpty()
        .isIn(['CLIENT' , 'ADMIN'])
        .withMessage('Role must be valid'),
    body('shoppingCarts', 'ShoppingCarts cannot be added')
        .not()
        .exists(),
    body('status', 'Status cannot be added')
        .not()
        .exists(),
    validateErrors
]

export const udpateUserByAdminValidator = [
    body('name', 'Name cannot be empty')
        .optional()
        .notEmpty(),
    body('surname', 'Surname cannot be empty')
        .optional()
        .notEmpty(),
    body('email', 'Email cannot be empty or is not a valid email')
        .optional()
        .notEmpty()
        .isEmail()
        .custom(existEmail),
    body('username', 'Username cannot be empty')
        .optional()
        .notEmpty()
        .toLowerCase()
        .custom(existUsername),
    body('password', 'Password cannot be changed')
        .not()
        .exists(),
    body('phone', 'Phone cannot be empty or is not a valid phone')
        .optional()
        .notEmpty()
        .isMobilePhone()
        .isLength({min: 8, max: 8}),
    body('role', 'Role cannot be chaged')
        .not()
        .exists(),
    body('shoppingCarts', 'ShoppingCarts cannot be chaged')
        .not()
        .exists(),
    body('status', 'Status cannot be chaged')
        .not()
        .exists(),
    validateErrors
]

export const updateRoleByAdminValidator = [
    body('role', 'Role cannot be empty')
        .notEmpty()
        .isIn(['CLIENT' , 'ADMIN'])
        .withMessage('Role must be valid'),
    validateErrors
]

export const deleteUserByAdminValidator = [
    body('password', 'Password cannot be empty')
        .notEmpty(),
    validateErrors
]

export const getOneProductValidator = [
    body('name', 'Name cannot be empty')
        .notEmpty(),
    validateErrors
]