import cors from 'cors'
import express from 'express'
import mysql from 'mysql2'
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'
import cookieParser from 'cookie-parser'
import axios from 'axios'

const PORT = 3001
const user = 'root'
const database = 'Data'
const password = '12345678'
const host = 'localhost' //dotenv all this
const SECRET = 'segredo'

const mysql_database = mysql.createPool({
    host:host,user:user,database:database,password:password    
}) 

const app = express();

app.use(cors())
app.use(express.json()) // estudar esse middleware

const conect = new Promise((resolve,reject)=>{
    mysql_database.getConnection((err,connection)=>{
        if(err){
            reject(err)
        }
        else{
            resolve(connection)
        }
    })
})


app.post('/register',(req,res)=>{
    const {email,nome,usuario,senha} = req.body
    const sql = 'INSERT INTO Usuarios (email,nome,senha,usuario) VALUES (?,?,?,?)'
    const saltRound = 12
    conect.then(conn=>{
        bcrypt.hash(senha,saltRound,(err,encrypted)=>{
            if(err){
                conn.release();
                res.status(500).send({msg:'Erro interno.',err:err})
            }
            else{
                console.log('hash -> ',encrypted)
                conn.query(sql,[email,nome,encrypted,usuario],(err,result)=>{
                    if(err){
                        conn.release();
                        res.status(500).send({msg:'Erro na consulta ao banco de dados.',err:err})
                    }
                    else{
                        const sql2 = 'SELECT * FROM Usuarios WHERE usuario = ?'
                        conn.query(sql2,[usuario],(err,result)=>{
                            conn.release();
                            if(err){
                                res.status(500).send({msg:'Erro na consulta ao banco de dados.',err:err})
                            }
                            else{
                                const data_from_db = result[0]
                                const token = jwt.sign({data_from_db},SECRET,{expiresIn: 300})
                                res.status(201).json({msg:'Usuário cadastrado com sucesso!',token:token,data:{result:data_from_db}})
                            }
                        })
                    }
                })
            }
        })
    })    
})


app.post('/login',(req,res)=>{
    const {email,senha} = req.body
    const sql = 'SELECT * FROM Usuarios WHERE email = ? OR usuario = ? '
    conect.then((conn)=>{
        conn.query(sql,[email,email],(err,result)=>{
            conn.release();
            if(err){
                res.status(500).send({msg:'erro na consulta do banco de dados',err:err})
            }
            else{
                const data_from_db = result[0]
                console.log('Resultado da consulta: ',data_from_db)
                const senha_banco = data_from_db['senha']
                bcrypt.compare(senha,senha_banco,(err,result)=>{
                    if(result){
                        const token = jwt.sign({data_from_db},SECRET,{expiresIn: 600})
                        //guardar no db?
                        res.status(200).send({msg:'Autenticado com sucesso!',token:token,data:{result:data_from_db}})        
                    }
                        else{
                            res.status(401).send({msg:'Credenciais inválidas.',err:err})
                        }
                    }
                    )
                }
        })
    }).catch((err)=>{
        console.error(err)
    })
})

const verifyToken = (req,res,next) =>{
    // const token = req.headers.authorization && req.headers.authorization.split(' ')[1];
    const {token} = req.body
    
    if (!token) {
        return res.status(401).json({ mensagem: 'Token não fornecido' });
    }
    
    console.log(token)
    jwt.verify(token, SECRET, (err, decoded) => {
        if (err) {
            return res.status(401).json({ mensagem: 'Token inválido ou expirado' });
        }
        req.user = decoded; //todos os dados que foram assinados
        next();
    })
}

app.use(cookieParser());

app.post('/newWallet',verifyToken,(req,res)=>{
    const {id_usuario} = req.user.data_from_db
    const sql = 'INSERT INTO Carteiras (id_usuario) VALUES (?)'
    conect.then(
        (conn)=>{
            conn.query(sql,[id_usuario],(err)=>{
                if(err){
                    res.status(500).send({msg:'erro na consulta do banco de dados',err:err})
                }
                else{
                    res.status(201).send({msg:'Carteira criada!'})
                }
            })
        }
    ).catch((err)=>{
        res.status(500).send({msg:'erro na criação do banco de dados',err:err})
    })
})



app.post('/userArea',verifyToken,(req,res)=>{
    const sql = 'SELECT id_carteira FROM Carteiras WHERE id_usuario = ?'
    conect.then((conn)=>{
        conn.query(sql,[req.user.data_from_db.id_usuario],(err,result)=>{
            conn.release();
            if(err){
                res.status(500).send({msg:'erro na consulta do banco de dados',err:err})
            }
            else{
                //Organizar as respostas em apenas um objeto
                const info = result[0]
                if(info){
                    req.user.data_from_db['id_carteira'] = info.id_carteira
                }
                res.status(200).send({mensagem:'token_verificado',data:req.user})
            }
        })
    }).catch((err)=>{
        res.status(500).send({msg:'erro na consulta do banco de dados',err:err})
    })
})

app.post('/wallet',verifyToken,(req,res)=>{
    console.log('chegou no /wallet')
    console.log(req.body)
    const {id_carteira} = req.body.info
    const sql = 'SELECT * FROM Acoes_Carteira WHERE id_carteira = ?'
    conect.then((conn)=>{
        conn.query(sql,[id_carteira],(err,result)=>{
            conn.release()
            if(err){
                res.status(500).send({ msg: 'Internal Server Error' });
            }
            else{
                console.log('resultado de wallet:',result)
                res.status(201).send({msg:'lista de ações recuperada',data:result})
            }
        })     
    }).catch((err)=>{
        res.status(501).send({ msg: 'Internal Server Error' ,err:err});
    })
})

app.post('/removeStock', verifyToken, (req, res) => {
    const { ticker } = req.body;
  
    // Primeiro, vamos obter o ID da ação usando o ticker
    const getAcaoIdSql = 'SELECT id_acao FROM Acoes WHERE ticker = ?';
  
    conect.then((conn) => {
      conn.query(getAcaoIdSql, [ticker], (err, result) => {
        conn.release();
  
        if (err) {
          return res.status(500).send({ msg: 'Erro interno', err: err, error: true });
        }
  
        if (result.length === 0) {
          return res.status(404).send({ msg: 'Ação não encontrada', error: true });
        }
  
        const { id_acao } = result[0];
  
        const removeStockSql = 'DELETE FROM Acoes_Carteira WHERE id_acao = ? AND id_usuario = ?';
  
        conect.then((conn) => {
          conn.query(removeStockSql, [id_acao, req.user.data_from_db.id_usuario], (err) => {
            conn.release();
  
            if (err) {
              return res.status(500).send({ msg: 'Erro interno', err: err, error: true });
            }
  
            res.status(200).send({ msg: 'Ação removida com sucesso!' });
          });
        }).catch((err) => {
          res.status(500).send({ msg: 'Erro interno', err: err, error: true });
        });
      });
    }).catch((err) => {
      res.status(500).send({ msg: 'Erro interno', err: err, error: true });
    });
  });


//MUDAR AS REFERENCIAS DE ID_ACAO PARA TICKER (VISTO QUE O TICKER É USADO NA API)
app.post('/stock2',(req,res)=>{
    const id_acao = req.body.info
    const sql = 'SELECT ticker FROM Acoes WHERE id_acao=?'
    conect.then((conn)=>{
        conn.query(sql,[id_acao],async(err,result)=>{
            conn.release();
            const token = 'qzGeJEP92KTP58tLb4guvN'
            if(err){
                
            }
            else{
                const ticker = result[0].ticker 
                console.log(ticker)
                const apiURL = `https://brapi.dev/api/quote/${ticker}?token=${token}`;
                const response = await axios.get(apiURL);
                const stock_data = response.data.results[0]
                res.status(201).send({msg:'informações da acao from brapi',data:stock_data})
            }
        })
    }).catch((err)=>{
        res.status(500).send({msg:'erro'})
    })
})

app.post('/addStock',verifyToken,(req,res)=>{
    console.log('chegou emmm')
    const {ticker,quantidade,valorPago} = req.body
    const sql0 = 'SELECT id_acao FROM Acoes WHERE ticker = ?'
    conect.then(
        (conn)=>{
            conn.query(sql0,[ticker],(err,result)=>{
                if(err){
                    
                }
                else if(result.length>0){
                    const {id_acao} = result[0]
                    const {id_usuario} = req.user.data_from_db
                    console.log('oi',id_acao,id_usuario)
                    const sql3 = "SELECT id_carteira from Carteiras WHERE id_usuario=?"
                    const sql = "INSERT INTO `Acoes_Carteira` (`id_acao`, `id_usuario`, `id_carteira`, `quantidade_de_acoes`, `valor_de_compra`) VALUES (?,?,?,?,?)"
                    conn.query(sql3,[id_usuario],
                        (err,result)=>{
                            if(err){
                                res.status(500).send({msg:'Erro interno',err:err,error:true})
                            }
                            else{
                                const {id_carteira} = result[0]
                                conn.query(sql,[id_acao,id_usuario,id_carteira,quantidade,valorPago],
                                    (err)=>{
                                        conn.release();
                                        if(err){
                                            res.status(500).send({msg:'Erro interno',err:err,error:true})
                                        }
                                        else{
                                            res.status(201).send({msg:'Inserida com sucesso!'})
                                        }
                                    })
                                }
                            })
                        }
                        else{
                            res.status(401).send({msg:'Ação não encontrada.'})
                        }
                    })
                }
                )
            })
            
            app.listen(PORT,()=>{console.log(`Rodando na Porta ${PORT}.`)})
