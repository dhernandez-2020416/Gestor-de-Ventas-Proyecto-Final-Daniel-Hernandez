import { Router } from 'express'
import { validateJwt } from '../../middlewares/validate.jwt.js'
import { addProductToShoppingCart, deleteProductOfShoppingCart, getShoppingCart } from './shoppingCart.controller.js'
import { addProductToShoppingCartValidator, deleteProductOfShoppingCartValidator } from '../../helpers/validators.js'

const api = Router()

api.post(
    '/addProductToShoppingCart',
    [
        validateJwt,
        addProductToShoppingCartValidator
    ],
    addProductToShoppingCart
)

api.delete(
    '/deleteProductOfShoppingCart',
    [
        validateJwt,
        deleteProductOfShoppingCartValidator
    ],
    deleteProductOfShoppingCart
)

api.get(
    '/getShoppingCart',
    [
        validateJwt
    ],
    getShoppingCart
)

export default api