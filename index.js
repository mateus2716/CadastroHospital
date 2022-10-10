require("dotenv").config();
const express = require("express");
//mysql é o nome de uma variável, pode ser qualquer coisa
//mysql parece mais intuitivo do que mysql2
const mysql = require("mysql2");
const app = express();
const port = process.env.PORT || 3000

app.use(express.json());

const { DB_USER, DB_PASSWORD, DB_HOST, DB_DATABASE } = process.env;

app.get("/medicos", (req, res) => {
  pool.query("SELECT * FROM tb_medico", (err, results, fields) => {
    res.json(results);
  });
});

app.get("/pacientes", (req, res) => {
  pool.query("SELECT * FROM tb_paciente", (err, results, fields) => {
    res.json(results);
  });
});

app.post("/medicos", (req, res) => {
  const crm = req.body.crm;
  const nome = req.body.nome;
  const sql = "INSERT INTO tb_medico (crm, nome) VALUES (?, ?)";
  pool.query(sql, [crm, nome], (err, results, fields) => {
    console.log(results);
    console.log(fields);
    res.send("ok");
  });
});

app.get("/consultas", (req, res) => {
  const sql = `SELECT m.nome as nome_medico, 
                        c.data_hora, 
                        p.nome as nome_paciente 
                        FROM tb_medico m, 
                            tb_consulta c, 
                            tb_paciente p
                        WHERE m.crm = c.crm AND c.cpf = p.cpf`;
  pool.query(sql, (err, results, fields) => {
    res.json(results);
  });
});

const pool = mysql.createPool({
  host: DB_HOST,
  user: DB_USER,
  password: DB_PASSWORD,
  database: DB_DATABASE,
  //se todas as conexões estiverem ocupadas, novos solicitantes esperam numa fila
  //se configurado com false, causa um erro quando recebe requisições e todas
  //as conexões estão ocupadas
  waitForConnections: true,
  //no máximo 10 conexões. Elas são abertas sob demanda e não no momento de
  //construção do pool
  connectionLimit: 10,
  //quantos solicitantes podem aguardar na fila? 0 significa que não há limite
  queueLimit: 0,
});

const porta = 3000;
app.listen(porta, () => console.log(`Executando. Porta ${porta}`));
