const jsontoxml = require('jsontoxml')

const UnsupportedValue = require("./errors/UnsupportedValue")

class Serializer {
    json (data) {
        return JSON.stringify(data)
    }

    xml (data) {
        let tag = this.singularTag

        if (Array.isArray(data)) {
            tag = this.pluralTag
            data = data.map((item) => {
                return {
                    [this.singularTag]: item
                }
            })
        }
        return jsontoxml({[tag]: data})
    }

    serialize (data){
        data = this.filter(data)
        if (this.contentType === 'application/json') {
            return this.json(data)
        }
        if (this.contentType === 'application/xml') {
            return this.xml(data)
        }

        throw new UnsupportedValue(this.contentType)
    }

    filterObject (data) {
        const newObject = {}

        this.publicFields.forEach((field) => {
            if (data.hasOwnProperty(field)) {
                newObject[field] = data[field]
            }
        })

        return newObject
    }

    filter (data) {
        if (Array.isArray(data)) {
            data = data.map(item => {
                return this.filterObject(item)
            })
        } else {
            data = this.filterObject(data)
        }

        return data
    }
}

class SerealizerProvider extends Serializer{
    constructor (contentType, extraFields) {
        super()
        this.contentType = contentType
        this.publicFields = ['id', 'category'].concat(extraFields || [])
        this.singularTag = 'provider'
        this.pluralTag = 'providers'
    }
}

class SerealizerProducts extends Serializer {
    constructor (contentType, extraFields) {
        super()
        this.contentType = contentType
        this.publicFields = ['id', 'title'].concat(extraFields || [])
        this.singularTag = 'product'
        this.pluralTag = 'products'
    }
}

class SerealizerError extends Serializer{
    constructor (contentType, extraFields) {
        super()
        this.contentType = contentType
        this.publicFields = ['id', 'message'].concat(extraFields || [])
        this.singularTag = 'err'
        this.pluralTag = 'errs'
    }
}

module.exports = {
    Serializer: Serializer,
    SerealizerProvider: SerealizerProvider,
    SerealizerError: SerealizerError,
    SerealizerProducts: SerealizerProducts,
    acceptedFormats: ['application/json', 'application/xml']
}