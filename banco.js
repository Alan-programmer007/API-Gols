const sqlite = require('sqlite')
const sqlite3 = require('sqlite3')

class Banco{

    constructor(){
        this.criarTabela()
    }

    async sqlConnection() {
    const banco = await sqlite.open({
        filename: 'database.db',
        driver: sqlite3.Database
    })

    return banco;

    }

    async criarTabela() {
    const banco = await this.sqlConnection();

    const tabela = `CREATE TABLE IF NOT EXISTS resultados (
                    id integer PRIMARY KEY AUTOINCREMENT,
                    uuid varchar(100),
                    data varchar(100),
                    gols int(100),
                    assitencia int(100)
                    );`;

    await banco.exec(tabela) 
    }

    async inserir(container) {
    const {data, gols, assitencia} = container;
    const banco = await this.sqlConnection();
    await banco.run("INSERT INTO resultados (data, gols, assitencia) values (?, ?, ?)", data, gols, assitencia)
    }

    async remover(id) {
    const banco = await this.sqlConnection();
    await banco.run("DELETE FROM resultados WHERE id = ?", id)
    }

    async atualizar(container) {
    const {data, gols, assitencia, id} = container;
    const banco = await this.sqlConnection();
    await banco.run("UPDATE resultados SET data = ?, gols = ?, assitencia = ? WHERE id = ?", data, gols, assitencia, id)
    }

    async listar() {
    const banco = await this.sqlConnection();
    const result = await banco.all("SELECT * FROM resultados")

    return result
    }

    async buscar(id) {
    const banco = await this.sqlConnection();
    const result = await banco.all("SELECT * FROM resultados WHERE id = ?", id)
    
    return result
    }

    async contarLinhas() {
    const banco = await this.sqlConnection();
    const result = await banco.get("SELECT COUNT(*) as count FROM resultados;");
    return result.count
    }
    

    async contarGols() {
    const banco = await this.sqlConnection();
    const result = await banco.all("SELECT SUM(gols) FROM resultados;");
    return result
    }
        
    async contarAssitencia() {
    const banco = await this.sqlConnection();
    const result = await banco.all("SELECT SUM(assitencia) FROM resultados;");
    return result
    }
}


module.exports = Banco;