// carregando Módulos
    const express = require('express')
    const handlebars = require('express-handlebars')
    const bodyParser= require("body-parser")
    const app = express()
    const admin = require("./routes/admin")
    const path = require("path")
    const mongoose = require("mongoose")
    const session = require("express-session")
    const flash = require("connect-flash") 
    require("./models/Postagem")
    const Postagem = mongoose.model("postagens")

//Configurações
    //Sessão
        app.use(session({
            secret: "cursodenode",
            resave: true,
            saveUninitialized: true
        }))
        app.use(flash())//After session
        //Middlewares
            app.use((req, res, next)=>{
                res.locals.success_msg = req.flash("success_msg")//res.locals = variavel global
                res.locals.error_msg = req.flash("error_msg")//res.locals = variavel global
                next()
            })
    //Body Parser
        app.use(bodyParser.urlencoded({extended: true}))
        app.use(bodyParser.json())
    //Handlebars
        app.engine('handlebars', handlebars({defaultLayout: 'main'}))
        app.set('view engine', 'handlebars')    
    //Mongoose
        mongoose.Promise = global.Promise
        mongoose.connect("mongodb://localhost/blogapp", {useNewUrlParser: true, useUnifiedTopology: true}).then(()=>{
            console.log("Conectado ao mongo")
        }).catch((err) => {
            console.log("Erro ao conectar: "+ err)
        })
    //Public
        app.use(express.static(path.join(__dirname,"public"))) 
        //Middlewares
            app.use((req, res, next)=> {
                console.log("Middlewares...OK!")
                next()
            })       
//Rotas
    app.get('/', (req, res)=>{
        Postagem.find().lean().populate("categoria").sort({data: "desc"}).then((postagens)=>{
            res.render("index", {postagens: postagens})
        }).catch((err)=>{
            req.flash("error_msg", "Houve um erro")
            res.redirect("/404")
        })
    })

    app.get("/postagem/:slug", (req, res)=>{
        Postagem.findOne({slug:req.params.slug}).populate("categoria").sort({data:"desc"}).lean().then((postagem)=>{
            if(postagem){
                res.render("postagem/index", {postagem: postagem})
            }else{
                req.flash("error_msg", "Está postagem não existe!")
                res.redirect("/")
            }
        }).catch((err)=>{
            req.flash("error_msg", "Erro ao carregar!")
            res.redirect("/")
        })
    })
        app.get("/404", (req, res)=>{
            res.send('Erro 404!')
        })

    app.get("/posts",(req, res)=>{
        res.send("Lista Post")
    })

    app.use('/admin', admin)
//Outros
const PORT = 8081
app.listen(PORT, () => {
    console.log("Servidor On")
})