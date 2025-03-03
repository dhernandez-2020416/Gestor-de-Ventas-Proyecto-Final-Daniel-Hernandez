import Invoice from './invoice.model.js'
import ShoppingCart from '../shoppingCart/shoppingCart.model.js'
import Product from '../product/product.model.js'

export const generateFacture = async(req, res) => {
    try {
        const userId = req.user.id

        const shoppingCart = await ShoppingCart.findOne(
            {
                user: userId
            }
        )
        
        if (!shoppingCart || shoppingCart.products.length === 0) {
            return res.status(400).send(
                {
                    success: false,
                    message: 'Your shopping cart is empty, cannot generate an invoice.'
                }
            )
        }

        for (let item of shoppingCart.products) {
            const product = await Product.findById(item.product._id)

            if (!product || product.status !== true) {
                return res.status(400).send(
                    {
                        success: false,
                        message: `Product: ${product ? product.name : 'Unknown'} is not available for purchase.`
                    }
                )
            }

            if (item.quantity > product.stock) {
                return res.status(400).send(
                    {
                        success: false,
                        message: `Not enough stock for product: ${product.name}. Only ${product.stock} items available.`
                    }
                )
            }
        }

        for (let item of shoppingCart.products) {
            const product = await Product.findById(item.product._id)

            product.stock -= item.quantity

            product.sale += item.quantity

            await product.save()
        }

        const invoiceProducts = shoppingCart.products.map(item => {
            return {
                product: item.product._id,
                quantity: item.quantity,
                subTotal: item.subTotal
            }
        })

        const invoice = new Invoice(
            {
                user: userId,
                products: invoiceProducts,
                totalAmount: shoppingCart.totalAmount
            }
        )

        await invoice.save()

        await ShoppingCart.updateOne(
            { user: userId }, 
            { $set: { products: [], totalAmount: 0 } }
        )

        const populatedInvoice = await Invoice.findById(invoice._id)
            .populate(
                {
                    path: 'products.product',
                    select: 'name description price'
                }
            )
            .populate(
                {
                    path: 'user',
                    select: 'name surname email phone'
                }
            )

        return res.send(
            {
                success: true,
                message: 'Invoice generated successfully',
                populatedInvoice
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

export const getPurchaseHistory = async(req, res) => {
    try {
        const { limit = 20, skip = 0 } = req.query
        const userId = req.user.id
        const invoices = await Invoice.find(
            {
                user: userId
            }
        )
        .populate(
            {
                path: 'products.product',
                select: 'name description price'
            }
        )
        .populate(
            {
                path: 'user',
                select: 'name surname email phone'
            }
        )
        .skip(skip)
        .limit(skip)


        return res.send(
            {
                success: true,
                message: 'There is your inovices',
                invoices
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

export const getPurchaseHistoryOfUser = async(req, res) => {
    try {
        const { limit = 20, skip = 0 } = req.query
        const { userId } = req.params
        const invoices = await Invoice.find(
            {
                user: userId
            }
        )
        .populate(
            {
                path: 'products.product',
                select: 'name description price'
            }
        )
        .populate(
            {
                path: 'user',
                select: 'name surname email phone'
            }
        )
        .skip(skip)
        .limit(limit)


        return res.send(
            {
                success: true,
                message: 'Here is the purchase history of the user',
                invoices
            }
        )
    } catch (err) {
        console.error(err)
        return res.status(500).send(
            {
                success: false,
                message: 'General error '
            }
        )
    }
}

export const updateInvoice = async(req, res) => {
    try {
        const { invoiceId } = req.params
        const { product, quantity } = req.body

        const invoice = await Invoice.findById(invoiceId)

        if (!invoice) {
            return res.status(404).send(
                {
                    success: false,
                    message: 'Invoice not found'
                }
            )
        }


        const productInInvoice = invoice.products.find(item => item.product.toString() === product)
        
        if (!productInInvoice) {
            return res.status(400).send(
                {
                    success: false,
                    message: 'Product not found in the invoice'
                }
            )
        }

        const productDetails = await Product.findById(product)

        if (!productDetails || productDetails.status !== true) {
            return res.status(400).send(
                {
                    success: false,
                    message: `Product: ${productDetails ? productDetails.name : 'Unknown'} is not available for purchase.`
                }
            )
        }

        if (quantity > productDetails.stock) {
            return res.status(400).send({
                success: false,
                message: `Not enough stock for product: ${productDetails.name}. Only ${productDetails.stock} items available.`
            })
        }

        if (quantity < productInInvoice.quantity) {
            const difference = productInInvoice.quantity - quantity
            productDetails.stock += difference
            productDetails.sale -= difference
        }
        
        if (quantity > productInInvoice.quantity) {
            const difference = quantity - productInInvoice.quantity
            productDetails.stock -= difference
            productDetails.sale += difference
        }

        productInInvoice.quantity = quantity
        productInInvoice.subTotal = quantity * productDetails.price

        invoice.totalAmount = invoice.products.reduce((total, item) => total + item.subTotal, 0)

        await productDetails.save()
        await invoice.save()

        const populatedInvoice = await Invoice.findById(invoice._id)
            .populate(
                {
                    path: 'products.product',
                    select: 'name description price'
                }
            )
            .populate(
                {
                    path: 'user',
                    select: 'name surname email phone'
                }
            )

        return res.send(
            {
                success: true,
                message: 'Invoice updated successfully',
                populatedInvoice
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