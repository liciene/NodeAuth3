const Model = require('./Model')
const NotFound = require('../../../api/errors/NotFound')


module.exports = {
    list () {
        return Model.findAll({ raw: true })
    },
    
    insert (provider) {
        return Model.create(provider)
    },

    async takeById (id) {
        const found = await Model.findOne({
            where: {
                id: id
            }
        })

        if(!found) {
            throw new NotFound('Fornecedor')
        }
        return found
    },

    updateData (id, dataToUpdate) {
        return Model.update(
            dataToUpdate, {
                where: {id: id}
            }
        )
    },

    deleteProvider (id) {
        return Model.destroy({
            where: {id: id}
        })
    }
}