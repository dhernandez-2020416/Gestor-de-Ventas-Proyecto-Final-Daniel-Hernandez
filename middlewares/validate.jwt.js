'use strict'

import jwt from 'jsonwebtoken'
import { existUserById } from '../helpers/db.validators.js'

export const validateJwt = async(req, res, next)=>{
    try {
        let secretKey = process.env.SECRET_KEY

        let { authorization } = req.headers

        if(!authorization){
            return res.status(401).send({message: 'Unauthorized'})
        }

        let user = jwt.verify(authorization, secretKey)

        if(!user || !user.id || !user.role){
            return res.status(401).send({message: 'Invalid data token'})
        }

        const validateUser = await existUserById(user.id)
        if(validateUser != true){
            return res.status(404).send(
                {
                    success: false,
                    message: 'User not found'
                }
            )
        }

        req.user = user

        next()
    } catch (err) {
        console.error(err)
        res.status(401).send({message: 'Invalid token or expired'})
    }
}

export const verifyClientRole = (req, res, next) => {
    if (!req.user || req.user.role !== 'CLIENT') {
        return res.status(403).send({ message: 'Access denied. Only clients can perfom this action.' })
    }
    next();
}

export const verifyAdminRole = (req, res, next) => {
    if (!req.user || req.user.role !== 'ADMIN') {
        return res.status(403).send({ message: 'Access denied. Only admins can perform this action.' })
    }
    next()
}