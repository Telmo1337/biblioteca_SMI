const { Router } = require("express");
const { PrismaClient } = require("@prisma/client");
const { z } = require("zod");
const { librarianOnly } = require("../utils/auth");

const prisma = new PrismaClient();
const r = Router();

// Criar um autor
r.post("/authors", librarianOnly, async (req, res) => {
  const schema = z.object({ name: z.string().min(2) });
  const data = schema.parse(req.body);

  const author = await prisma.author.upsert({
    where: { name: data.name },
    create: data,
    update: {},
  });

  res.status(201).json(author);
});

// Ler autores
r.get("/authors", async (req, res) => {
  const q = String(req.query.query || "");
  const authors = await prisma.author.findMany({
    where: q ? { name: { contains: q, mode: "insensitive" } } : {},
    select: {
      id: true,
      name: true,
      _count: { select: { books: true } },
    },
    orderBy: { name: "asc" },
    take: 50,
  });
  res.json(authors);
});

module.exports = r;
