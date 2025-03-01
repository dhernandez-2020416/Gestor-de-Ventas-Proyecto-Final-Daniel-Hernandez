import { Schema, model } from 'mongoose'
import ShoppingCart from  '../shoppingCart/shoppingCart.model.js'
import { encrypt } from '../../utils/encrypt.js'

const userSchema = new Schema({
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
    shoppingCart: {
        type: Schema.Types.ObjectId,
        ref: 'ShoppingCart'
    }
})

userSchema.methods.toJSON = function () {
    const { __v, password, shoppingCarts, ...user } = this.toObject()
    return user
}

const User = model("User", userSchema)

const createAdmin = async () => {   
    try {
        const adminExists = await User.findOne({
            $or: [{ username: "dhernandez" }, { email: "dhernandez@gmail.com" }]
        })
        if (!adminExists) {
            const hashedPassword = await encrypt("21342@Af")
            const admin = new User({
                name: "Daniel",
                surname: "Hernández",
                username: "dhernandez",
                email: "dhernandez@gmail.com",
                password: hashedPassword,
                phone: "12345678",
                role: "ADMIN",
            })

            const shoppingCart = new ShoppingCart({ user: admin._id, products: [] })
            await shoppingCart.save()

            admin.shoppingCart = shoppingCart._id

            await admin.save()
        }
    } catch (err) {
        console.error('Error creating default admin:', err)
    }
}

createAdmin()

export default User