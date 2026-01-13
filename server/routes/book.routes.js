const {Book}=require('.../database/models/')
const express=require('express')
const {verifyToken}=require('.../utils/token.js')

const router=express.Router();

router.post('/', verifyToken, async(req,res)=>{
    try{
        const book= await Book.create({
            ...req.body
        })
        res.status(201).json({success: true, message: 'Book successfully', data: book});
    } catch(err){
         res.status(500).json({success: false, message: 'Error adding', data: error.message});
    }
})

router.delete('/:id', verifyToken, async (req, res) => {
    try {
        const id = req.params.id;

        if (isNaN(id)) {
            return res.status(400).json({success: false, message: 'Product id is not valid', data: {}})
        }

        const product = await Product.findByPk(id);

        if (!product) {
            return res.status(404).json({success: false, message: 'Product not found', data: {}})
        }

        await product.destroy();

        res.status(200).json({success: true, message: 'Product successfully deleted', data: {}});
    } catch (error) {
        res.status(500).json({success: false, message: 'Error deleting product', data: error.message});
    }
})

