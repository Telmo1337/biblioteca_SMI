//JWT para emitir e validar tokens de sessão (stateless)
const jwt=require("jsonwebtoken");
//bcrypt para has/verify de passwords
const bcrypt=require("bcrypt");
//Tipos de utilizadores (enum do PRISMA)
const {Role}=require("@prisma/client");
/*
Gerar um JWT para utilizado autenticado
sub:subject (id do utilizador)
role:perfil (LIBRARIAN/MEMBER)
expiresIN:validade do token
*/

const signToken=(user)=>
    jwt.sign(
        {
            sub:user.id,role:user.role
        },
        process.env.JWT_SECRET,
        {expiresIn:"8h"}
    );
/**
 * Middleware de autenticação
 * Ler o header Authorization: "Bearer <token>"
 * Validar o token com a mesma chave "secret"
 * se ok coloca o req.user={id,role} para as rotas seguintes
 * se falhar envia o codigo 401
 */
const authGuard=(req,res,next)=>{
    const hdr=req.headers.authorization;
    //tem de vir "Bearer <token>"
    if(!hdr || !hdr.startsWith("Bearer "))
        return res.status(401).json({error:"Missing Token"});
    try{
        //remover o prefixo "Bearer "
        const payload=jwt.verify(hdr.slice(7),process.env.JWT_SECRET);
        //anexa o utilizador ao request ... para ficar disponível nas rotas
        req.user={id:payload.sub,role:payload.role}
        next();
    }
    catch{
        //token expirado, inválido, malformado, ou secret errado
        res.status(401).json({error:"Invalid token"});
    }
}
/**
 * Middleware de autorização
 * permite apenas a utilizadores com Role LIBRARIAN
 * caso contrário envia o erro 403
 */
const librarianOnly = (req,res,next)=>{
    if (req.user.role != "LIBRARIAN")
        return res.status(403).json({error:"Librarian only"});
    next();
}
/**
 * Ajuda para passwords
 * hasPassword: cria hash com salt (custos=12=> bom equilíbrio)
 * checkPassword: comparar plaintext com o hash guardado
 */
const hashPassword=(plain)=>bcrypt.hash(plain,12);
const checkPassword=(plain,digest)=>bcrypt.compare(plain,digest);

//exportar utilitários e middlewares
module.exports={
    signToken,
    authGuard,
    librarianOnly,
    hashPassword,
    checkPassword
};