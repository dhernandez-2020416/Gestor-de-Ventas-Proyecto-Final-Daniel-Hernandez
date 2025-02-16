import { Router } from 'express'
import{
    registerUser,
    loginUser
} from './auth.controller.js'
import {
    registerValidator,
    loginValidator
} from '../../helpers/validators.js'

const api = Router()

api.post(
    '/registerUser',
    [
        registerValidator
    ],
    registerUser
)

api.post(
    '/loginUser',
    [
        loginValidator
    ],
    loginUser
)

export default api