// const dns = require("node:dns");
// dns.setServers(["8.8.8.8", "8.8.4.4"]);

const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const express = require('express');

const cors = require('cors');
const dotenv = require('dotenv');

const app = express();
app.use(cors());
dotenv.config();

const uri = process.env.MONGODB_URI;

const PORT = process.env.PORT || 5000;
app.use(express.json());

const client = new MongoClient(uri, {
    serverApi: {
        version: ServerApiVersion.v1,
        strict: true,
        deprecationErrors: true,
    }
});



async function run() {
    try {
        await client.connect();                              //   <--- !

        const db = client.db('drive-fleet');
        const carsCollection = db.collection('all-cars');

        //---------     API Endpoint     ---------\\
        app.get('/all-cars', async (req, res) => {             // for ALL car data
            const result = await carsCollection.find().toArray();
            res.json(result);
        });

        app.post('/all-cars', async (req, res) => {            // ADD 1 car data
            const carData = req.body;
            const result = await carsCollection.insertOne(carData);
            res.json(result);
        });

        app.get('/available-cars', async (req, res) => {        // AvailableCars
            const result = await carsCollection.find({
                Status: "Available"
            }).limit(6).toArray();
            res.json(result);
        });


        app.get("/all-cars/:id", async (req, res) => {         // Get 1 car data
            const { id } = req.params;

            const result = await carsCollection.findOne({
                _id: new ObjectId(id)
            });

            res.json(result);
        });


        //----------------------------------------//
        await client.db("admin").command({ ping: 1 });      //   <--- !
        console.log("Pinged your deployment. You successfully connected to MongoDB!");
    } finally {
        // await client.close();
    }
}
run().catch(console.dir);

app.get('/', (req, res) => {
    res.send(`Server is running...`)
})

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
});