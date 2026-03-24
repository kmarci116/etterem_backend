const express = require('express');
const cors = require('cors');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5002;

BigInt.prototype.toJSON = function() {
    return this.toString();
}

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.listen(PORT, async () => {
    console.log("A szerver fut a 5002-es porton.")
});