const Product = require('../models/Product');
const fs = require('fs');
const { likeProduct } = require('../controllers/like');

// récupère tout les produits
function getAllProduct(req, res) {
    Product.find({})
        .then(products => res.status(200).json(products))
        .catch(error => res.status(404).json({ error }));
}

// créer mon produit
function createProduct(req, res) {
    const {body, file} = req;
    const { filename } = file;
    const sauce = JSON.parse(body.sauce);
    const { userId, name, manufacturer, description, mainPepper, heat } = sauce;
    const product = new Product({
        userId,
        name,
        manufacturer,
        description,
        mainPepper,
        imageUrl: createImageUrl(req, filename),
        heat,
        likes: 0,
        dislikes: 0,
        usersLiked: [],
        usersDisliked: []
    });
    product.save()
        .then(() => res.status(201).json({ message: 'Produit créé !' }))
        .catch(error => res.status(400).json({ error }));
}

// créer l'url de l'image
function createImageUrl(req, filename) {
    // permet de récupèrer l'url entier de l'image
    return req.protocol + "://" + req.get("host") + "/images/" + filename
}

// affiche un produit par son id
function getProductById(req, res) {
    const { id } = req.params;
    Product.findById(id)
        .then(product => res.status(200).json(product))
        .catch(error => res.status(404).json({ error }));
}

// modifie un produit
function updateProduct(req, res) {
    const product = req.file ? {
        ...JSON.parse(req.body.sauce),
        imageUrl: createImageUrl(req, req.file.filename)
    } : { ...req.body}
    Product.findByIdAndUpdate(req.params.id, product)
        .then(() => res.status(200).json({ message: 'Produit modifié !' }))
        .catch(error => res.status(404).json({ error }));
}

// supprime un produit
function deleteProduct(req, res) {
    const { id } = req.params;
    Product.findByIdAndDelete(id)
        .then(deleteImage)
        .then(() => res.status(200).json({ message: 'Produit supprimé !' }))
        .catch(error => res.status(404).json({ error }));
}

// supprime l'image du produit
function deleteImage(product) {
    const imageUrl = product.imageUrl;
    const filePath = imageUrl.split("/images/")[1];
    fs.unlink(`images/${filePath}`, (error) => {
        if (error) {
            console.log(error);
        }
    });
    return product;
}

module.exports = { getAllProduct, createProduct, getProductById, deleteProduct, updateProduct, likeProduct };