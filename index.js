const express = require('express');
const { MongoClient } = require('mongodb');
const app = express();
const cors = require('cors');
const port = process.env.PORT || 5000;
const ObjectId = require('mongodb').ObjectId;

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
        const ordersCollection = database.collection("orders");
        const usersCollection = database.collection("users")
        const usersReview = database.collection("users_review")

      app.post('/addCar', async (req,res)=>{
        const result = await carCollection.insertOne(req.body);
        res.send(result);
        console.log(result);
      });
      app.get('/addCar', async (req,res)=>{
        const result = await carCollection.find({}).toArray();
        res.json(result);
      });
      app.get('/addCar/:id', async (req,res)=>{
        const query = { _id: ObjectId(req.params.id) }
        const car = await carCollection.findOne(query);
        res.send(car);
    });
      app.post('/myOrders', async(req,res)=>{
        const result = await ordersCollection.insertOne(req.body);
        res.send(result);
    });
      app.get('/myOrders', async (req, res) => {
      const result = await ordersCollection.find({}).toArray();
      res.send(result)
    });
      app.get('/myOrders/:email', async (req, res) => {
      const email = req.params.email;
      const result = await ordersCollection.find({ email: { $regex: email } }).toArray();
      res.send(result);    
    });
    //Review GET API
     app.get('/reviews', async (req, res) => {
      const result = await usersReview.find({}).toArray();
      res.send(result)
    });
    //Admin status checking
      app.get('/users/:email', async (req, res) => {
      const email = req.params.email;
      const query = { email: email };
      const user = await usersCollection.findOne(query);
      let isAdmin = false;
      if (user?.role === 'admin') {
          isAdmin = true;
      }
      res.send({ admin: isAdmin })
    });
    //POST API for review
    app.post('/reviews', async (req, res) => {
      const review = req.body
      const result = await usersReview.insertOne(review)
      res.send(result)
    })
    //User POST API
    app.post('/users', async (req, res) => {
        const user = req.body;
        const result = await usersCollection.insertOne(user);
        console.log(result);
        res.send(result);
    });
    //User PUT API
    app.put('/users', async (req, res) => {
        const user = req.body;
        const filter = { email: user.email };
        // const options = { upsert: true };
        const updateDoc = { $set: user };
        const result = await usersCollection.updateOne(filter, updateDoc);
        res.send(result);
    });
    //Admin role
    app.put('/users/:email', async (req, res) => {
        const email = req.params.email;
        const filter = { email: email };
        const found = await usersCollection.findOne(filter)
        if (!found) {
            res.send({ isRegistered: false });
            return;
        }
        if (found?.role === "admin") {
            res.send({ isAdmin:true });
            return;
        }
        const updateRole = {
            $set: {
                role: 'admin'
            }
        }
        const result = await usersCollection.updateOne(filter, updateRole);
        res.send(result);
    });
    //Update order status
    app.put('/myOrders/:id', async (req, res) => {
        const id = req.params.id
        const reqStatus = req.body.status
        const filter = { _id: ObjectId(id) }
        // const option = { upsert: true }
        const updatedStatus = {
            $set: {
                status: reqStatus
            }
        }
        const result = await ordersCollection.updateOne(filter, updatedStatus)
        res.send(result);
    })

    //Delete Service API
    app.delete('/addCar/:id', async (req, res) => {
        const id = req.params.id;
        const query = { _id: ObjectId(id) };
        const result = await carCollection.deleteOne(query);
        res.json(result);
    })

    //Delete API for booked item
    app.delete('/myOrders/:id', async (req, res) => {
        const id = req.params.id;
        const query = { _id: ObjectId(id) };
        const result = await ordersCollection.deleteOne(query);
        res.json(result);
    })
  }
    finally{
        // await
    }
}

run().catch(console.dir);


app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`);
});