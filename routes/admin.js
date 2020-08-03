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
    Categoria.find().sort({date: 'desc'}).then((categorias) => {
        res.render("admin/categorias", {categorias: categorias.map(categorias => categorias.toJSON())})
    }).catch((err) => {
        req.flash("error_msg", "Houve um erro ao listar as categorias")
        console.log("erro: "+ err)
        res.redirect("/admin")
    })
  //  res.render("admin/categorias")
})

router.get('/categorias/add', (req, res) =>{
    res.render("admin/addcategorias")
})

router.post("/categorias/nova", (req, res) => {
    
    var erros = []

        if(!req.body.nome || typeof req.body.nome == undefined || req.body.nome == null){
            erros.push({texto: "Nome inválido"})
        }
        if(!req.body.slug || typeof req.body.slug == undefined || req.body.slug == null){
            erros.push({texto: "Slug inválido"})
        }

        if(req.body.nome.length < 2){
            erros.push({texto: "Nome da categoria muito pequeno"})
        }

        if(erros.length > 0){
            res.render("admin/addcategorias", {erros: erros})
        }else{
            const novaCategoria = {
                nome: req.body.nome,
                slug: req.body.slug
            }
        
            new Categoria(novaCategoria).save().then(() => {
                req.flash("success_msg", "Categoria criada com sucesso!")
                console.log("Salvo com sucesso!")
                res.redirect("/admin/categorias")
            }).catch((err)=>{
                req.flash("error_msg", "Erro ao salvar categoria, tente novamente!")
                console.log("Erro ao salvar ", err)
                res.redirect("/admin")
            })
        }
     
})


module.exports = router