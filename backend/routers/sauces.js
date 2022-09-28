const express = require('express');
const saucesRouter = express.Router();

const { getAllProduct, createProduct, getProductById, deleteProduct, updateProduct, likeProduct } = require('../controllers/products');
const { authenticateUser } = require('../controllers/auth');
const { upload } = require('../middleware/multer');

saucesRouter.get('/', authenticateUser, getAllProduct);
saucesRouter.post('/', authenticateUser, upload.single("image"),createProduct);
saucesRouter.get('/:id', authenticateUser, getProductById);
saucesRouter.delete('/:id', authenticateUser, deleteProduct);
saucesRouter.put('/:id', authenticateUser, upload.single("image"), updateProduct);
saucesRouter.post('/:id/like', authenticateUser, likeProduct);

module.exports = {saucesRouter};