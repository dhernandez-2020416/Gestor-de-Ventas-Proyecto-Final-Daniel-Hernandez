import { Router } from 'express'
import { validateJwt, verifyAdminRole } from '../../middlewares/validate.jwt.js'
import { createProduct, deleteProduct, getOneProduct, getPopularProducts, getProducts, getProductsOutOfStock, udpateProduct } from './product.controller.js'
import { createProductValidator, getOneProductValidator, updateProductValidator } from '../../helpers/validators.js'

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
        validateJwt
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

api.get(
    '/getPopularProducts',
    [
        validateJwt
    ],
    getPopularProducts
)

api.get(
    '/getProduct',
    [
        validateJwt,
        getOneProductValidator
    ],
    getOneProduct
)

export default api