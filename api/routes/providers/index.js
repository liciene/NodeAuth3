const router = require('express').Router()

const ProvidersTable = require('./ProvidersTable')

const Provider = require('./Provider')

const SerealizerProvider = require('../../Serializer').SerealizerProvider

router.options('/', (req, res) => {
    res.set('Access-Control-Allow-Methods', 'GET, POST')
    res.set('Access-Control-Allow-Headers', 'Content-Type')
    res.status(204)
    res.end()
})

router.get('/', async (req, res) => {
    const results = await ProvidersTable.list()
    res.status(200)
    const serializer = new SerealizerProvider(
        res.getHeader('Content-Type'),
        ['company']
    )
    res.send(
        serializer.serialize(results)
    )
})

router.post('/', async (req, res, next) => {
    try {
        const receivedData = req.body
        const provider = new Provider(receivedData)
    
        await provider.createProvider()
        res.status(201)
        const serializer = new SerealizerProvider(
            res.getHeader('Content-Type'),
            ['company']
        )
        res.send(
            serializer.serialize(provider)
        )
    } catch (err) {
        next(err)
    }
})

router.options('/:idProvider', (req, res) => {
    res.set('Access-Control-Allow-Methods', 'GET, PUT, DELETE')
    res.set('Access-Control-Allow-bHeaders', 'Content-Type')
    res.status(204)
    res.end()
})

router.get('/:idProvider', async (req, res, next) => {
    try {
        const id = req.params.idProvider
        const provider = new Provider({id: id})
        await provider.charge()
        res.status(200)
        const serializer = new SerealizerProvider(
            res.getHeader('Content-Type'),
            ['company', 'email', 'createdAt', 'updatedAt', 'version']
        )
        res.send(
            serializer.serialize(provider)
        )
    } catch (err) {
        next(err)
    }
})

router.put('/:idProvider', async (req, res, next) => {
    
    try {
        const id = req.params.idProvider
        const receivedData = req.body
        const data = Object.assign({}, receivedData, { id: id })
        const provider = new Provider(data)
        await provider.updateData()
        res.status(204)
        res.end()
    } catch (err) {
        next(err)
    }
})

router.delete('/:idProvider', async (req, res, next) => {
    try {
        const id = req.params.idProvider
        const provider = new Provider({id: id})
        await provider.charge()
        await provider.deleteProvider()
        res.status(204)
        res.end()
    } catch (err) {
        next(err)
    }
}) 

const routerProducts = require('./products')

const verifyProvider = async (req, res, next) => {
    try {
        const id = req.params.idProvider
        const provider = new Provider ({id: id})
        await provider.charge()
        req.provider = provider
        next()
    } catch (err) {
        next(err)
    }
}

router.use('/:idProvider/products', verifyProvider, routerProducts)

module.exports = router