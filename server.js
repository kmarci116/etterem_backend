const express = require('express');
const cors = require('cors');
require('dotenv').config();

const categoryRoutes = require('./routes/categories');
const productRoutes = require('./routes/products');
const productAllergenRoutes = require('./routes/productAllergens');
const allergenRoutes = require('./routes/allergens');
const invoiceRoutes = require('./routes/invoices');
const orderRoutes = require('./routes/orders');
const orderedItemRoutes = require('./routes/ordereditems');
const wineRoutes = require('./routes/wines');
const winePairingRoutes = require('./routes/winePairings');
const authRoutes = require('./routes/auth');
const deskRoutes = require('./routes/desks');

const swaggerUi = require('swagger-ui-express');
const swaggerDocument = require('./swagger-output.json');

const app = express();
const PORT = process.env.PORT || 5002;

BigInt.prototype.toJSON = function() {
    return this.toString();
}

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

app.use('/api/categories', categoryRoutes);
app.use('/api/products', productRoutes);
app.use('/api/product-allergens', productAllergenRoutes);
app.use('/api/allergens', allergenRoutes);
app.use('/api/invoices', invoiceRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/ordered-items', orderedItemRoutes);
app.use('/api/wines', wineRoutes);
app.use('/api/wine-pairings', winePairingRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/desks', deskRoutes);

app.listen(PORT, async () => {
    console.log("A szerver fut a " + PORT + "-es porton.")
});