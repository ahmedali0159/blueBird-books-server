const express = require('express')
const app = express()
const MongoClient = require('mongodb').MongoClient;
const ObjectId = require('mongodb').ObjectId;
const cors = require('cors')
//const bodyParser = require('body-parser')
require('dotenv').config()
const port = process.env.PORT || 5000;


app.use(cors());
app.use(express.json());

app.get('/', (req, res) => {
  res.send('Bluebird books!')
});
  

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.g3qco.mongodb.net/${process.env.DB_NAME}?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });
client.connect(err => {
    console.log('connection error', err);
  const booksCollection = client.db("blueBird").collection("books");
  const ordersCollection = client.db("blueBird").collection("orders");

  app.post('/addOrder', (req, res ) => {
    const newOrdered = req.body;
    ordersCollection.insertOne(newOrdered)
    .then(result => {
      console.log('inserted count', result.insertedCount);
      res.send(result.insertedCount > 0);
    })
  })

  app.get('/orders', (req, res)=> {
    ordersCollection.find({})
    .toArray(( err, items) => {
      res.send(items)
      console.log(items);
    })
  })

  app.get('/books', (req, res) => {
    booksCollection.find()
    .toArray((err, items) => {
        res.send(items)
      
    })
  })

  app.get('/book/:id', (req, res) => {
    booksCollection.find({_id: ObjectId(req.params.id)})
    .toArray (( err, items) => {
      res.send(items);
      console.log(items);
     
    })
  })
 
 
  app.post('/addbook', (req, res)=> {
    const newBook = req.body;
    console.log('adding new book', newBook);
    booksCollection.insertOne(newBook)
    .then(result => {
      console.log('inserted count', result.insertedCount);
      res.send(result.insertedCount > 0)
    })
  })

  app.delete('/deleteBook/:id', (req, res) => {
   booksCollection.deleteOne({_id: ObjectId(req.params.id)})
   .then(( err, result)=> {
      console.log(result);
   })
   
})
   
});


app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`)
})