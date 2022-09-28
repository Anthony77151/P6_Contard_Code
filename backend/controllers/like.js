const Product = require('../models/Product');

// like un produit
function likeProduct(req, res) {
    const { id } = req.params;
    const { like, userId } = req.body;
    // évite un callback hell
    // si le like n'est pas défini sur 0, 1 ou -1
    if (![0, 1, -1].includes(like)) return res.status(400).json({ error });

    Product.findById(id)
        .then((product) => updateVote(product, like, userId, res))
        .then(product => product.save())
        .then(() => res.status(200).json({ message: 'Vote comptabiliser !' }))
        .catch(error => res.status(404).json({ error }));
}

// update le vote d'un produit
function updateVote(product, like, userId, res) {
    if (like === 1 || like === -1) return incrementVote(product, like, userId);
    if (like === 0) return resetVote(product, userId, res);
}

// incrémente le vote d'un produit
function incrementVote(product, like, userId) {
    const { usersLiked, usersDisliked } = product;

    // opérateur conditionnel ( like = 1 ? Si oui : Si non )
    const votersArray = like === 1 ? usersLiked : usersDisliked;
    // si l'utilisateur a déjà voter pour ce produit
    if (votersArray.includes(userId)) return product
    // si l'utilisateur n'a pas encore voter
    votersArray.push(userId);

    // si like = 1 ++like, sinon ++dislike
    like === 1 ? ++product.likes : ++product.dislikes;

    return product;
}

// reset le vote d'un produit
function resetVote(product, userId, res) {
    const { usersLiked, usersDisliked } = product;

    // En cas d'erreur :
    // si l'utilisateur a voter pour les deux choix
    if ([usersLiked, usersDisliked].every(array => !array.includes(userId))) return Promise.reject("Vous avez voté pour les deux choix !");
    // si l'utilisateur n'a pas encore voter
    if (![usersLiked, usersDisliked].some(array => array.includes(userId))) return Promise.reject("Vous n'avez pas encore voté !");
    
    if (usersLiked.includes(userId)) {
        // si l'utilisateur a voter pour le like
        --product.likes;
        product.usersLiked = product.usersLiked.filter(id => id !== userId);
    } else {
        // si l'utilisateur a voter pour le dislike
        --product.dislikes;
        product.usersDisliked = product.usersDisliked.filter(id => id !== userId);
    }

    return product;
}

module.exports = { likeProduct };