import { Router } from 'express'
import { validateJwt, verifyAdminRole } from '../../middlewares/validate.jwt.js'
import { generateFacture, getPurchaseHistory, getPurchaseHistoryOfUser, updateInvoice } from './invoice.controller.js'
import { updateInvoiceOfUserValidator } from '../../helpers/validators.js'

const api = Router()

api.post(
    '/generateInvoice',
    [
        validateJwt
    ],
    generateFacture
)

api.get(
    '/getPurchaseHistory',
    [
        validateJwt
    ],
    getPurchaseHistory
)

api.get(
    '/getPurchaseHistoryOfUser/:userId',
    [
        validateJwt,
        verifyAdminRole
    ],
    getPurchaseHistoryOfUser
)

api.put(
    '/updateInvoiceOfUser/:invoiceId',
    [
        validateJwt,
        verifyAdminRole,
        updateInvoiceOfUserValidator
    ],
    updateInvoice
)

export default api