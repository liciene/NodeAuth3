class DataNotProvider extends Error {
    constructor () {
        super('Não foram fornecidos dados para atualizar!')
        this.name = 'DataNotProvider'
        this.idError = 2
    }
}

module.exports = DataNotProvider