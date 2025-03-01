import User from '../user/user.model.js'
import { encrypt, checkPassword } from '../../utils/encrypt.js'
import { generateJwt } from '../../utils/jwt.js'
import ShoppingCart from '../shoppingCart/shoppingCart.model.js'

export const registerUser = async (req, res) => {
    try {
        const data = req.body

        data.password = await encrypt(data.password)

        data.role = 'CLIENT'

        let user = new User(data)

        const shoppingCart = new ShoppingCart({ user: user._id, products: [] })
        await shoppingCart.save()

        user.shoppingCart = shoppingCart._id

        await user.save()

        return res.send(
            {
                success: true,
                message: 'User registered successfully',
                user
            }
        )
    } catch (err) {
        console.error(err)
        return res.status(500).send({ message: 'General error' })
    }
}

export const loginUser = async (req, res) => {
    try {
        const { identifier, password } = req.body

        const user = await User.findOne({
            $or: [{ username: identifier }, { email: identifier }]
        })

        if (!user) {
            return res.status(400).send({ message: 'Wrong username, email, or password' })
        }

        if (user.status === false) {
            return res.status(403).send(
                {
                    success: false,
                    message: 'User account is inactive'
                }
            )
        }

        const isMatch = await checkPassword(password, user.password)
        if (!isMatch) {
            return res.status(400).send({ message: 'Wrong username, email, or password' })
        }

        let loggedUser = {
            id: user._id,
            name: user.name,
            username: user.username,
            email: user.email,
            status: user.status,
            role: user.role
        };

        let token = await generateJwt(loggedUser)

        return res.send({
            success: true,
            message: `Welcome ${user.name}`,
            loggedUser,
            token
        })
    } catch (err) {
        console.error(err);
        return res.status(500).send(
            { 
                success: false,
                message: 'General error' 
            }
        )
    }
}