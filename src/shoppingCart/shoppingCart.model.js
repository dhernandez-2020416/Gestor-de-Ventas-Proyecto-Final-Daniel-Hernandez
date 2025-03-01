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
                price: {
                    type: Number,
                    required: true
                },
                total: {
                    type: Number,
                    required: true
                }
            }
        ],
        totalAmount: {
            type: Number,
            required: true,
            default: 0
        }
    }
)

export default model('ShoppingCart', shoppingCartSchema);