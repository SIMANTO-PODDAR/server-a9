// const dns = require("node:dns");
// dns.setServers(["8.8.8.8", "8.8.4.4"]);

const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const express = require('express');

const cors = require('cors');
const dotenv = require('dotenv');
const { jwtVerify, createRemoteJWKSet } = require('jose-cjs');

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

const JWKS = createRemoteJWKSet(new URL(`${process.env.CLIENT_URL}/api/auth/jwks`));

const middleware = async (req, res, next) => {
    const authHeader = req.headers.authorization;

    if (!authHeader) {
        return res.status(401).json({ message: "Unauthorized" });
    }

    const userToken = authHeader.split(" ")[1];

    if (!userToken) {
        return res.status(401).json({ message: "Unauthorized" });
    }

    try {
        const { payload } = await jwtVerify(userToken, JWKS);
        next();
    }

    catch (error) {
        return res.status(403).json({ message: "Invalid token" });
    }
};

async function run() {
    try {
        //   await client.connect();                              <--- !

        const db = client.db('drive-fleet');
        const carsCollection = db.collection('all-cars');

        //---------     API Endpoint     ---------\\
        app.get('/all-cars', async (req, res) => {                // for ALL car data
            try {
                const search = req.query.search || null;
                const type = req.query.type || null;

                const query = {};
                // console.log('1a', search, '2a', type, '3a', query)

                if (search) {
                    query.Name = {
                        $regex: search,
                        $options: "i"
                    };
                }

                if (type) {
                    query.Type = type;
                }

                // console.log('1b', search, '2b', type, '3b', query)

                const result = await carsCollection.find(query).toArray();
                res.json(result);

            } catch (error) {
                console.error("Error fetching filtered cars:", error);
                res.status(404).json({ error: "Failed to fetch cars data" });
            }
        });

        app.post('/all-cars', middleware, async (req, res) => {   // ADD 1 car data
            const carData = req.body;
            const result = await carsCollection.insertOne(carData);
            res.json(result);
        });

        app.get('/available-cars', async (req, res) => {          // AvailableCars
            const result = await carsCollection.find({
                Status: "Available"
            }).limit(6).toArray();
            res.json(result);
        });


        app.get("/all-cars/:id", async (req, res) => {            // Get 1 car data
            const { id } = req.params;

            const result = await carsCollection.findOne({
                _id: new ObjectId(id)
            });

            res.json(result);
        });


        app.get('/added-cars/:userId', middleware, async (req, res) => {      // Get cars added by user
            const { userId } = req.params;

            const result = await carsCollection.find({
                userId: userId
            }).toArray();

            res.json(result);
        });


        app.delete("/all-cars/:id", async (req, res) => {         // Delete 1 car data
            const { id } = req.params;

            const result = await carsCollection.deleteOne({
                _id: new ObjectId(id)
            });

            res.json(result);
        });


        app.patch("/all-cars/:carId", async (req, res) => {       // Update 1 car data
            const { carId } = req.params;
            const carData = req.body;

            // console.log(carData);
            const result = await carsCollection.updateOne(
                { _id: new ObjectId(carId) },
                { $set: carData },
            );
            res.json(result);
        });



        // New collection Bookings data
        const bookingsCollection = db.collection('drive-fleet-bookings');

        app.post("/all-bookings", async (req, res) => {           // Add 1 Booking data
            const Data = req.body;
            const result = await bookingsCollection.insertOne(Data);

            if (result.insertedId) {
                await carsCollection.updateOne(
                    { _id: new ObjectId(Data.CarId) },

                    {
                        $inc: { BookBy: +1 }
                    }
                );
            };

            res.json(result);
        });

        app.get('/all-bookings/:userId', middleware, async (req, res) => {    // Get bookings data
            const { userId } = req.params;

            const result = await bookingsCollection.find({
                userId: userId
            }).toArray();

            res.json(result);
        });



        //----------------------------------------//
        //   await client.db("admin").command({ ping: 1 });      <--- !
        console.log("Pinged your deployment. You successfully connected to MongoDB!");
    } finally {
        // await client.close();
    }
}
run().catch(console.dir);

app.get('/', (req, res) => {
    res.send(`DriveFleet Server is running...`)
})

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
});
