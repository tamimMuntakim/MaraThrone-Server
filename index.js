require("dotenv").config();
const express = require('express');
const app = express();
const cors = require("cors");
const port = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

app.get('/', (req, res) => {
    res.send('MaraThrone Server is jogging!!')
})

app.listen(port, () => {
    console.log(`MaraThrone Server listening on port ${port}`)
})
