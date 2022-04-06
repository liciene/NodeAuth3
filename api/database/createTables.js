const models = [
    require('../routes/providers/Model'),
    require('../routes/providers/products/ProductsModel')

]

async function createTable () {
    for (let counter = 0; counter < models.length; counter++) {
        const model = models[counter]
        await model.sync()
    }
}

createTable()
