import cors from 'cors'
import express from 'express'
import mysql from 'mysql2'
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'
import cookieParser from 'cookie-parser'

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
    const sql = 'INSERT INTO Usuarios (email,nome,senha) VALUES (?,?,?)'
    const saltRound = 12
    
    conect.then(conn=>{
        bcrypt.hash(senha,saltRound,(err,encrypted)=>{
            if(err){
                res.status(500).send({msg:'Erro interno.',err:err})
            }
            else{
                console.log('hash -> ',encrypted)
                conn.query(sql,[email,nome,encrypted],(err)=>{
                    conn.release();
                    if(err){
                        res.status(500).send({msg:'Erro na consulta ao banco de dados.',err:err})
                    }
                    else{
                        res.status(201).send({msg:'Usuário cadastrado com sucesso!'})
                    }
                })
            }
        })
    })    
})

app.post('/login',(req,res)=>{
    const {email,senha} = req.body
    const sql = 'SELECT * FROM Usuarios WHERE email = ?'
    conect.then((conn)=>{
        conn.query(sql,[email],(err,result)=>{
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
                        const token = jwt.sign({data_from_db},SECRET,{expiresIn: 300})
                        //token -> enviar 
                        console.log('token: ',token)//guardar no db?
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
        req.user = decoded;
        console.log(req.user)
        next();
    })
}

app.use(cookieParser());

app.post('/userArea',verifyToken,(req,res)=>{
    const tokenCookie = req.cookies.token;
    //PEGAR DADOS E ENVIAR 
    // console.log('reuser',req.user)
    res.status(200).json({mensagem:'token_verificado',data:req.user})
    // res.send({ token: tokenCookie });
})

app.listen(PORT,()=>{console.log(`Rodando na Porta ${PORT}.`)})
