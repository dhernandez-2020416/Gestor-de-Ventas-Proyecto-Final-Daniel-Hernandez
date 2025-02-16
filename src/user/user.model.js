import { Schema, model } from 'mongoose'

const userSchema = Schema(
    {  
        name: {
            type: String,
            required: [true, 'Name is required'],
            maxLength: [25, `Can't exceed 25 characters`],
        },
        surname: {
            type: String,
            required: [true, 'Surname is required'],
            maxLength: [25, `Can't exceed 25 characters`],
        },
        username: {
            type: String,
            required: [true, 'Username is required'],
            unique: true,
            lowercase: true,
            maxLength: [15, `Can't exceed 15 characters`],
        },
        email: {
            type: String,
            unique: true,
            lowercase: true,
            required: [true, 'Email is required']
        },
        password: {
            type: String,
            required: [true, 'Password is required'],
            minLength: [8, 'Password must be at least 8 characters'],
            maxLength: [100, `Can't exceed 100 characters`],
        },
        phone: {
            type: String,
            required: [true, 'Phone is required'],
            maxLength: [8, `Can't exceed 8 numbers`],
            minLength: [8, 'Phone must be 8 numbers']
        },
        status: {
            type: Boolean,
            default: true
        },
        role: {
            type: String,
            required: [true, 'Role is required'],
            uppercase: true,
            enum: ['ADMIN', 'CLIENT']
        },
        shoppingCarts: [{
            type: Schema.Types.ObjectId,
            ref: 'shopingCart'
        }]
    }
)

userSchema.methods.toJSON = function(){
    const {__v, password, shoppingCarts, ...user} = this.toObject()
    return user
}

export default model('User', userSchema)