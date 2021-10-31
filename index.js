const express = require('express');
const app = express();
const { MongoClient } = require('mongodb');
const ObjectId = require('mongodb').ObjectId;
const cors = require('cors');
require('dotenv').config();


const port = process.env.PORT || 5000;

//middleware
app.use(cors());
app.use(express.json());

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.rcsnr.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

// const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.rcsnr.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;

// const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

async function run() {
    try {
        await client.connect();
        const database = client.db("travel-agent");
        const servicesCollection = database.collection("services");

        //Get API

        app.get('/services', async (req, res) => {
            const cursor = servicesCollection.find({});
            const services = await cursor.toArray();
            res.send(services);
        });

        //Get single id
        app.get('/services/:id', async (req, res) => {
            const id = req.params.id;
            console.log('get single id', id)
            const quary = { _id: ObjectId(id) };
            const service = await servicesCollection.findOne(quary);
            res.send(service);

        })

        //Post API
        app.post('/services', (req, res) => {
            const service = req.body;
            console.log('port api hitted', service);

            // const service = {
            //     "name": "ENGINE DIAGNOSTIC",
            //     "price": "300",
            //     "description": "Lorem ipsum dolor sit amet, consectetu radipisi cing elitBeatae autem aperiam nequ quaera molestias voluptatibus harum ametipsa.",
            //     "img": "https://i.ibb.co/dGDkr4v/1.jpg"
            // }

            const result = servicesCollection.insertOne(service);
            console.log(result);
            res.send(result);
        })
    }
    finally {
        // await client.close();
    }
}

run().catch(console.dir);

app.get('/', (req, res) => {
    res.send('Run travel agent Data base');
});

app.listen(port, () => {
    console.log('Travel agent data base', port);
})