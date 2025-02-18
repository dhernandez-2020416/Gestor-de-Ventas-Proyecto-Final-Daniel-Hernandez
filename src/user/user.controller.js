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

export const createUserByAdmin = async(req, res) => {
    try {
        const { name, surname, username, email, password, phone, role } = req.body

        const user = new User({ name, surname, username, email, password, phone, role })

        await user.save()

        return res.send(
            {
                success: true,
                message: 'User added successfully',
                user
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

export const udpateUserByAdmin = async(req, res) => {
    try {
        const { userId } = req.params
        const { name, surname, username, email, password, phone } = req.body

        const user = await User.findById(userId)
        
        if(!user){
            return res.status(404).send(
                {
                    success: false,
                    message: 'User not found'
                }
            )
        }

        if(user.status == false){
            return res.status(404).send(
                {
                    success: false,
                    message: 'User desactivated'
                }
            )
        } 

        const updateUser = await User.findByIdAndUpdate(
            userId,
            {
                name,
                surname,
                username,
                email,
                password,
                phone
            },
            {
                new: true
            }
        )

        return res.send(
            {
                success: true,
                message: 'User updated successfully',
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

export const udpateRoleByAdmin = async(req, res) => {
    try {
        const { userId } = req.params
        const { role } = req.body

        const user = await User.findById(userId)
        
        if(!user){
            return res.status(404).send(
                {
                    success: false,
                    message: 'User not found'
                }
            )
        }

        if(user.status == false){
            return res.status(404).send(
                {
                    success: false,
                    message: 'User desactivated'
                }
            )
        }

        if (user.role === 'ADMIN' && role === 'ADMIN') {
            return res.status(400).send({
                    success: false,
                    message: 'User is already an ADMIN'
                }
            )
        }

        if (user.role === 'CLIENT' && role === 'CLIENT') {
                return res.status(400).send({
                    success: false,
                    message: 'User is already a CLIENT'
                }
            )
        }

        if (user.role === 'ADMIN' && role === 'CLIENT') {
            return res.status(403).send({
                    success: false,
                    message: 'Cannot degrade an ADMIN to CLIENT'
                }
            )
        }

        user.role = role
        await user.save()
        return res.send({
                success: true,
                message: 'Role updated successfully',
                user
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

export const deleteUserByAdmin = async (req, res) => {
    try {
        const { userId } = req.params

        const user = await User.findById(userId)
        
        if (!user) {
            return res.status(404).send(
                {
                    success: false,
                    message: 'User not found'
                }
            )
        }

        user.status = false
        
        await user.save()

        res.send(
            {
                success: true,
                message: 'User deactivated successfully'
            }
        )
    } catch (err) {
        console.error(err)
        res.status(500).send(
            {
                success: false,
                message: 'General Error'
            }
        )
    }
}