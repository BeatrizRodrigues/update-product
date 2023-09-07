const Products = require('../models/Products');
const Packs = require('../models/Packs');

module.exports = class ProductsController {

    static async updatePrice(req, res) {

        const codeProduct = req.body.product_code
        const newPrice = req.body.new_price
      
        if (!newPrice) {
            res.status(422).json({ message: 'O preço é obrigatório!' })
            return
        }

        try {

            const productExist = await Products.findOne({
                where: {
                    code: codeProduct
                },
                attributes: {
                    exclude: ['createdAt', 'updatedAt']
                }
            });

            if (!productExist) {
                res.status(422).json({ message: 'Produto não existe !' })
                return
            }
            
            if (parseFloat(productExist.cost_price) > newPrice){
                res.status(422).json({ message: 'Preço menor que custo' })
                return
            }
            
            var resultadoMaior = parseFloat(productExist.sales_price) + ((0.1*productExist.sales_price))
            var resultadoMenor = parseFloat(productExist.sales_price) - (0.1*productExist.sales_price)

            if (newPrice > parseFloat(resultadoMaior.toFixed(2))
                || newPrice < parseFloat(resultadoMenor.toFixed(2))){
                
                res.status(422).json({ message: 'Preço menor ou maior que 10% do valor atual' })
                return  
            }

            const productPack = await Packs.findOne({
                where: {
                    product_id: codeProduct
                },
                attributes: {
                    exclude: ['createdAt', 'updatedAt']
                }
            });

            if (productPack) {

                const packsUpdate = await Products.findOne({
                    where: {
                        code: productPack.pack_id
                    },
                    attributes: {
                        exclude: ['createdAt', 'updatedAt']
                    }
                });

                if (packsUpdate) {
                    const packPrice = packsUpdate.sales_price - (productExist.sales_price * productPack.qty);
                    const newPackPrice = packPrice + (newPrice * productPack.qty);

                    await Products.update(
                        { sales_price: newPackPrice.toFixed(2) },
                        {
                            where: {
                                code: productPack.pack_id
                            },
                            attributes: {
                                exclude: ['updatedAt']
                            }
                        }
                    );
                }

                await Products.update(
                    { sales_price: newPrice }, {
                    where: {
                        code: codeProduct
                    },
                    attributes: {
                        exclude: ['updatedAt']
                    }
                });

                res.status(200).json({ products: productExist, message: 'Produto atualizado com sucesso!' });

            }

        } catch (error) {
            console.error('Erro ao atualizar registros:', error);
            res.status(500).json({ message: 'Erro ao atualizar o produto.' });
        }

    }

    static async getAll(req, res) {
        try {

            const products = await Products.findAll({
                attributes: {
                    exclude: ['createdAt', 'updatedAt']
                }
            });

            res.status(200).json({ products: products });

        } catch (error) {
            console.error('Erro ao buscar produtos:', error);
            res.status(500).json({ message: 'Erro ao buscar produtos.' });
        }
    }

    static async getById(req, res) {
        const code = req.params.id

        try {

            const products = await Products.findOne({
                where: {
                    code: code
                },
                attributes: {
                    exclude: ['createdAt', 'updatedAt']
                }
            });

            res.status(200).json({ products: products });

        } catch (error) {
            console.error('Erro ao buscar produto:', error);
            res.status(500).json({ message: 'Erro ao buscar produto.' });
        }
    }
}