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
        const carCollection = database.collection("cars");

      app.post('/addCar', async (req,res)=>{
        const result = await carCollection.insertOne(req.body);
        res.send(result);
        console.log(result);
      });
      app.get('/addCar', async (req,res)=>{
        const result = await carCollection.find({}).toArray();
        res.json(result);
      });
    }
    finally{
        // await
    }
}

run().catch(console.dir);


app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`);
});