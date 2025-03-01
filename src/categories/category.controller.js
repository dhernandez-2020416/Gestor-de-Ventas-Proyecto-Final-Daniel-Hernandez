import Category from './category.model.js'
import Product from '../product/product.model.js'

export const createCategory = async(req, res) =>{
    try {
        const { name, description } = req.body
        const category =  new Category(
            { 
                name: name.toLowerCase(), 
                description 
            }
        )

        const existingCategory = await Category.findOne({ name: name.toLowerCase() })

        if(existingCategory){
            return res.status(400).send(
                {
                    success: false,
                    message: 'Category with this name already exists'
                }
            )
        }

        await category.save()

        return res.send(
            {
                success: true,
                message: 'Category created succesfully',
                category
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

export const getCategories = async(req, res) =>{
    try {
        const categories = await Category.find()
        .populate(
            {
                path: 'products',
                select: '_id name description',
                match: { status: true }
            }
        )

        return res.send(
            {
                success: true,
                message: 'Categories found',
                categories
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

export const updateCategory = async(req, res) =>{
    try {
        const { idCategory } = req.params
        const { name, description} = req.body
    
        const updatedCategory = await Category.findByIdAndUpdate(
            idCategory,
            {
                name,
                description
            },
            {
                new: true
            }
        )

        if(!updatedCategory){
            return res.status(404).send(
                {
                    success: false,
                    message: 'Category not found'
                }
            )
        }

        return res.send(
            {
                success: true,
                message: 'Category updated successfully',
                updatedCategory
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

export const deleteCategory = async (req, res) => {
    try {
        const { idCategory } = req.params
        const category = await Category.findById(idCategory)
        
        if (!category) {
            return res.status(404).send(
                {
                    success: false,
                    message: 'Category not found'
                }
            )
        }
        
        let defaultCategory = await Category.findOne({ name: 'uncategorized' })
        
        if (!defaultCategory) {
            defaultCategory = new Category({ name: 'uncategorized', description: 'Default category', products: [] })
            await defaultCategory.save()
        }
        
        const productsInCategory = await Product.find({ category: idCategory })
        
        if (productsInCategory.length > 0) {

            await Product.updateMany({ category: idCategory }, { category: defaultCategory._id })

            const productIds = productsInCategory.map(product => product._id)
            defaultCategory.products.push(...productIds)
            await defaultCategory.save()
        }
        
        await Category.findByIdAndDelete(idCategory)
        
        return res.send(
            {
                success: true,
                message: 'Category deleted successfully',
                productsReassigned: productsInCategory.length
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

export const getOneCategory = async(req, res) => {
    try {
        const { name } = req.body

        const category = await Category.findOne(
            {
                name: name.toLowerCase()
            }
        )
        .populate(
            {
                path: 'products',
                select: 'name description price'
            }
        )

        if(!category){
            return res.status(404).send(
                {
                    success: false,
                    message: 'Category not found'
                }
            )
        }

        return res.send(
            {
                success: true,
                message: 'Category found',
                category
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