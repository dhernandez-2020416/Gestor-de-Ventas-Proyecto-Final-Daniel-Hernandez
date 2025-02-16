import { Schema, model } from "mongoose";

const productSchema = new Schema({
        name: {
            type: String,
            required: [true, 'Product name is required'],
            unique: true,
            maxLength: [100, 'Cannot exceed 100 characters']
        },
        description: {
            type: String,
            maxLength: [500, 'Cannot exceed 500 characters']
        },
        price: {
            type: Number,
            required: [true, 'Product price is required'],
            min: [0, 'Price cannot be negative']
        },
        sale: {
            type: Number,
            default: 0,
            min: [0, 'Sale count cannot be negative']
        },
        status: {
            type: Boolean,
            default: true
        },
        stock: {
            type: Number,
            required: [true, 'Stock is required'],
            min: [0, 'Stock cannot be negative']
        },
        category: {
            type: Schema.Types.ObjectId,
            ref: 'Category',
            required: [true, 'Category ID is required']
        }
    }
)

productSchema.methods.toJSON = function(){
    const {__v, ...product} = this.toObject()
    return product
}

export default model('Product', productSchema)