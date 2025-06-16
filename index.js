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

        app.post('/marathons', async (req, res) => {
            const newMarathon = req.body;
            const result = await marathonsCollection.insertOne(newMarathon);
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
