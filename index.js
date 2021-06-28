const express = require('express')
const jsonwebtoken = require('jsonwebtoken')
const SECRET_KEY = 'MyCloudTutorials.com'  //This will be a secret stored in vault OR SSM

app = express()
app.use(express.json())

app.get('/', function (req, res) {

    res.json({
        "body": "This is Unprotected route"
    })
})


app.post('/login', function (req, res) {
    
    if (req.body.username === 'gjtest' && req.body.password === 'password') {

        const payload = {
            "id": 1001,
            "name": "Girish Jaju",
            "website": "myCloudTutorials.com"
        }

        const token = jsonwebtoken.sign(payload, SECRET_KEY)

        res.json({
            "body": token
        })

    }
    else {
        res.status(400).send({
            "message": "Invalid User/Pass"
        })
    }
    


})

app.get('/myaccount', ensureHeader, function (req, res) {

    res.json({
        "body": "this is MyAccount End Point",
        "userId": req.userId
    })
})


function ensureHeader (req, res, next) {
    const authHeader = req.headers['authorization']
    if ( !authHeader ){
        res.sendStatus(403)
    }
    else {
        const authHeaderVal = authHeader.split(' ')   //beader <token>
        const bearerToken = authHeaderVal[1]

        jsonwebtoken.verify(bearerToken, SECRET_KEY, function (err, data) {
            if (err) {
                res.sendStatus(403)
            }
            else {
                req.userId = data.id
                next()
            }


        })

    }
}


app.listen(3000, function() {
    console.log('Server started...')
})
