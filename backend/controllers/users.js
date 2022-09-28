const User = require('../models/User');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

// créer un utilisateur
async function createUser(req, res) {
    const { email, password } = req.body;
    const hashedPassword = await hashPassword(password);
    const user = new User({ email, password: hashedPassword });
    // sauvegarde l'utilisateur dans la base de données
    user.save()
        .then(() => res.status(201).json({ message: 'Utilisateur créé !' }))
        .catch(error => res.status(400).json({ error }));
}

// crypte le mot de passe
function hashPassword(password) {
    const saltRounds = 10;
    // crée un salt de 10 caractères
    return bcrypt.hash(password, saltRounds);
}

// connecte un utilisateur
function logUser(req, res) {
    const { email, password } = req.body;
    // recherche un utilisateur avec l'email fourni
    User.findOne({ email })
        .then(user => {
            // si l'utilisateur n'existe pas
            if (!user) {
                return res.status(401).json({ error: 'Utilisateur non trouvé !' });
            }
            // compare le mot de passe fourni avec le mot de passe stocké
            bcrypt.compare(password, user.password)
                .then(isEqual => {
                    // si les mots de passe ne correspondent pas
                    if (!isEqual) {
                        return res.status(401).json({ error: 'Mot de passe incorrect !' });
                    }
                    const token = createToken(email);
                    res.status(200).json({ userId: user?._id, token: token });
                }).catch(error => res.status(500).json({ error }));
        }).catch(error => res.status(500).json({ error }));
}

// crée un token
function createToken(email) {
    const payload = { email };
    const options = { expiresIn: '10h' };
    // crée un token avec le payload et les options
    return jwt.sign(payload, process.env.JWT_SECRET, options);
}

module.exports = { createUser, logUser };