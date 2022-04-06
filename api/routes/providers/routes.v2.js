const router = require('express').Router()

const ProvidersTable = require('./ProvidersTable')

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
        res.getHeader('Content-Type')
    )
    res.send(
        serializer.serialize(results)
    )
})

module.exports = router