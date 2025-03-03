import { Schema, model } from 'mongoose'

const shoppingCartSchema = new Schema(
    {
        user: {
            type: Schema.Types.ObjectId,
            ref: 'User',
            required: true
        },
        products: [
            {
                product: {
                    type: Schema.Types.ObjectId,
                    ref: 'Product',
                    required: true
                },
                quantity: {
                    type: Number,
                    required: true,
                    min: 1
                },
                subTotal: {
                    type: Number
                }
            }
        ],
        totalAmount: {
            type: Number,
            default: 0
        }
    }
)

shoppingCartSchema.methods.toJSON = function() {
    const { __v, user, ...shoppingCart } = this.toObject()
    return shoppingCart
}

export default model('ShoppingCart', shoppingCartSchema)