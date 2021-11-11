const express = require('express');
const { MongoClient } = require('mongodb');
const app = express();
const cors = require('cors');
const port = process.env.PORT || 5000;

require('dotenv').config();

app.use(cors());
app.use(express.json());

app.get('/', (req, res) => {
  res.send('Hello World!');
});

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.tqbro.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });
console.log(uri);

async function run(){
    try{
        await client.connect();
        const database = client.db("carmaxDb");
        const carCollection = database.collection("packages");


    }
    finally{
        // await
    }
}

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`);
});