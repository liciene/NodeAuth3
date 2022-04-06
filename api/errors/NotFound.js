class NotFound extends Error {
    constructor (name) {
        super(`${name} não foi encontrado!`)
        this.name = 'NotFound'
        this.idError = 0
    }
}

module.exports = NotFound