const mongoose = require("mongoose")
const Schema = mongoose.Schema;

const Postagem = new Schema({
    titulo:{
        type: String,
        required: true
    },
    slug:{
        type:String,
        required: true
    },
    descricao:{
        type: String,
        required: true
    },
    conteudo:{
      type: String,
      required: true  
    },
    categoria:{
        type: Schema.Types.ObjectId, //Relaciona documentos
        ref: categorias, //nome do model
        required: true
    },
    date:{
        type:date,
        default: Date.now()
    }
})

mongoose.model("postagens", Postagem)