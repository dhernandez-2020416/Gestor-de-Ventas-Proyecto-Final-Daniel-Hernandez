import { checkPassword, encrypt } from '../../utils/encrypt.js'
import User from './user.model.js'

export const updateUser = async(req, res) =>{
    try {
        const userId = req.user.id
        const data = req.body

        const updateUser = await User.findByIdAndUpdate(
            userId,
            data,
            {
                new: true
            }
        )

        return res.send(
            {
                success: true,
                message: 'Profile updated successfully',
                updateUser
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

export const deleteUser = async(req, res) =>{
    try {
        const idUser = req.user.id
        const { password } = req.body
        const user = await User.findById(idUser)

        const isMatch = await checkPassword(password, user.password)

        if(!isMatch){
            return res.status(400).send({message: 'Wrong password or username'})
        }

        user.status = false
        await user.save()

        return res.send(
            {
                success: true,
                message: 'Profile desactivated succesfully',
                user
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

export const updatePassword = async (req, res) => {
    try {
        const userId = req.user.id
        const { oldPassword, newPassword } = req.body

        const user = await User.findById(userId)
        if (!user) {
            return res.status(404).send({
                success: false,
                message: 'User not found'
            })
        }

        const isMatch = await checkPassword(oldPassword, user.password)
        if (!isMatch) {
            return res.status(400).send({
                success: false,
                message: 'Wrong current password'
            })
        }

        user.password = await encrypt(newPassword)
        await user.save()

        return res.send({
            success: true,
            message: 'Password updated successfully'
        })
    } catch (err) {
        console.error(err)
        res.status(500).send({
            success: false,
            message: 'General error'
        })
    }
}