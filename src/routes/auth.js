const {Router} =require("express");
const {PrismaClient}=require("@prisma/client");
const {z}=require("zod");
const {checkPassword,hashPassword,signToken,authGuard}=require("../utils/auth");
const speakeasy=require("speakeasy");
const Qrcode=require("qrcode");
const { sign } = require("jsonwebtoken");
const prisma=new PrismaClient();
const r=Router();
r.post("/register", async (req, res) => {
    const schema = z.object({
        email: z.string().email(),
        name: z.string().min(2),
        password: z.string().min(8),
        role: z.enum(["LIBRARIAN","MEMBER"]).optional()
    });

    const data = schema.parse(req.body);

    const user = await prisma.user.create({
        data: { ...data, password: await hashPassword(data.password) },
        select: { id: true, email: true, name: true, role: true },
    });

    res.status(201).json(user);
});

//login
r.post("/login",async (req,res)=>{
    const schema = z.object({email: z.string().email(),password: z.string().min(1) });
    const{email,password}=schema.parse(req.body);
    const user=await prisma.user.findUnique({where:{email}});
    if(!user || !(await checkPassword(password,user.password)))
        return res.status(401).json({error:"Invalid credentials"});
    const token=signToken(user);
    res.json({accessToken :token});

});

module.exports=r;