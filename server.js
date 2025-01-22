const { randomUUID } = require("crypto")
const express = require("express")
const cors = require("cors")
const Banco = require("./banco")          

const app = express()
const banco = new Banco()

app.use(cors())
app.use(express.json())

app.get("/resultados", async(request, response) =>{
    //const {uuid} = request.query
    //const pos = alunos.findIndex(aluno => aluno.uuid == uuid)
    //if(uuid)
    //return response.json(alunos[pos])
    const lista = await banco.listar();
    return response.json(lista);
})

app.get("/resultados/buscaId", async(resquest, reponse) => {
    const indentificador = await banco.buscar(resquest.body.id);
    return reponse.json(indentificador);
})

app.post("/resultados", (request, response) =>{
    const {data,gols,assitencia} = request.body
    const uuid = randomUUID()
    const informacoes = {
        uuid,
        data,
        gols,
        assitencia,
    }
    banco.inserir(informacoes)
    return response.json(informacoes)
})

app.listen(5151, () =>{
    console.log("Servidor on")
})

app.delete("/resultados/:id", async(request, response) =>{
    const { id } = request.params

    const pos = await banco.buscar(id)
    console.log(pos)
    if(pos <= 0)
        return response.status(400).json({mensage: "Resultados não encontrado"})

    banco.remover(id)
    return response.json({mensage: "Removido"})
})

app.put("/resultados/:id", async(request, response) =>{
    const {id} = request.params
    const {data,gols,assitencia} = request.body

    const pos = await banco.buscar(id)
    console.log(pos)
    if(pos <= 0)
        return response.status(400).json({mensage: "Resultados não encontrado"})

    const informacoes = {
        id,
        data,
        gols,
        assitencia,
    }

    banco.atualizar(informacoes)
    return response.json({mensage: "Resultados atualizado"})
})