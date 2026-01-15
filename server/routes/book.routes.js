const {Book}=require('../database/models/')
const express=require('express')
const {verifyToken}=require('../utils/token.js')

const router=express.Router();

// Get all books for the authenticated user
router.get('/my-books', verifyToken, async(req,res)=>{
    try{
        const userId = req.user.id;
        const books = await Book.findAll({
            where: { userId },
            order: [['created_at', 'DESC']]
        });
        res.status(200).json({success: true, message: 'Books retrieved successfully', data: books});
    } catch(err){
         console.error('Error fetching books:', err);
         res.status(500).json({success: false, message: 'Error fetching books', data: err.message});
    }
})

router.post('/', verifyToken, async(req,res)=>{
    try{
        const book= await Book.create({
            ...req.body
        })
        res.status(201).json({success: true, message: 'Book successfully added', data: book});
    } catch(err){
         console.error('Error adding book:', err);
         res.status(500).json({success: false, message: 'Error adding book', data: err.message});
    }
})

router.delete('/:id', verifyToken, async (req, res) => {
    try {
        const id = req.params.id;
        const userId = req.user.id;

        if (isNaN(id)) {
            return res.status(400).json({success: false, message: 'Book id is not valid', data: {}})
        }

        const book = await Book.findOne({ where: { id, userId } });

        if (!book) {
            return res.status(404).json({success: false, message: 'Book not found or you do not have permission to delete it', data: {}})
        }

        await book.destroy();

        res.status(200).json({success: true, message: 'Book successfully deleted', data: {}});
    } catch (error) {
        console.error('Error deleting book:', error);
        res.status(500).json({success: false, message: 'Error deleting book', data: error.message});
    }
})

module.exports = router;
