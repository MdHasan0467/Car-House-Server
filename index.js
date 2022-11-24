const express = require('express');
const cors = require('cors');
const { MongoClient, ServerApiVersion } = require('mongodb');
require('dotenv').config();
const app = express();

const port = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

// const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@cluster0.y0hhy5e.mongodb.net/?retryWrites=true&w=majority`;
const uri = `mongodb+srv://carResale:f1EWQOtdwb0aztDn@cluster0.y0hhy5e.mongodb.net/?retryWrites=true&w=majority`;
console.log(uri);
const client = new MongoClient(uri, {
	useNewUrlParser: true,
	useUnifiedTopology: true,
	serverApi: ServerApiVersion.v1,
});

async function run() {
	const carsResaleCollection = client.db('carsResale').collection('addedProducts');
	const addCategoriesCollection = client.db('carsResale').collection('addCategories');
	const usersCollection = client.db('carsResale').collection('users');


	app.post('/cetagories', async (req, res) => {
		//***** Add category from admin dashboard */
	})



			//! Add a new products....
			app.post('/addedproduct', async (req, res) => {
				const services = req.body;
				const result = await servicesCollection.insertOne(services);
				res.send(result);
			});











}

app.get('/', (req, res) => {
	res.send('Assignment Twelve Server Is Running!! ');
});

app.listen(port, () => {
	console.log(`Twelve Server is running on  port ${port}`);
});
