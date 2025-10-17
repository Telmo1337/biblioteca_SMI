// importar framework HTTP
const express=require("express");
//Middleware para permitir pedidos de origens diferentes (CORS)
const cors=require("cors");
//Middleware de segurança para headers de proteção
const helmet=require("helmet");
//carregar variáveis de ambiente
const dotenv=require("dotenv");
dotenv.config();

//importar modulos das rotas
const authRoutes=require("./routes/auth");
const catalogRoutes=require("./routes/catalog");
//middleware de autenticação
const {authGuard} = require("./utils/auth");

//criar aplicação
const app=express();
//aplicar os middlewares globais
app.use(helmet());
app.use(cors());
app.use(express.json());

//Montar as rotas
//auth - sem token
app.use("/auth",authRoutes);
//catalog protegido
app.use("/catalog",authGuard,catalogRoutes);

const port=process.env.PORT || 3000;
//arrancar o servidor HTTP
app.listen(port,()=>console.log('API a correr em http://localhost:'+port ));