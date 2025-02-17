import Product from '../../src/product/product.model.js'
import Category from '../../src/categories/category.model.js'

export const createProduct = async (req, res) => {
    try {
        const { name, description, price, stock, category } = req.body

        const existingCategory = await Category.findById(category)
        if (!existingCategory) {
            return res.status(404).send({
                success: false,
                message: 'Category not found'
            })
        }

        const existingProduct = await Product.findOne({ name: req.body.name })
        
        if (existingProduct) {
            return res.status(400).send(
                {
                success: false,
                message: 'Product with this name already exists'
                }
            )
        }

        const product = new Product({ name, description, price, stock, category })
        await product.save()

        existingCategory.products.push(product._id)
        await existingCategory.save()

        const populatedProduct = await Product.findById(product._id).populate('category', '_id name description')

        return res.status(201).send({
            success: true,
            message: 'Product created successfully',
            product: populatedProduct
        })
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

export const udpateProduct = async(req, res) => {
    try {
        const { idProduct } = req.params
        const { name, description, price, sale, stock, category} = req.body

        const product = await Product.findById(idProduct)

        if(!product){
            return res.status(404).send(
                {
                    success: false,
                    message: 'Product not found'
                }
            )
        }

        if(product.status == false){
            return res.status(404).send(
                {
                    success: false,
                    message: 'Product not found'
                }
            )
        } 

        if (category) {
            const existingCategory = await Category.findById(category)
            if (!existingCategory) {
                return res.status(404).send({
                    success: false,
                    message: 'Category not found'
                })
            }
        }

        const updateProduct = await Product.findByIdAndUpdate(
            idProduct,
            {
                name,
                description,
                price,
                sale,
                stock,
                category
            },
            {
                new: true
            }
        )

        return res.send(
            {
                success: true,
                message: 'Product updated successfully',
                updateProduct
            }
        )
    } catch (err) {
        console.error(err)
        res.status(500).send(
            {
                success: false,
                message: 'General error'
            }
        )
    }
}

export const getProducts = async(req, res) =>{
    try {
        const products = await Product.find({ status: true }).populate('category', '_id name description')

        return res.send(
            {
                success: true,
                message: 'Products found',
                products
            }
        )
    } catch (err) {
        console.error(err)
        res.status(500).send(
            {
                success: false,
                message: 'General error'
            }
        )
    }
}

export const deleteProduct = async (req, res) => {
    try {
        const { idProduct } = req.params

        const product = await Product.findById(idProduct)

        if (!product) {
            return res.status(404).send({
                success: false,
                message: 'Product not found'
            })
        }

        if(product.status == false){
            return res.status(404).send(
                {
                    success: false,
                    message: 'Product not found'
                }
            )
        }

        product.status = false
        product.save()

        await Category.updateOne(
            { _id: product.category },
            { $pull: { products: idProduct } }
        )

        return res.send(
            {
                success: true,
                message: 'Product desactivated successfully',
                product
            }
        )
    } catch (err) {
        console.error(err)
        res.status(500).send(
            {
                success: false,
                message: 'General error'
            }
        )
    }
}

export const getProductsOutOfStock = async(req, res) => {
    try {
        const products = await Product.find({ stock: 0, status: true }).populate('category', '_id name description')

        return res.send(
            {
                success: true,
                message: 'Products out of stock:',
                products
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