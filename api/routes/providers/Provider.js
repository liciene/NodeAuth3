const DataNotProvider = require('../../errors/DataNotProvied')
const InvalidField = require('../../errors/InvalidField')
const ProvidersTable = require('./ProvidersTable')
class Provider {
    constructor ({id, company, email, category, createdAt, updatedAt, version}) {
        this.id = id
        this.company = company
        this.email = email
        this.category = category
        this.createdAt = createdAt
        this. updatedAt = updatedAt
        this.version = version
    }
    async createProvider () {
        this.validate()
        const result = await ProvidersTable.insert({
            company: this.company,
            email: this.email,
            category: this.category
        }) 

        this.id = result.id
        this.createdAt = result.createdAt
        this.updatedAt = result.updatedAt
        this.version = result.version
    }

    async charge () {
        const found = await ProvidersTable.takeById
        (this.id)
        this.company = found.company
        this.email = found.email
        this.category = found.category
        this.createdAt = found.createdAt
        this.updatedAt = found.updatedAt
        this.version = found.version
    }

    async updateData () {
        await ProvidersTable.takeById(this.id)
        const field = ['company', 'email', 'category']
        const dataToUpdate = {}

        field.forEach((field) => {
            const value = this[field]

            if (typeof value === 'string' && value.length > 0) {
                dataToUpdate[field] = value
            }
        })

        if (Object.keys(dataToUpdate).length === 0) {
            throw new DataNotProvider()
        }

        ProvidersTable.updateData(this.id, dataToUpdate)
    }

    deleteProvider () {
        return ProvidersTable.deleteProvider(this.id)
    }

    validate () {
        const field = ['company', 'email', 'category']

        field.forEach(field => {
            const value = this[field]

            if (typeof value !== 'string' || value.length === 0) {
                throw new InvalidField(field)
            }
        })
    }
}


module.exports = Provider