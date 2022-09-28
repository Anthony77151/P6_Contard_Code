// dependencies
require('dotenv').config();
const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const path = require('path');
const helmet = require('helmet');

const {saucesRouter} = require('./routers/sauces');
const {authRouter} = require('./routers/auth');

// connect to mongoDB
// stock l'username et le mdp dans le .env afin de ne pas les stocker en clair
const username = process.env.DB_USER;
const password = process.env.DB_PASSWORD;
mongoose.connect(`mongodb+srv://${username}:${password}@cluster0.c6tal.mongodb.net/?retryWrites=true&w=majority`,
{
    useNewUrlParser: true,
    useUnifiedTopology: true
})
.then(() => console.log('Connexion à MongoDB réussie !'))
.catch(() => console.log('Connexion à MongoDB échouée !'));

const app = express();

// Middleware
app.use(cors(), express.json(), bodyParser.json());
app.use(helmet({
    crossOriginResourcePolicy : false
}))
// chemin absolus
app.use("/images", express.static(path.join(__dirname, "images")));

app.use('/api/sauces', saucesRouter);
app.use('/api/auth', authRouter);

// Routes
app.get('/', (req, res) => res.sendFile("Hello world !"))

module.exports = app;