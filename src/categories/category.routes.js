import { Router } from 'express'
import { validateJwt, verifyAdminRole } from '../../middlewares/validate.jwt.js'
import { createCategory, deleteCategory, getCategories, getOneCategory, updateCategory } from './category.controller.js'
import { createCategoryValidator, getOneProductValidator, updateCategoryValidator } from '../../helpers/validators.js'
import { verify } from 'argon2'

const api = Router()

api.post(
    '/createCategory',
    [
        validateJwt,
        verifyAdminRole,
        createCategoryValidator
    ],
    createCategory
)

api.get(
    '/getCategories',
    [
        validateJwt
    ],
    getCategories
)

api.put(
    '/updateCategory/:idCategory',
    [
        validateJwt,
        verifyAdminRole,
        updateCategoryValidator
    ],
    updateCategory
)

api.delete(
    '/deleteCategory/:idCategory',
    [
        validateJwt,
        verifyAdminRole
    ],
    deleteCategory
)

api.get(
    '/getCategory',
    [
        validateJwt,
        getOneProductValidator
    ],
    getOneCategory
)

export default api