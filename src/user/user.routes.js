import { Router } from 'express'
import { validateJwt, verifyAdminRole, verifyClientRole } from '../../middlewares/validate.jwt.js'
import { createUserByAdmin, deleteUser, deleteUserByAdmin, udpateRoleByAdmin, udpateUserByAdmin, updatePassword, updateUser } from './user.controller.js'
import { createUserByAdminValidator, deleteUserValidator, udpateUserByAdminValidator, updatePasswordValidator, updateRoleByAdminValidator, updateUserValidator } from '../../helpers/validators.js'

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
        updatePasswordValidator
    ],
    updatePassword
)

api.post(
    '/createUserByAdmin',
    [
        validateJwt,
        verifyAdminRole,
        createUserByAdminValidator
    ],
    createUserByAdmin
)

api.put(
    '/updateUserByAdmin/:userId',
    [
        validateJwt,
        verifyAdminRole,
        udpateUserByAdminValidator
    ],
    udpateUserByAdmin
)

api.put(
    '/updateRoleByAdmin/:userId',
    [
        validateJwt,
        verifyAdminRole,
        updateRoleByAdminValidator
    ],
    udpateRoleByAdmin
)

api.delete(
    '/deleteUserByAdmin/:userId',
    [
        validateJwt,
        verifyAdminRole
    ],
    deleteUserByAdmin
)

export default api