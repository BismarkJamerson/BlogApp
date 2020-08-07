const express = require("express")
const router = express.Router()
const mongoose = require("mongoose")//Importa Mongoose
require("../models/Categoria")//Chama arquivo Model
const Categoria = mongoose.model("categorias")//Referência do model
require("../models/Postagem")
const Postagem = mongoose.model("postagens")

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

router.get('/categorias/edit/:id', (req, res) => {
    Categoria.findOne({_id:req.params.id}).lean().then((categoria)=>{
        res.render("admin/editcategorias", {categoria: categoria})
    }).catch((err)=>{
        req.flash("error_msg", "Esta categoria não existe")
        res.redirect("/admin/categorias")
    })
    
})

router.post('/categorias/edit', (req, res) => {
    Categoria.findOne({_id: req.body.id}).then((categoria) => {
        categoria.nome = req.body.nome
        categoria.slug = req.body.slug
            categoria.save().then(()=>{
                req.flash("success_msg", "Categoria editada com sucesso!")
                res.redirect("/admin/categorias")
            }).catch((err)=>{
                req.flash("error_msg", "Houve erro ao salvar a categoria")
                res.redirect("/admin/categorias")
            })
    }).catch((err)=> {
        req.flash("error_msg", "Houve erro ao editar")
        res.redirect("/admin/categorias")
    })
})

router.post('/categorias/deletar', (req, res) => {
    Categoria.remove({_id: req.body.id}).then(()=>{
        req.flash("success_msg", "Categoria deletada!")
        res.redirect("/admin/categorias")
    }).catch((err)=>{
        req.flash("error_msg", "Erro ao deletar categoria!")
        res.redirect("/admin/categorias")
    })
})

router.get("/postagens", (req, res) => {
    res.render("admin/postagens")
})

router.get("/postagens/add", (req, res) => {
    Categoria.find().lean().then((categorias)=>{
        res.render("admin/addpostagem", {categorias: categorias})
    }).catch((err)=>{
        req.flash("error_msg", "Houve um erro na criação da postagem!")
        res.redirect("/admin")
    })
})

router.post("/postagens/nova", (req , res) => {

    var erros = []

    if(req.body.categoria == "0"){
        erros.push({texto: "Categoria inválida!"})
    }

    if(erros.length > 0){
        res.render("admin/addpostagem", {erros: erros})
    }else{
        const novaPostagem = {
            titulo: req.body.titulo,
            descricao: req.body.descricao,
            conteudo: req.body.conteudo,
            categoria: req.body.categoria,
            slug: req.body.slug
        }

        new Postagem(novaPostagem).save().then(()=>{
            req.flash("success_msg", "Postagem crido com sucesso!")
            res.redirect("/admin/postagens")
        }).catch((err)=>{
            req.flash("error_msg", "Erro ao salvar postagem!")
            res.redirect("/admin/postagens")
        })

    }
})

module.exports = router