const express = require('express');
const { MongoClient } = require('mongodb');
const cors = require('cors');
const ObjectId = require('mongodb').ObjectId;
require('dotenv').config()
const app = express();
const port = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

//const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.nf3pc.mongodb.net/tourone?retryWrites=true&w=majority`;

const uri = `mongodb+srv://saimhasan:saimhasan12345@cluster0.x8ahu.mongodb.net/tourone?retryWrites=true&w=majority`;

console.log(uri);
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });
async function run() {
    try {
        await client.connect();
        const database = client.db('tourone');
        const collection = database.collection("services");
        const orderCollection = database.collection("orders");
        app.get('/services', async (req, res) => {
            const cursor = collection.find({});
            const services = await cursor.toArray();
            res.send(services);
        });

        app.get('/services', async (req, res) => {
            const cursor = collection.find({});
            const services = await cursor.toArray();
            res.send(services);
        })
        app.post('/services', async (req, res) => {
            const service = req.body;
            console.log(service);
            const result = await collection.insertOne(service);
            res.json(result);

        });

        // place order service
        app.post('/placeOrder', (req, res) => {
            const newService = req.body;
            orderCollection.insertOne(newService)
                .then(result => console.log(result.insertedCount))
            res.send(result.insertedCount > 0)
        })

        // get orders service
        app.get('/orders', async (req, res) => {
            const cursor = orderCollection.find({});
            const orders = await cursor.toArray();
            res.send(orders);
        })

        //update status
        app.patch('/update/status/:id', (req, res) => {
            console.log(req.body.status)
            orderCollection.updateOne({ _id: ObjectId(req.params.id) },
                {
                    $set: { status: req.body.status }
                })
                .then(result => {
                    res.send(result.modifiedCount > 0)
                })

        })

        // get my orders by email
        app.get('/orders/:email', (req, res) => {
            orderCollection.find({ email: req.params.email })
                .toArray((err, items) => {
                    res.send(items);
                    //console.log(items);
                })
        })

        // delete order
        app.delete('/delete/:id', (req, res) => {
            const id = ObjectId(req.params.id);
            orderCollection.findOneAndDelete({ _id: id })
                .then(documents => res.send(!!documents.value));

        })

        //get single service
        app.get('/services/:id', async (req, res) => {
            const id = req.params.id;
            console.log('getting specific service', id);
            const query = { _id: ObjectId(id) };
            const service = await collection.findOne(query);
            res.json(service);
        });
        //delete api       
        app.delete('/services/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: ObjectId(id) };
            const result = await collection.deleteOne(query);
            res.json(result);
        })

    }

    finally {
        // await client.close();
    }
}
run().catch(console.dir);
app.get('/', (req, res) => {
    res.send('Runnig travel server currently')
});
app.listen(port, () => {
    console.log('hiting the data ', port);
});