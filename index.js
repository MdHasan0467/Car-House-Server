const express = require('express');
const cors = require('cors');
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');

const { query } = require('express');
require('dotenv').config();
const app = express();
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
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
	const paymentCollection = client.db('carsResale').collection('payments');

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
			// Jodi user er role Seller hoy... Then user body er shathe permission add hoye database a jabe...... Noy2 normally body te thaka value e database a jabe
			if (req.body.role === 'Seller') {
				const user = req.body;
				user.permission = 'Unverified';
				const result = await usersCollection.insertOne(user);
				res.send(result);
			} else {
				res.send((result = await usersCollection.insertOne(req.body)));
			}
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
			.project({ role: 1, permission: 1, _id: 0 })
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
		res.send(products);
	});
	//todo--------------------------------
	//!======START <- get products for My-Orders route ======>
	app.get('/myorders', async (req, res) => {
		const email = req.query.email;
		// console.log(email);
		const query = { buyerEmail: email };
		const orders = await ordersCollection.find(query).toArray();
		// console.log('orders')
		res.send(orders);
	});
	//todo--------------------------------

	//TODO:============================!Get My Wish List Data!======================>
	//!======START <- get products for My-Wish route ======>
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
		result = await carsResaleCollection.find({ category: 'Tesla' }).toArray();
		res.send(result);
		// res.send({name:'wroking'})
	});

	app.get('/teslas', async (req, res) => {
		const query = { category: 'Tesla' };
		result = await carsResaleCollection.find(query).limit(3).toArray();
		res.send(result);
	});

	app.get('/mercedes', async (req, res) => {
		const query = { category: 'Mercedes_Benz' };
		result = await carsResaleCollection.find(query).limit(3).toArray();
		res.send(result);
	});

	app.get('/rolls', async (req, res) => {
		const query = { category: 'Rolls_Royce' };
		result = await carsResaleCollection.find(query).limit(3).toArray();
		res.send(result);
	});
	//!=====END======!

	//TODO:============================!Company wise data load!======================>
	//!=====START======Company wise data load.......======>

	app.get('/audiDatas', async (req, res) => {
		const query = { category: 'Audi' };
		result = await carsResaleCollection.find(query).toArray();
		res.send(result);
		// res.send({name:'wroking'})
	});
	app.get('/ferrariDatas', async (req, res) => {
		const query = { category: 'Ferrari' };
		result = await carsResaleCollection.find(query).toArray();
		res.send(result);
		// res.send({name:'wroking'})
	});
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
	// app.get('products/:category ', async (req, res) => {
	// 	const category = req.params.category;
	// 	result = await carsResaleCollection.find({ category: category }).toArray();
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
	//!======START <- get booking modal Data ======>
	app.get('/bookingData', async (req, res) => {
		const product = {};
		const result = await ordersCollection.find(product).toArray();
		res.send(result);
	});

	//!todo======END======>
	//!======START <- get booking modal Data ======>
	app.get('/payment/:id', async (req, res) => {
		const id = req.params.id;
		const query = { _id: ObjectId(id) };
		const result = await ordersCollection.findOne(query);
		res.send(result);
	});

	//!todo======END======>

	//TODO:============================!Wish List!======================>
	//!======START <- post Wish Lists Data in Mongodb  ======>
	app.post('/wishLists', async (req, res) => {
		// console.log('wishLists');
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

	//! To get advertise data by reverse way from database
	app.get('/advertisement/categories/animation', async (req, res) => {
		const query = {};
		const count = await advertiseDataCollection.estimatedDocumentCount(query);
		const cursor = advertiseDataCollection.find(query);
		const addvertiseProduct = await cursor.skip(parseInt(count) - 4).toArray();
		res.send(addvertiseProduct);
	});
	//!======END======>
	app.get('/advertisement/categories', async (req, res) => {
		const query = {};
		const count = await advertiseDataCollection.estimatedDocumentCount(query);
		const cursor = advertiseDataCollection.find(query);
		const addvertiseProduct = await cursor.skip(parseInt(count) - 6).toArray();
		res.send(addvertiseProduct);
	});
	//!======END======>
	//todo The Code Use for Same purpose just different get number of value
	//!======START <- get product By categories all data for Home page Advertisement  ======>
	// app.get('/advertisement/categories', async (req, res) => {
	// 	const query = {};
	// 	const result = await advertiseDataCollection.find(query).toArray();
	// 	res.send(result);
	// });
	//!======END======>
	//!======START <- get product By Id for Advertisement  ======>
	app.get('/productById/:id', async (req, res) => {
		const id = req.params.id;
		const query = { _id: ObjectId(id) };
		const result = await carsResaleCollection.findOne(query);
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

	//!todo==============Verified user (blue tik) ==========>

	//!======START <- Update a seller verified -> ======>
	app.put('/users/verify/:id', async (req, res) => {
		const id = req.params.id;
		const filter = { _id: ObjectId(id) };
		const options = { upsert: true };
		const updateDoc = {
			$set: {
				permission: 'Verified',
			},
		};
		const result = await usersCollection.updateOne(filter, updateDoc, options);
		res.send(result);
	});

	//!======END======>

	//todo=========Update an information in whole database==== kaj shes hole comment kore rakha e valo.. kew vul kore onno kisu kore pelle bipod! <77.1>  ======>
	// app.get('/datainclude', async (req, res) => {
	// 	const filter = {};
	// 	const options = { upsert: true };
	// 	const updateDoc = {
	// 		$set: {
	// 			average: 20,
	// 		},
	// 	};
	// 	const result = await carsResaleCollection.updateMany(
	// 		filter,
	// 		updateDoc,
	// 		options
	// 	);
	// 	res.send(result)
	// });
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

	//todo ====< Post payment amount from checkoutForm component >=====
	app.post('/create-payment-intent', async (req, res) => {
		const bookings = req.body;
		const price = bookings.resellPrice;
;
		const amount = price * 100;

		const paymentIntent = await stripe.paymentIntents.create({
			currency: 'usd',
			amount: amount,
			payment_method_types: ['card'],
		});
		res.send({
			clientSecret: paymentIntent.client_secret,
		});
	});

	//!======END======>

	app.post('/payment', async (req, res) => {
		const payment = req.body;
		const result = await paymentCollection.insertOne(payment);
		const id = payment.paymentId;   //paymentId ta mongoDB theke nilam
		const filter = { _id: ObjectId(id) };
		const updatedDoc = {
			$set: {
				paid: true,
				transactionId: payment.transactionId, //transactionId ta mongoDB theke nilam
			},
		};

		const updatedResult = await ordersCollection.updateOne(filter, updatedDoc)
		res.send(result)
	})
}
run().catch(console.log);

app.get('/', (req, res) => {
	res.send('Assignment Twelve Server Is Running!!');
});

app.listen(port, () => {
	console.log(`Twelve Server is running on  port ${port}`);
});
