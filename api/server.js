const express = require('express');
const mysql = require('mysql');
const cors= require('cors');
const bodyParser= require('body-parser');
const nodemailer= require('nodemailer')

const app= express();
const Port= 1500;
const connect= mysql.createConnection({
    database:'sneakers',
    password:'',
    user:'root'
})

app.use(cors());
app.use(bodyParser.json())

connect.connect( ()=> console.log('database connecting'))

async function main(senderMail,token){
    let myMail= 'brexejunior@gmail.com';

    let transporter= nodemailer.createTransport({
        service:'gmail',
        auth:{
            user:myMail,
            pass:'GhMarcus97'
        }
    })

    let mailOptions={
        from:myMail,
        to:senderMail,
        subject:'подверждение электронной почты',
        html: `
            <div>
                <h1 style=" text-align:center;font-size:20px;  ">подверждение электронной почты</h1>
                <p> ваш пароль: <span style="font-size:20px; color:red"> ${token}</span></p> <br/>
                <p style:color:red > не сообщайте никому ваш пароль  </p>
            </div>
        `
    }

    transporter.sendMail(mailOptions,(err,data)=>{
        if(err){
            console.log('error: email not sending ... '+err)
        }else{
            console.log('mail send successing')
        }
    })
}


app.get('/getProduct',(req,res)=>{
    connect.query('SELECT * FROM shoe ',(err,data)=>{
        if(err) throw err
    
        res.send(data)
    })
})

app.post('/sendDataUser',(req,res)=>{
    const rand = () => {
        return Math.random().toString(36).substr(2);
      };
      let token=rand()
    let emailUser= req.body.email;
    connect.query('INSERT INTO customer (email,token,isConfirmed,date) VALUES(?,?,?,now())',[emailUser,token,false])


    main(emailUser,token)
    

    
    res.send('success')
})

app.get('/confirmMail/:mail/:code',(req,res)=>{
    let customerMail=req.params.mail;
    let code=req.params.code
   connect.query('SELECT * FROM customer WHERE email=? ORDER BY id Desc LIMIT 1',[customerMail],(error,data)=>{
       if(error){
           throw error
       }else{
        data.forEach(row=>{
            if(row.token=== code){
                res.send('confirmed')
            }else{
                res.send('code invalide')
            }
        })
       }
   });

    
    

    
})


app.listen(Port,()=> console.log(`api run on Port ${Port}`))