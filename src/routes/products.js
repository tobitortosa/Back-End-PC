const {Router} = require('express')
const {Producto} = require('../db')
const router = Router();
const {authAdmin} = require('../middlewares/authAdmin')

router.get("/", async (req, res) => {
    try {
        const {name} = req.query
        if(name) {
            const findByName = await Producto.findOne({where: {name, enabled:true}})
            res.status(200).json(findByName)
        } 
        const filters = req.query
        if(filters) {
            const allProducts = await Producto.findAll({
                where: {enabled: true}
            })
            const filteredProducts = allProducts.filter(elem => {
                let isValid = true;
                for(key in filters) {
                    // console.log(key, elem[key], filters[key]);
                    isValid = isValid && elem[key].toString() === filters[key]
                }
                return isValid
            })
            res.json(filteredProducts)
        } else {
            const allProducts = await Producto.findAll({
                where: {enabled: true}
            });
            res.json(allProducts)
        }
    } catch (error) {
        res.json(error)
    }
}); 

router.get('/:id', async (req,res) => {
    const {id} = req.params;
    try {
        const detailProduct = await Producto.findOne({
            where: {
                id,
                enabled: true,
            }
        })
        res.json(detailProduct)
    } catch (error) {
        res.json(error)
    }
})

router.post("/create",authAdmin(["admin"]), async(req, res) => {

    const {name, brand, cost, type, img, details} = req.body;
    
    try {
        if(!name || !brand || !cost || !type ) {
            return res.status(404).send("no se enviaron los requerimientos necesesarios")
        }
        const productCreate = await Producto.create({name, brand, cost, type, img, details});
        res.json(productCreate);
    } catch (error) {
        res.send(error)
    }
})

router.put("",authAdmin(["admin"]), async (req, res) => {
    const {name, brand, img, details, cost, type} = req.body;
    const {id} = req.query
    try {
        const productSelected = await Producto.findOne({
            where: {
                id,
                enabled: true,
            }
        })
        await productSelected.update({name, brand, img, details, cost, type})
        res.status(200).send(`Producto Actualizado`)
    } catch (error) {
        res.status(400).json(error)
    }
})

// Ruta para "eliminar", cambio enabled a false, no se elimina de la db
router.put("/:id",authAdmin(["admin"]), async (req, res) => {

    const {id} = req.params
    try {
        const product = await Producto.findOne({
            where: {
                id,
                enabled: true,
            }
        })
        await product.update({enabled: false})
        res.json(`Producto ${whatProduct} eliminado`)
    } catch (error) {
        res.send(error)
    }
})

module.exports = router




