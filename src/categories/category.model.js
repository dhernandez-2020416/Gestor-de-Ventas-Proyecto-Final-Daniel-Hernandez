import { Schema, model } from "mongoose";

const categorySchema = Schema(
    {
        name:{
            type: String,
            required: [true, 'Name is required'],
            maxLength: [30, `Name can't exceed 30 characters`]
        },
        description: {
            type: String,
            required: [true, 'Description is required'],
            maxLength: [150, `Description can't exceed 150 characters`]
        },
        products: [{
            type: Schema.Types.ObjectId,
            ref: 'Product'
        }]
    }
)

categorySchema.methods.toJSON = function(){
    const {__v, ...category} = this.toObject()
    return category
}

export default model('Category', categorySchema)