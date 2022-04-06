const router = require('express').Router({mergeParams: true})
const SerealizerProducts = require('../../../Serializer').SerealizerProducts
const Product = require('./Products')
const ProductsTable = require('./ProductsTable')

router.options('/', (req, res) => {
    res.set('Access-Control-Allow-Methods', 'GET, POST')
    res.set('Access-Control-Allow-Headers', 'Content-Type')
    res.status(204)
    res.end()
})

router.get('/', async (req, res) => {
    const products = await ProductsTable.list(req.provider.id)
    const serializer = new SerealizerProducts(
        res.getHeader('Content-Type')
    )
    res.send(
        serializer.serialize(products)
    )
})

router.options('/:id', (req, res) => {
    res.set('Access-Control-Allow-Methods', 'GET, HEAD, DELETE, PUT')
    res.set('Access-Control-Allow-Headers', 'Content-Type')
    res.status(204)
    res.end()
})

router.get('/:id', async (req, res, next) => {
    try {
        const data = {
            id: req.params.id,
            provider: req.provider.id
        }
    
        const product = new Product(data)
        await product.load()
        const serializer = new SerealizerProducts(
            res.getHeader('Content-Type'),
            ['price', 'inventory', 'provider', 'createdAt', 'updatedAt', 'version']
        )
        res.set('ETag', product.version)
        const timestamp = (new Date(product.updateData))
        res.set('Last-Modified', timestamp)
        res.send(
            serializer.serialize(product)
        )
    } catch (err) {
        next(err)
    }
})

router.head('/:id', async (req, res, next) => {
    try {
        const data = {
            id: req.params.id,
            provider: req.provider.id
        }
            const product = new Product(data)
        await product.load()
        res.set('ETag', product.version)
        const timestamp = (new Date(product.updateData))
        res.set('Last-Modified', timestamp)
        res.status(200)
        res.end()
    } catch (err) {
        next(err)
    }
})

router.post('/', async (req, res, next) => {
    try {
        const idProvider = req.provider.id
        const bodyProvider = req.body
        const data = Object.assign({}, bodyProvider, {provider: idProvider})
        const product = new Product(data)
    
        await product.create()
        const serializer = new SerealizerProducts(
            res.getHeader('Content-Type')
        )
        res.set('ETag', product.version)
        const timestamp = (new Date(product.updateData))
        res.set('Last-Modified', timestamp)
        res.set('Location', `/api/providers/${product.provider}/products/${product.id}`)
        res.status(201)
        res.send(
            serializer.serialize(product)
        )
    } catch (err) {
        next(err)
    }
})

router.options('/:id/decrease-inventory', (req, res) => {
    res.set('Access-Control-Allow-Methods', 'POST')
    res.set('Access-Control-Allow-Headers', 'Content-Type')
    res.status(204)
    res.end()
})

router.post('/:id/decrease-inventory', async (req, res, next) => {
    try {
        const product = new Product({
            id: req.params.id,
            provider: req.provider.id
        })
        await product.load()
        product.inventory = product.inventory - req.body.amount
        await product.decreaseInventory()
        await product.load
        res.set('ETag', product.version)
        const timestamp = (new Date(product.updateData))
        res.set('Last-Modified', timestamp)
        res.status(204)
        res.end()
    } catch (err) {
        next(err)
    }
})

// CONSERTAR O PUT, QUE NÃO ESTÁ ATT PREÇO NEM PEGANDO O ERRO CORRETO

router.put('/:id', async (req, res, next) => {
    try {
        const data = Object.assign(
            {}, 
            req.body, 
            {
                id: req.params.id,
                provider: req.provider.id
            }
        )
        const product = new Product(data)
        await product.load()
        await product.updateData()
        res.set('ETag', product.version)
        const timestamp = (new Date(product.updateData))
        res.set('Last-Modified', timestamp)
        res.status(204)
        res.end()
    } catch (err) {
        next(err)
    }
})

router.delete('/:id', async (req, res) => {
    const data = {
        id: req.params.id,
        provider: req.provider.id
    }

    const product = new Product(data)
    await product.deleteProduct()
    res.status(204)
    res.end()
})



module.exports = router