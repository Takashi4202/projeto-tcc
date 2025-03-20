// Inicia o servidor do express 
const express = require("express");
//import do diretorio path
const path = require("path");
const mysql = require("mysql");
const dotenv = require("dotenv");

dotenv.config({path: './.env'});    

const app = express();

const db = mysql.createConnection({
    //Pôr o endereço do servidor. Por enquanto será um Servidor local
    host: process.env.DATABASE_HOST,
    user: process.env.DATABASE_USER,
    password: process.env.DATABASE_PASSWORD,
    database: process.env.DATABASE

    //Para acessar o banco de dados, acesse:
    //http://localhost/phpmyadmin/
});

//Aqui será onde colocar qualquer arquivo CSS, javascript, para o frontend
//Vai ser prreciso importar este diretorio em cada parte do Node.js
// (__dirname) é uma variável global que pega o diretório atual, ou seja, onde vc está. EXEMPLO: console.log(__dirname), resultado= C:\Users\Gabriel Peixoto\Desktop\TCC 1\projeto-tcc\src
const publicDirectory = path.join(__dirname, './public');
app.use(express.static(publicDirectory));

app.set('view engine', 'hbs');


db.connect((error) => {
    if(error){
        console.log("Erro ao conectar ao banco de dados: " + error);
    }else{
        console.log("Conectado ao banco de dados!");
    }
});

app.get("/", (req, res) => {
    //envia algo para o frontend
    //res.send("<h1>Home Page</h1>");
    res.render("home");
});

app.listen(3000, () => {
    console.log("Server iniciado na aporta 3000");
});