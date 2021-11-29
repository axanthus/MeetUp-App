 const bodyParser = require('body-parser');
// const { debug } = require('console');
// const cookieSession = require('cookie-session');
// const crypto = require('crypto');
const cors = require('cors')
const express = require('express');
const mysql = require('mysql2');
const conn = require('./dbConnect')
const path = require('path')

const PORT = 4000//process.env.PORT || 4000;
const app = express();

// connect to db 
// should consider the pool method with separate db connect file
// const con = mysql.createConnection({
//     host    : 'localhost',
//     port    :  5000,
//     database: 'coen241',
//     password: '12345',
//     user    : 'root'
// })

// con.connect(err => {
//     if (err) throw err;
//     console.log("Connected to the DB!")
// })

//enable CORS. You absolutely need this for cross-origin connections between ports on same machine
app.use(cors())

app.use(bodyParser.json())

app.use(express.static(path.resolve(__dirname, '../client-app/build')));


app.post("/api/login", (req, res) => {
    //query DB for username/passwords of all accounts
    conn.getConnection(
    function (err, client) {
        const sql = 'SELECT * FROM users WHERE uname = ? AND password = ?';
        client.query(sql, [req.body.username, req.body.password], function(err, user) {
            console.log("return value" + user)
            console.log(user[0])
            if (err)
                console.log('Query Error')

            if (user[0]) { //match
                const data = {
                    isValid: true,
                    email: user[0].email,
                    id: user[0].uid
                }
                console.log(data.id)
                res.send(JSON.stringify(data)) 
            }
            else { //no match; wrong credentials
                const data = {
                    isValid: false
                }
                
                res.send(JSON.stringify(data)) 
            }
            client.release()
        })
    })
});

app.post("/api/validate-email", (req, res) => {
    console.log("Checking if email valid:")
    //query DB for username/passwords of all accounts
    conn.getConnection(
        function (err, client) {
            const sql = 'SELECT * FROM users WHERE email = ?';
            console.log(req.body.email)
            client.query(sql, [req.body.email], function(err, user) {
                //console.log("return value" + user[0]) 
                if (err)
                    console.log('Query Error')
    
                if (user[0]) { //match     
                    console.log("Correct Email!")  
                    const data = {
                        data: user[0]
                    }            
                    res.send(JSON.stringify(data)) 
                }
                else { //no match; wrong email
                    console.log("can't find email")
                    res.send(JSON.stringify(false)) 
                }
                client.release()
            })
        })

})

app.post("/api/create-event", (req, res) => {
    console.log("Creating Event:")
    conn.getConnection(
        function (err, client) {
            const sql = 'INSERT INTO events (eventname, userid, owner, collaborators) VALUES (?, ?, ?, ?)';

            client.query(sql, [req.body.eventname, req.body.userid, req.body.owner, 
                req.body.collaborators], function(err, result) {
                
                if (err)
                    console.log('Query Error')
        
                console.log(result)  
                
                const data = {
                    //eventName: result.eventname,
                    //id: result.eventid
                    data: "hello"
                }            
                
                res.send(JSON.stringify(data)) 

                client.release()
            })
        })

})




app.get('*', (req, res) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.sendFile(path.resolve(__dirname, '../client-app/build', 'index.html'));
});


app.listen(PORT, () => {
  console.log(`Server listening on ${PORT}`);
});