const DataNotProvider = require("../../../errors/DataNotProvied")
const InvalidField = require("../../../errors/InvalidField")
const ProductsTable = require("./ProductsTable")

class Product {
    constructor ({ 
        id, 
        title, 
        price, 
        inventory, 
        provider, 
        createdAt, 
        updatedAt, 
        version
    }) {
        this.id = id
        this.title = title
        this. price = price
        this.inventory = inventory
        this.provider = provider
        this.createdAt = createdAt
        this.updatedAt = updatedAt
        this.version = version
    }

    validate () {
        if (typeof this.title !== 'string' || this.title.length === 0) {
            throw new InvalidField('título')
        }

        if(typeof this.price !== 'number' || this.price === 0) {
            throw new InvalidField('preço')
        }
    }

    async load () {
        const product = await ProductsTable.takeById(this.id, this.provider)
        this.title = product.title
        this.price = product.price
        this.inventory = product.inventory
        this.createdAt = product.createdAt
        this.updatedAt = product.updatedAt
        this.version = product.version
    }

    updateData () {
        const dataToUpdate = {}
        if (typeof this.title === 'string' && this.title.length >0) {
            dataToUpdate.title = this.title
        }

        if (typeof this.price === 'number' && this.price.length > 0) {
            dataToUpdate.price = this.price
        }
        if (typeof this.inventory === 'number') {
            dataToUpdate.inventory = this.inventory
        }
        if (Object.keys(dataToUpdate).length === 0) {
            throw new DataNotProvider()
        }
        return ProductsTable.updateData(
            {
                id: this.id,
                provider: this.provider
            },
            dataToUpdate
        )
    }

    async create () {
        this.validate()
        const result = await ProductsTable.insert({
            title: this.title, 
            price: this. price, 
            inventory: this.inventory, 
            provider: this.provider, 
        })

        this.id = result.id
        this.createdAt = result.createdAt
        this.updatedAt = result.updatedAt
        this.version = result.version
    }

    deleteProduct () {
        return ProductsTable.remove(this.id, this.provider)
    }

    decreaseInventory () {
        return ProductsTable.subtract(
            this.id,
            this.provider,
            'inventory',
            this.inventory
        )
    }

}

module.exports = Product