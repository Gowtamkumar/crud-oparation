const express = require('express');
const app = express();
// const bodyParser = require('body-parser')
// const password = '59uY8Kw!K23gCV.'

require('dotenv').config()
const ObjectId = require('mongodb').ObjectId
const MongoClient = require('mongodb').MongoClient;
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_USER}@cluster0.ty6v7.mongodb.net/${process.env.DB_NAME}?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

app.use(express.json())
app.use(express.urlencoded({ extended: false }))

app.get('/', (req, res) => {
    res.sendFile(__dirname + '/index.html')
});

// Database Mongodb
client.connect(err => {
    const ProductCollection = client.db("crud_prictice").collection("malpati");

    app.get('/product/:id', (req, res) => {
        ProductCollection.find({ _id: ObjectId(req.params.id) })
            .toArray((err, documents) => {
                res.send(documents[0])
            })
    })
    // update Oparation
    app.patch('/update/:id', (req, res) => {
        ProductCollection.updateOne({ _id: ObjectId(req.params.id) },
            {
                $set: { price: req.body.price, quantity: req.body.quantity }
            })
            .then(result => {
                res.send(result.modifiedCount > 0)
            })

    })
    // Delete oparation
    app.delete('/delete/:id', (req, res) => {
        console.log(req.params.id);
        ProductCollection.deleteOne({ _id: ObjectId(req.params.id) })
            .then(result => {
                res.send(result.deletedCount > 0)
            })
    })
    // Data show
    app.get('/products', (req, res) => {
        ProductCollection.find({})
            .toArray((err, documents) => {
                res.send(documents)
            })
    })
    // Data Insert
    app.post('/addProduct', (req, res) => {
        const product = req.body;
        ProductCollection.insertOne(product)
            .then(result => {
                res.redirect('/')
            })
    })
    console.log("database connection")
});
app.listen(3000)