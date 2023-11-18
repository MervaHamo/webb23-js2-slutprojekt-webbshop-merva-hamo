const express = require('express');
const app = express();
const fs = require('fs');
app.use(express.json());
app.use(function (req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
});



app.get('/api/productscom', (req, res) => {
    try {
        const rawProducts = fs.readFileSync('products.json', 'utf8');
        const products = JSON.parse(rawProducts);
        res.json(products);
    } catch (error) {
        console.error('Error reading products.json:', error);
        res.status(500).json({ error: 'An error occurred' });
    }
});

app.post('/api/purchaseindex', (req, res) => {
    const purchaseData = req.body;


    try {
        const rawProducts = fs.readFileSync('products.json', 'utf8');
        const products = JSON.parse(rawProducts);

        purchaseData.items.forEach((item) => {
            const id = item.id;
            const quantity = item.quantity;
            const productIndex = products.findIndex((product) => product.id === id);
            if (productIndex !== -1) {
                const product = products[productIndex];
                if (product.stock >= quantity) {
                    product.stock -= quantity;
                } else {
                    res.status(400).json({ error: 'Insufficient stock' });
                    return;
                }
            } else {
                res.status(404).json({ error: 'Product is not found' });
                return;
            }
        });



        fs.writeFile('products.json', JSON.stringify(products), (err) => {
            if (err) {
                console.error(err);
                res.status(500).json({ error: 'An error occurred' });
            } else {
                res.json({ message: 'Köpet har genomförts ! ' });
            }
        });




    } catch (error) {
        console.error('Error with products.json:', error);
        res.status(500).json({ error: 'An error occurred' });
    }
});



app.listen(3000, () => {
    console.log('Server is running on port 3000 for my App');
});