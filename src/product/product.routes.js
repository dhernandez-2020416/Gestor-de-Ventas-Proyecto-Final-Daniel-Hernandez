import { Router } from 'express'
import { validateJwt, verifyAdminRole } from '../../middlewares/validate.jwt.js'
import { createProduct, deleteProduct, getProducts, getProductsOutOfStock, udpateProduct } from './product.controller.js'
import { createProductValidator, updateProductValidator } from '../../helpers/validators.js'

const api = Router()

api.post(
    '/createProduct',
    [
        validateJwt,
        verifyAdminRole,
        createProductValidator
    ],
    createProduct
)

api.put(
    '/updateProduct/:idProduct',
    [
        validateJwt,
        verifyAdminRole,
        updateProductValidator
    ],
    udpateProduct
)

api.get(
    '/getProducts',
    [
        validateJwt,
        verifyAdminRole
    ],
    getProducts
)

api.delete(
    '/deleteProduct/:idProduct',
    [
        validateJwt,
        verifyAdminRole
    ],
    deleteProduct
)

api.get(
    '/getProductOutOfStock',
    [
        validateJwt,
        verifyAdminRole
    ],
    getProductsOutOfStock
)

export default api