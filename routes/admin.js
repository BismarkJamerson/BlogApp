const express = require("express")
const router = express.Router()
const mongoose = require("mongoose")//Importa Mongoose
require("../models/Categoria")//Chama arquivo Model
const Categoria = mongoose.model("categorias")//Referência do model


router.get('/',(req, res) => {
    res.render("admin/index")
})

router.get('/post', (req, res) => {
    res.send("Pagina de posts")
})

router.get('/categorias', (req, res) =>{
    res.render("admin/categorias")
})

router.get('/categorias/add', (req, res) =>{
    res.render("admin/addcategorias")
})

router.post("/categorias/nova", (req, res) => {
    const novaCategoria = {
        nome: req.body.nome,
        slug: req.body.slug
    }

    new Categoria(novaCategoria).save().then(() => {
        console.log("Salvo com sucesso!")
    }).catch((err)=>{
        console.log("Erro ao salvar ", err)
    })
})


module.exports = router