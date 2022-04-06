const express = require('express')
const app = express()
const config = require('config')
const router = require('./routes/providers')
const routerV2 = require('./routes/providers/routes.v2')
const NotFound = require('./errors/NotFound')
const InvalidField = require('./errors/InvalidField')
const DataNotProvider = require('./errors/DataNotProvied')
const UnsupportedValue = require('./errors/UnsupportedValue')
const { acceptedFormats } = require('./Serializer')
const SerealizerError = require('./Serializer').SerealizerError

app.use(express.json())

app.use((req, res, next) => {
    let requiredFormat = req.header('Accept')

    if (requiredFormat === '*/*') {
        requiredFormat = 'application/json', 'application/xml'
    }

    if (acceptedFormats.indexOf(requiredFormat) === -1) {
        res.status(406)
        res.end()
        return
    }

    res.setHeader('Content-Type', requiredFormat)
    next()
})

app.use((req, res, next) => {
    res.set('Access-Control-Allow-Origin', '*')
    next()
})

app.use('/api/providers', router)
app.use('/api/v2/providers', routerV2)

app.use((err, req, res, next) => {
    let status = 500

    if (err instanceof NotFound) {
        status = 404
    } 
    if (err instanceof InvalidField || err instanceof DataNotProvider) {
        status = 400
    }
    if (err instanceof UnsupportedValue) {
        status = 406
    }
    const serializer = new SerealizerError(
        res.getHeader('Content-Type')
    )
    res.status(status)
    res.send(
        serializer.serialize({
            message: err.message,
            id: err.idError
        })
    )
})


app.listen(config.get('api.port'), () => console.log('API Funcionando'))