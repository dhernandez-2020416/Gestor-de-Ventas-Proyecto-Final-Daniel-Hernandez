import { Router } from 'express'
import { validateJwt, verifyClientRole } from '../../middlewares/validate.jwt.js'
import { deleteUser, updatePassword, updateUser } from './user.controller.js'
import { deleteUserValidator, updateUserValidator } from '../../helpers/validators.js'

const api = Router()

api.put(
    '/updateProfile',
    [
        validateJwt,
        verifyClientRole,
        updateUserValidator
    ],
    updateUser
)

api.delete(
    '/deleteProfile',
    [
        validateJwt,
        verifyClientRole,
        deleteUserValidator
    ],
    deleteUser
)

api.put(
    '/updatePassword',
    [
        validateJwt,
        verifyClientRole,
    ],
    updatePassword
)

export default api