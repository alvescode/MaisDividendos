import axios from 'axios'
import mysql from 'mysql2'

const dbConfig = {
  host: 'localhost',
  user: 'root',
  password: '12345678',
  database: 'Data',
};

async function fetchDataAndInsert() {
  try {
    const response = await axios.get('https://brapi.dev/api/available?token=eJGEyu8vVHctULdVdHYzQd');

    const stocks = response.data.stocks;

    const connection = mysql.createConnection(dbConfig);

    connection.connect();

    for (const stock of stocks) {
      const query = `INSERT INTO Acoes (ticker) VALUES ('${stock}')`;

      connection.query(query, (error, results) => {
        if (error) throw error;
        console.log(`Ação ${stock} inserida com sucesso!`);
      });
    }

    connection.end();
  } catch (error) {
    console.error('Erro ao consultar a API ou inserir dados no banco de dados:', error.message);
  }
}

fetchDataAndInsert();
