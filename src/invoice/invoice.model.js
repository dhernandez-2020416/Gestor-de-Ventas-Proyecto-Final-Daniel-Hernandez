import mongoose, { model, Schema } from 'mongoose'

const invoiceSchema = new mongoose.Schema(
    {
        user: {
            type: Schema.Types.ObjectId,
            ref: 'User',
            required: true
        },
        products: [{
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
                type: Number,
                default: 0
            }
        }],
        totalAmount: {
            type: Number,
            default: 0
        },
        invoiceDate: {
            type: Date,
            default: Date.now
        }
    }
)

invoiceSchema.methods.toJSON = function() {
    const{__v, ...invoice} = this.toObject()
    return invoice
}

export default model('Invoice', invoiceSchema)