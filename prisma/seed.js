// Importa o Prisma Client e o enum Role gerado a partir do schema
const { PrismaClient, Role } = require("@prisma/client");
// Bcrypt para criar o hash da password do admin
const bcrypt = require("bcrypt");
// Instância única do Prisma para este script
const prisma = new PrismaClient();

async function main() {
  // Cria o hash da password "admin1234" com custo 12 
  // (bom equilíbrio segurança/desempenho)
  const adminPass = await bcrypt.hash("admin1234", 12);

  // Cria (ou reutiliza) a autora J. K. Rowling
  // upsert = idempotente: se existir 'name' igual, não cria novo registo
  const rowling = await prisma.author.upsert({
    where: { name: "J. K. Rowling" }, // campo único definido no schema
    update: {},                       // sem alterações se já existir
    create: { name: "J. K. Rowling" } // criação se não existir
  });

  // Cria (ou reutiliza) o livro HP1, identificado unicamente pelo ISBN
  const hp1 = await prisma.book.upsert({
    where: { isbn: "9780747532743" }, // ISBN está marcado como @unique no schema
    update: {},                       // não altera nada se já existir
    create: {
      title: "Harry Potter and the Philosopher's Stone",
      isbn: "9780747532743",
      year: 1997,
      // Liga o livro ao autor através da tabela de junção explícita (BookAuthor)
      // 'authors.create' cria linhas (bookId, authorId); o bookId é assumido do contexto
      authors: { create: [{ authorId: rowling.id }] },
    },
  });

  // Cria duas cópias físicas do livro (números de inventário únicos)
  // createMany é mais eficiente e 'skipDuplicates' evita erro se correres o seed outra vez
  await prisma.bookCopy.createMany({
    data: [
      { bookId: hp1.id, inventoryNo: "HP1-001", shelfCode: "FIC ROW A1" },
      { bookId: hp1.id, inventoryNo: "HP1-002", shelfCode: "FIC ROW A1" },
    ],
    skipDuplicates: true,
  });

  // Cria (ou reutiliza) o utilizador admin com role LIBRARIAN
  // Guarda a password já em hash (nunca em texto simples)
  await prisma.user.upsert({
    where: { email: "admin@biblioteca.local" }, // email é @unique
    update: {},                                 // não altera se já existir
    create: {
      email: "admin@biblioteca.local",
      name: "Admin",
      role: Role.LIBRARIAN,
      password: adminPass,
    },
  });
}

// Executa a seed:
// - Se algo falhar, mostra o erro e termina com código 1
// - Garante que a ligação ao DB é encerrada no fim
main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
