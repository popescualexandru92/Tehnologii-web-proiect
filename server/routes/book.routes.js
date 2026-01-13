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


