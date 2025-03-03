import Product from '../product/product.model.js'
import ShoppingCart from './shoppingCart.model.js'

export const addProductToShoppingCart = async(req, res) => {
    try {
        const userId = req.user.id
        const { product, quantity } = req.body

        const shoppingCart = await ShoppingCart.findOne(
            {
                user: userId
            }
        )

        const existProduct = await Product.findById(product)

        if(!existProduct){
            return res.status(404).send(
                {
                    success: false,
                    message: 'Product not found'
                }
            )
        }

        if (existProduct.status !== true) {
            return res.status(400).send(
                {
                    success: false,
                    message: 'This product is no longer available for purchase.'
                }
            )
        }

        if (quantity > existProduct.stock) {
            return res.status(400).send(
                {
                    success: false,
                    message: `Not enough stock. Only ${existProduct.stock} items available.`
                }
            )
        }

        const subTotal = existProduct.price * quantity

        const productIndex = shoppingCart.products.findIndex(item => item.product.toString() == product)

        if (productIndex > -1) {
            shoppingCart.products[productIndex].quantity = quantity
            shoppingCart.products[productIndex].subTotal = shoppingCart.products[productIndex].quantity * existProduct.price
        } else {
            shoppingCart.products.push({
                product,
                quantity,
                subTotal
            })
        }

        shoppingCart.totalAmount = shoppingCart.products.reduce((total, item) => total + item.subTotal, 0)

        await shoppingCart.save()

        const shoppingCartPopulated = await ShoppingCart.findById(shoppingCart._id)
            .populate(
                {
                    path: 'products.product',
                    select: 'name description price'
                }
            )

        return res.send(
            {
                success: true,
                message: 'Product added to cart successfully',
                shoppingCartPopulated
            }
        )
    } catch (err) {
        console.error(err)
        return res.status(500).send(
            {
                success: false,
                message: 'General error'
            }
        )
    }
}

export const deleteProductOfShoppingCart = async(req, res) => {
    try {
        const userId = req.user.id
        const { product } = req.body

        const shoppingCart = await ShoppingCart.findOne(
            {
                user: userId
            }
        )

        const productIndex = shoppingCart.products.findIndex(item => item.product.toString() == product)

        if(productIndex == -1){
            return res.status(404).send(
                {
                    success: false,
                    message: 'You do not have the product in your shopping cart'
                }
            )
        }

        await ShoppingCart.updateOne(
            { user: userId },
            { $pull: { products: { product: product } } }
        )

        const updatedShoppingCart = await ShoppingCart.findById(shoppingCart._id)

        updatedShoppingCart.totalAmount = updatedShoppingCart.products.reduce((total, item) => total + item.subTotal, 0)

        await updatedShoppingCart.save()

        const shoppingCartPopulated = await ShoppingCart.findById(updatedShoppingCart._id)
            .populate(
                {
                    path: 'products.product',
                    select: 'name description price'
                }
            )

        return res.send(
            {
                success: true,
                message: 'Product deleted to cart successfully',
                shoppingCartPopulated
            }
        )
    } catch (err) {
        console.error(err)
        return res.status(500).send(
            {
                success: false,
                message: 'General error'
            }
        )
    }
}

export const getShoppingCart = async(req, res) => {
    try {
        const userId = req.user.id

        const shoppingCart = await ShoppingCart.findOne(
            {
                user: userId
            }
        )

        const shoppingCartPopulated = await ShoppingCart.findById(shoppingCart._id)
            .populate(
                {
                    path: 'products.product',
                    select: 'name description price'
                }
            )

        return res.send(
            {
                success: true,
                message: 'There is your shopping cart',
                shoppingCartPopulated
            }
        )
    } catch (err) {
        console.error(err)
        return res.status(500).send(
            {
                success: false,
                message: 'General error'
            }
        )
    }
}