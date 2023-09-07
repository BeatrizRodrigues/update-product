const Products = require('../models/Products');
const Packs = require('../models/Packs');

module.exports = class PacksController {

    static async getAll(req, res) {
        try {

            const packs = await Packs.findAll({
                attributes: {
                    exclude: ['createdAt', 'updatedAt']
                }
            });

            res.status(200).json({ packs: packs });

        } catch (error) {
            console.error('Erro ao buscar pacotes:', error);
            res.status(500).json({ message: 'Erro ao buscar pacotes.' });
        }
    }

    static async getById(req, res) {
        const code = req.params.id

        try {

            const packs = await Packs.findOne({
                where: {
                    product_id: code
                },
                attributes: {
                    exclude: ['createdAt', 'updatedAt']
                }
            });

            res.status(200).json({ packs: packs });

        } catch (error) {
            console.error('Erro ao buscar pacote:', error);
            res.status(500).json({ message: 'Erro ao buscar pacote.' });
        }
    }
}