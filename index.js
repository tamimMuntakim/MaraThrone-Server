require("dotenv").config();
const express = require('express');
const app = express();
const cors = require("cors");
const port = process.env.PORT || 3000;
const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");

const uri = `mongodb+srv://${process.env.DB_user}:${process.env.DB_password}@cluster0.qr0ehyp.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`;

app.use(cors());
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
        await client.connect();
        await client.db("admin").command({ ping: 1 });
        console.log("Pinged your deployment. You successfully connected to MongoDB!");

        const marathonsCollection = client.db("maraThroneDB").collection("marathons");
        const registrationsCollection = client.db("maraThroneDB").collection("registrations");

        app.post('/marathons', async (req, res) => {
            const newMarathon = req.body;
            const result = await marathonsCollection.insertOne(newMarathon);
            res.send(result);
        })

        app.post('/registrations', async (req, res) => {
            const newMarathon = req.body;
            const result = await registrationsCollection.insertOne(newMarathon);
            res.send(result);
        })

        app.get('/marathons', async (req, res) => {
            let cursor = marathonsCollection.find();
            if (req.query?.limit == "true") {
                cursor = cursor.limit(6);
            }
            const result = await cursor.toArray();
            res.send(result);
        })

        app.get('/marathons/:id', async (req, res) => {
            const id = req.params.id;
            const query = {
                _id: new ObjectId(id),
            };
            const result = await marathonsCollection.findOne(query);
            res.send(result);
        })

        app.get('/my-marathons', async (req, res) => {
            const email = req.query?.email;
            const query = {
                addedByUserEmail: email || "",
            };
            const cursor = marathonsCollection.find(query);
            const result = await cursor.toArray();
            res.send(result);
        })

        app.get('/my-registrations', async (req, res) => {
            const email = req.query?.email;
            const query = {
                userEmail: email || "",
            };
            const cursor = registrationsCollection.find(query);
            const result = await cursor.toArray();
            res.send(result);
        })

        app.get('/registrations/:id', async (req, res) => {
            const id = req.params.id;
            const query = {
                _id: new ObjectId(id),
            };
            const result = await registrationsCollection.findOne(query);
            res.send(result);
        })

        app.patch('/marathons/:id', async (req, res) => {
            const id = req.params.id;
            const updatedMarathon = req.body;
            const filter = {
                _id: new ObjectId(id)
            };
            const option = { upsert: true };
            const updatedDoc = {
                $set: updatedMarathon,
            };
            const result = await marathonsCollection.updateOne(
                filter,
                updatedDoc,
                option
            );
            res.send(result);
        })

        app.patch("/marathons/increment/:id", async (req, res) => {
            const id = req.params.id;
            const filter = {
                _id: new ObjectId(id),
            };
            const updatedDoc = {
                $inc: { regCount: 1 }
            };
            const result = await marathonsCollection.updateOne(
                filter,
                updatedDoc
            );
            res.send(result);
        });


        app.delete('/marathons/:id', async (req, res) => {
            const id = req.params.id;
            const query = {
                _id: new ObjectId(id),
            };
            const result = await marathonsCollection.deleteOne(query);
            res.send(result);
        })

    } finally {
    }
}
run().catch(console.dir);

app.get('/', (req, res) => {
    res.send('MaraThrone Server is jogging')
})

app.listen(port, () => {
    console.log(`MaraThrone Server listening on port ${port}`)
})
