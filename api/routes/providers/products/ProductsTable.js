const instance = require("../../../database")
const NotFound = require("../../../errors/NotFound")
const ProductsModel = require("./ProductsModel")

module.exports = {
    list (idProvider) {
        return ProductsModel.findAll({
            where: {
                provider: idProvider
            },
            raw: true
        })
    },

    insert  (data) {
        return ProductsModel.create(data)
    },
    
    remove (idProduct, idProvider) {
        return ProductsModel.destroy({
            where: {
                id: idProduct,
                provider: idProvider
            }
        })
    },

    updateData (productData, dataToUpdate) {
        return ProductsModel.update(
            dataToUpdate, 
            {
                where: productData
            }
        )
    },

    subtract (idProduct, idProvider, field, amount) {
        return instance.transaction(async productTransaction => {
            const product = await ProductsModel.findOne({
                where: {
                    id: idProduct,
                    provider: idProvider
                }
            })

            product[field] = amount

            await product.save()

            return product
        })
    },

    async takeById (idProduct, idProvider) {
        const found = await ProductsModel.findOne({
            where: {
                id: idProduct,
                provider: idProvider
            },
            raw: true
        })

        if(!found) {
            throw new NotFound('Produto')
        }

        return found
    }


}