'use strict'

import express from 'express'
import morgan from 'morgan'
import helmet from 'helmet'
import cors from 'cors'
import { limiter } from '../middlewares/rate.limit.js'
import authRoutes from '../src/auth/auth.routes.js'
import userRoutes from '../src/user/user.routes.js'
import categoryRoutes from '../src/categories/category.routes.js'
import productRoutes from '../src/product/product.routes.js'
import shoppingCartRoutes from '../src/shoppingCart/shoppingCart.routes.js'
import invoiceRoutes from '../src/invoice/invoice.routes.js'

const configs = (app) =>{
    app.use(express.json())
    app.use(express.urlencoded({extended: false}))
    app.use(cors())
    app.use(helmet())
    app.use(limiter)
    app.use(morgan('dev'))
}

const routes = (app) =>{
    app.use('/v1/auth', authRoutes)
    app.use('/v1/user', userRoutes)
    app.use('/v1/category', categoryRoutes)
    app.use('/v1/product', productRoutes)
    app.use('/v1/shoppingCart', shoppingCartRoutes)
    app.use('/v1/invoice', invoiceRoutes)
}

export const initServer = async() =>{
    const app = express()
    try {
        configs(app)
        routes(app)
        app.listen(process.env.PORT) 
        console.log(`Server running in port ${process.env.PORT}`)
    } catch (err) {
        console.error('Server init failed', err)
    }
}