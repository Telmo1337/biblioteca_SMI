# Biblioteca API Backend

API REST 

---

## Pré-requisitos

- Node.js >= 18  
- MariaDB ou MySQL  
- npm ou yarn  
- (Opcional) Postman para testar os endpoints

---

## ⚙️ Instalação

1. **Clonar o repositório:**

```bash
git clone https://github.com/Telmo1337/biblioteca_SMI.git
cd biblioteca_SMI
```

2. **Instalar dependências:**

```bash
npm install
# ou
yarn install
```

3. **Configurar variáveis de ambiente**

Cria/atualize o ficheiro `.env` na raíz do projeto com o seguinte conteúdo:

```env
DATABASE_URL="mysql://<user:password>@localhost:3306/api_biblioteca"
JWT_SECRET="chave_secreta_para_tokens"
PORT=3000
```

4. **Migrar a base de dados:**

```bash
npx prisma migrate deploy
```

5. **Executar o servidor:**

```bash
npm start
# ou, para desenvolvimento com nodemon:
npm run dev
```

O servidor ficará disponível em:  
👉 [http://localhost:3000](http://localhost:3000)

---

## 🔑 Testar Endpoints

### 🧍‍♂️ Autenticação

#### Registo – `POST /auth/register`

```json
{
  "email": "teste@example.com",
  "name": "Nome do Utilizador",
  "password": "12345678",
  "role": "MEMBER" 
}
```

> O campo `role` é opcional.  
> Usa `"LIBRARIAN"` para ter permissões administrativas (ex: criar autores).

#### Login – `POST /auth/login`

```json
{
  "email": "teste@example.com",
  "password": "12345678"
}
```

**Resposta:**

```json
{
  "accessToken": "TOKEN_JWT_AQUI"
}
```

Guarda o `accessToken` para autenticação nas próximas requisições.

---

## ✍️ Gestão de Autores

### Criar autor – `POST /catalog/authors`

> Apenas utilizadores com `role = LIBRARIAN`.

**Header:**
```
Authorization: Bearer <TOKEN>
```

**Body:**
```json
{
  "name": "Nome do Autor"
}
```

---

### Listar autores – `GET /catalog/authors?query=<nome>`

**Header:**
```
Authorization: Bearer <TOKEN>
```

**Resposta exemplo:**
```json
[
  { "id": 1, "name": "José Saramago", "_count": { "books": 3 } },
  { "id": 2, "name": "Fernando Pessoa", "_count": { "books": 5 } }
]
```

