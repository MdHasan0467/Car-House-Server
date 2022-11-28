const express = require('express');
const cors = require('cors');
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');

const { query } = require('express');
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
	const ordersCollection = client.db('carsResale').collection('orders');
	const wishCollection = client.db('carsResale').collection('wishLists');

	//!======START <- Collect User Info from Sign up and set it database -> ======>
	// app.post('/users', async (req, res) => {
	// 	// console.log('touch')
	// 	const user = req.body;
	// 	const result = await usersCollection.insertOne(user)
	// 	res.send(result);
	// })

	//!======END======>
	//todo: Same code here also
	// //!======START <- Collect User Info from Sign up and set it database -> ======>
	app.post('/users', async (req, res) => {
		const usersList = await usersCollection.count({});

		if (usersList !== 0) {
			res.send((result = await usersCollection.insertOne(req.body)));
		} else {
			const user = req.body;
			user.role = 'admin';
			const result = await usersCollection.insertOne(user);
			res.send(result);
		}
	});
	// //todo=====END======>
	// //!======START <- Collect User Info from log in page for Google Login Which by default a buyer/user-> ======>
	app.post('/googlebuyer', async (req, res) => {
		const user = req.body;
		user.role = 'Buyer';
		const result = await usersCollection.insertOne(user);
		res.send(result);
	});
	// //todo=====END======>

	//! get user  from mongodb for Home page ==> for identify is he a admin or buyer or seller?

	app.get('/users/:email', async (req, res) => {
		const email = req.params.email;
		// console.log(email);
		const query = { email: email };
		const result = await usersCollection
			.find(query)
			.project({ role: 1, _id: 0 })
			.toArray();
		res.send(result);
	});
	// //todo=====END======>

	//!======START <- add a new product ======>
	app.post('/products', async (req, res) => {
		const product = req.body;
		const result = await carsResaleCollection.insertOne(product);
		res.send(result);
	});

	//!todo======END======>

	//!======START <- get products for My-Products route ======>
	// app.get('/products/:email', async (req, res) => {

	// 	const email = req.query.email;
	// 	const query = {
	// 		authorEmail: email,
	// 	};
	// 	const result = await carsResaleCollection.find(query).toArray();
	// 	res.send(result);
	// });

	//!======END======>

	//!======START <- get products for My-Products route ======>
	app.get('/products', async (req, res) => {
		const email = req.query.email;
		const query = { email: email };
		const products = await carsResaleCollection.find(query).toArray();
		// console.log(products)
		res.send(products);
	});
	//todo--------------------------------
	//!======START <- get products for My-Products route ======>
	app.get('/myorders', async (req, res) => {
		const email = req.query.email;
		// console.log(email);
		const query = { sellerEmail: email };
		const orders = await ordersCollection.find(query).toArray();
		// console.log('orders')
		res.send(orders);
	});
	//todo--------------------------------

	//TODO:============================!Get My Wish List Data!======================>
	//!======START <- get products for My-Products route ======>
	app.get('/mywish', async (req, res) => {
		const email = req.query.email;
		// console.log(email);
		const query = { email: email };
		const orders = await wishCollection.find(query).toArray();
		// console.log('orders')
		res.send(orders);
	});
	//todo--------------------------------

	//TODO:============================!Get All Sellers & All Buyers!======================>

	//!======START <- get All Sellers  ======>
	app.get('/usersrole', async (req, res) => {
		result = await usersCollection.find({ role: 'Seller' }).toArray();
		res.send(result);
	});
	//todo--------------------------------
	//!======START <- get All Buyers  ======>
	app.get('/usersroleBuyers', async (req, res) => {
		result = await usersCollection.find({ role: 'Buyer' }).toArray();
		res.send(result);
	});
	//todo--------------------------------

	//TODO:============================!Product categories!======================>
	//!=====START======Home page Product categories.......======>

	app.get('/tesla', async (req, res) => {
		result = await carsResaleCollection.findOne({ category: 'Tesla' });
		res.send(result);
		// res.send({name:'wroking'})
	});
	app.get('/mercedes', async (req, res) => {
		result = await carsResaleCollection.findOne({ category: 'Mercedes_Benz' });
		res.send(result);
		// res.send({name:'wroking'})
	});
	app.get('/rolls', async (req, res) => {
		result = await carsResaleCollection.findOne({ category: 'Rolls_Royce' });
		res.send(result);
		// res.send({name:'wroking'})
	});
	//!=====END======!

	//TODO:============================!Company wise data load!======================>
	//!=====START======Company wise data load.......======>

	app.get('/teslaDatas', async (req, res) => {
		const query = { category: 'Tesla' };
		result = await carsResaleCollection.find(query).toArray();
		res.send(result);
		// res.send({name:'wroking'})
	});
	app.get('/mercedesDatas', async (req, res) => {
		result = await carsResaleCollection
			.find({ category: 'Mercedes_Benz' })
			.toArray();
		res.send(result);
		// res.send({name:'wroking'})
	});
	app.get('/rollsDatas', async (req, res) => {
		const query = { category: 'Rolls_Royce' };
		result = await carsResaleCollection.find(query).toArray();
		res.send(result);
		// res.send({name:'wroking'})
	});
	//!=====END======!
	// //!======START <- get data by its category name  ======>
	// app.get('category/:name', async (req, res) => {
	// 	const name = req.params.name;
	// 	result = await carsResaleCollection.find({ category: name }).toArray();
	// 	res.send(result);
	// });
	// //!======END======>
	//TODO:============================!Modal Data!======================>

	//!======START <- add booking modal Data ======>
	app.post('/bookingData', async (req, res) => {
		const product = req.body;
		const result = await ordersCollection.insertOne(product);
		res.send(result);
	});

	//!todo======END======>
	//!======START <- add booking modal Data ======>
	app.get('/bookingData', async (req, res) => {
		const product = {};
		const result = await ordersCollection.find(product).toArray();
		res.send(result);
	});

	//!todo======END======>

	//TODO:============================!Wish List!======================>
	//!======START <- post Wish Lists Data in Mongodb  ======>
	app.post('/wishLists', async (req, res) => {
		console.log('wishLists');
		const adData = req.body;
		const result = await wishCollection.insertOne(adData);
		res.send(result);
	});
	//!======END======>

	//TODO:============================!Advertisement!======================>

	//!======START <- post Advertisement Data in Mongodb  ======>
	app.post('/advertisement', async (req, res) => {
		const adData = req.body;
		const result = await advertiseDataCollection.insertOne(adData);
		res.send(result);
	});
	//!======END======>

	//!======START <- get product By Id for Advertisement  ======>
	app.get('/productById/:id', async (req, res) => {
		const id = req.params.id;
		const query = { _id: ObjectId(id) };
		const result = await carsResaleCollection.findOne(query);
		res.send(result);
	});

	//!======END======>

	//!======START <- get product By categories all data for Home page Advertisement  ======>
	app.get('/advertisement/categories', async (req, res) => {
		const query = {};
		const result = await advertiseDataCollection.find(query).toArray();
		res.send(result);
	});
	//!======END======>

	//!======START <- Collect User Info from Sign up and set it database -> ======>
	app.post('/users', async (req, res) => {
		// const user = req.body;
		const usersList = await usersCollection.count({});

		if (usersList !== 0) {
			res.send((result = await usersCollection.insertOne(req.body)));
		} else {
			const user = req.body;
			user.role = 'admin';
			const result = await usersCollection.insertOne(user);
			res.send(result);
		}
	});
	//!======END======>

	//todo===================delete======================>

	//!======START <- Delete buyer info -> ======>
	app.delete('/Buyer/:id', async (req, res) => {
		console.log('delete');
		const id = req.params.id;
		const query = { _id: ObjectId(id) };
		const result = await usersCollection.deleteOne(query);
		res.send(result);
	});

	//!======END======>
	//!======START <- Delete  seller info -> ======>
	app.delete('/seller/:id', async (req, res) => {
		console.log('delete');
		const id = req.params.id;
		const query = { _id: ObjectId(id) };
		const result = await usersCollection.deleteOne(query);
		res.send(result);
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
