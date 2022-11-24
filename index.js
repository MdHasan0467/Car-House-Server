const express = require('express');
const cors = require('cors');
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
require('dotenv').config();
const app = express();

const port = process.env.PORT || 5000;

//! Middleware......
app.use(cors());
app.use(express.json());

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@cluster0.y0hhy5e.mongodb.net/?retryWrites=true&w=majority`;
// console.log(uri);
const client = new MongoClient(uri, {
	useNewUrlParser: true,
	useUnifiedTopology: true,
	serverApi: ServerApiVersion.v1,
});

async function run() {
	const carsResaleCollection = client
		.db('carsResale')
		.collection('addedProducts');
	const addCategoriesCollection = client
		.db('carsResale')
		.collection('addCategories');
	const advertiseDataCollection = client
		.db('carsResale')
		.collection('advertiseData');
	const usersCollection = client.db('carsResale').collection('users');

	//!Add Products Cetagories dynamically by user...
	app.post('/cetagories', async (req, res) => {
		//***** Add category from admin dashboard */
	});

	//!======START <- add a new product ======>
	app.post('/products', async (req, res) => {
		const product = req.body;
		const result = await carsResaleCollection.insertOne(product);
		res.send(result);
	});

	//!======END======>

	//!======START <- get products for My Products route ======>
	app.get('/products', async (req, res) => {
		const query = {};
		const result = await carsResaleCollection.find(query).toArray();
		res.send(result);
	});

	//!======END======>

	//!======START <- get product By Id for Advertisement  ======>
	app.get('/productById/:id', async (req, res) => {
		// console.log(req.params.id);
		const id = req.params.id;
		const query = { _id: ObjectId(id) };
		const result = await carsResaleCollection.findOne(query);
		res.send(result);
	});

	//!======END======>

	//!======START <- post Advertisement Data in Mongodb  ======>
	app.post('/advertisement', async (req, res) => {
		const adData = req.body;
		const result = await advertiseDataCollection.insertOne(adData);
		res.send(result);
	});

	//!======END======>

	//!======START <- get product By categorys all data for Home page Advertisement  ======>

	app.get('/advertisement/:category', async (req, res) => {
		console.log(req.params.category);
		// const category = req.params.category;
		// const query = { category:Tesla };
		// const result = await usersCollection.find(query).toArray()
		// res.send(result)
	});

	//!======END======>

	//!======START <- get product By categorys single data for Home page Advertisement  ======>

	app.get('/advertisement/:category', async (req, res) => {
		console.log(req.params.category);
		// const category = req.params.category;
		// const query = { category:Tesla };
		// const result = await usersCollection.findOne(query)
		// res.send(result)
	});

	//!======END======>
}
run().catch(console.log);

app.get('/', (req, res) => {
	res.send('Assignment Twelve Server Is Running!!');
});

app.listen(port, () => {
	console.log(`Twelve Server is running on  port ${port}`);
});
