const jwt = require('jsonwebtoken');

// Vérification de l'authentification de l'utilisateur
function authenticateUser(req, res, next) {
    const header = req.headers.authorization;
    const token = header.split(' ')[1];
    // on vérifie le token 
    if(!token){
        return res.status(401).json({ error: 'Vous devez être connecté pour accéder à cette ressource' });
    }
    // on vérifie que le token est valide
    jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
        if(err){
            // si le token est invalide
            return res.status(401).json({ error: 'Vous devez être connecté pour accéder à cette ressource' });
        }
        next();
    });
}

module.exports = { authenticateUser };