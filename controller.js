const express = require('express');
const mongoClient = require('mongodb').MongoClient;
const constants = require('./constants');
const JSON = require('circular-json');

const router = express.Router();

// router.get('/products', (request, response)=>{
// 	console.log('Inside /api/products request List of Products ');

// 	mongoClient.connect(constants.mongo_url, { useNewUrlParser: true }, (err, database) => {
// 		if(err){
// 			console.log('Error occured while trying to connect to database');
// 			console.log("Error occurred");
// 		}
// 		var db = database.db(constants.ease_db);
// 		db.collection(constants.products_collection).find({}).toArray(function(error, x){
// 			if(error) throw error;
// 			response.send(JSON.stringify(x));
// 			database.close();
// 		});


// 	});
// });


router.get('/search*',(request,response) =>{
	console.log('Inside /api/products search   Drop Down Search');

	mongoClient.connect(constants.mongo_url, { useNewUrlParser: true }, (err, database) => {
		if(err){
			console.log('Error occured while trying to connect to database');
			console.log("Error occurred");
		}
		var db = database.db(constants.ease_db);
		var query={productName : request.query.query};
		var query="xyz."+ request.query.query;
		var filter={};
		filter[query]=true;
		console.log(filter);
		var skips=Number(request.query.pageSize)* Number(request.query.pageIndex);
		var limits=Number(request.query.pageSize);
		
			

		db.collection(constants.products_collection).aggregate([{ $sort: {"company":1,"productName":1}}, { $lookup: { from:"matrix", localField:"productName", foreignField: "productName", as:"xyz"  } },{$unwind:"$xyz"},{$match: filter},{ $project : { _id: 0, xyz: 0} } , { $limit: skips+limits },{ $skip: skips } ]).toArray(function(error, x){
			if(error) throw error;
			for(var key in x){
				x[key].company=x[key].company.toString().trim();
				x[key].fileType=x[key].fileType.toString().toLowerCase();
			}
			
			response.send(JSON.stringify(x));
			database.close();
		});
		
		
	});
});

router.get('/filters', (request, response)=>{
	console.log('Inside /api/filters   Drop Down Population'); 
	mongoClient.connect(constants.mongo_url, { useNewUrlParser: true }, (err, database) => {
		if(err){
			console.log('Error occured while trying to connect to database');
			console.log("Error occurred");
		}
		var db = database.db(constants.ease_db);
		var data=[];
		data.push({taskName: "All Products", description: "Display all available products"});
		db.collection("taskList").find().sort({taskName:1}).toArray(function(err, result) {
			if (err) console.log("Error occurred");
			for(key in result) {
				data.push(result[key]);
			}
			console.log(JSON.stringify(data));	
			response.send(JSON.stringify(data));
		});
		
		database.close;
		
		
	});
});

router.get('/allproducts', (request, response)=>{
	console.log('Inside /api/filters   List of all Products'); 
	mongoClient.connect(constants.mongo_url, { useNewUrlParser: true }, (err, database) => {
		if(err){
			console.log('Error occured while trying to connect to database');
			console.log("Error occurred");
		}
		var db = database.db(constants.ease_db);
		db.collection(constants.matrix).distinct("productName", function(err, result) {
			if (err) console.log("Error occurred");
			response.send(JSON.stringify(result));
		});
		
		database.close;
		
		
	});
});

router.get('/resultProducts',(request,response) =>{
	console.log('Inside /api/filters   List of products in results'); 
	mongoClient.connect(constants.mongo_url, { useNewUrlParser: true }, (err, database) => {
		if(err){
			console.log('Error occured while trying to connect to database');
			console.log("Error occurred");
		}
		var db = database.db(constants.ease_db);
		var query=request.query.query;
		var filter={};
		filter[query]=true;
		console.log(filter);
		var data=[];
		db.collection(constants.matrix).find(filter).project({_id:0,productName:1}).toArray(function(error, x){
			if(error) throw error;
			for(key in x) {
				if(key!="_id" && key !="productName")
					data.push(x[key].productName);
			}
			response.send(JSON.stringify(data));
			database.close();
		});

	});
});

router.get('/productSearch',(request,response) =>{
	console.log('Inside /api/filters   Search from Product list'); 
	mongoClient.connect(constants.mongo_url, { useNewUrlParser: true }, (err, database) => {
		if(err){
			console.log('Error occured while trying to connect to database');
			console.log("Error occurred");
		}
		var db = database.db(constants.ease_db);
		var length=request.query.length;
		var skips=Number(request.query.pageSize)* Number(request.query.pageIndex);
		var limits=Number(request.query.pageSize);
		var filter=[];
		for(var i=0;i<length;i++)
			filter.push(request.query[i.toString()]);
		db.collection(constants.products_collection).aggregate([{$sort: {"company":1,"productName":1}},
			{ $match:  {productName: {$in: filter}} }, { $limit: skips+limits },{ $skip: skips } 
			]).toArray(function(error, x){
				if(error) throw error;
				for(var key in x){
					x[key].company=x[key].company.toString().trim();
					x[key].fileType=x[key].fileType.toString().toLowerCase();
				}
				response.send(JSON.stringify(x));
				database.close();
			});

		});
});

router.get('/allProductSearch', (request, response)=>{
    
	console.log('Inside /api/filters   Search all products'); 
	mongoClient.connect(constants.mongo_url, { useNewUrlParser: true }, (err, database) => {
		if(err){
			console.log('Error occured while trying to connect to database');
			console.log("Error occurred");
		}
		var db = database.db(constants.ease_db);
		var skips=Number(request.query.pageSize)* Number(request.query.pageIndex);
		var limits=Number(request.query.pageSize);
		console.log(skips+" "+limits);
		
		db.collection(constants.products_collection).aggregate({$sort: {"company":1,"productName":1}},{ $limit: skips+limits },{ $skip: skips },{}).toArray(function(err, result) {
			if (err) console.log("Error occurred");
			console.log(result);
			for(var key in result){
				result[key].company=result[key].company.toString().trim();
				result[key].fileType=result[key].fileType.toString().toLowerCase();
			}
			response.send(JSON.stringify(result));
		});
		
		database.close;
		
		
	});
});

router.get('/companyList', (request, response)=>{
	console.log('Inside /api/filters   Company List'); 
	mongoClient.connect(constants.mongo_url, { useNewUrlParser: true }, (err, database) => {
		if(err){
			console.log('Error occured while trying to connect to database');
			console.log("Error occurred");
		}
		var db = database.db(constants.ease_db);
		
		db.collection(constants.company).find().sort({company:1}).toArray(function(err, result) {
			if (err) console.log("Error occurred");
			for(var i=0;i<result.length;i++){
				result[i].company=result[i].company.toString().trim();
			}
			response.send(JSON.stringify(result));
		});
		
		database.close;
		
		
	});
});

router.get('/allProductsCount', (request, response)=>{
	console.log('Inside /api/filters   All products Count'); 
	mongoClient.connect(constants.mongo_url, { useNewUrlParser: true }, (err, database) => {
		if(err){
			console.log('Error occured while trying to connect to database');
			console.log("Error occurred");
		}
		var db = database.db(constants.ease_db);
		
		db.collection(constants.products_collection).find().count(function(err, result){
			if (err) console.log("Error occurred");
			response.send(JSON.stringify(result));
		});
		
		database.close;
		
		
	});
});


router.get('/dropDownResultCount',(request,response) =>{
	console.log('Inside /api/products search   Drop Down Search Count');

	mongoClient.connect(constants.mongo_url, { useNewUrlParser: true }, (err, database) => {
		if(err){
			console.log('Error occured while trying to connect to database');
			console.log("Error occurred");
		}
		var db = database.db(constants.ease_db);
		var query={productName : request.query.query};
		var query="xyz."+ request.query.query;
		var filter={};
		filter[query]=true;
		console.log(filter);

		db.collection(constants.products_collection).aggregate([{ $sort: {"company":1,"productName":1}}, { $lookup: { from:"matrix", localField:"productName", foreignField: "productName", as:"xyz"  } },{$unwind:"$xyz"},{$match: filter},{ $project : { _id: 0, xyz: 0} } , { $group: { _id: null, count: { $sum: 1 } } } ]).toArray(function(error, x){
			if(error) throw error;
			console.log(x[0].count);
			// for(var key in x){
			// 	console.log(key);
			// 	console.log(x[key].count);
			// }
			response.send(JSON.stringify(x[0].count));
			database.close();
		});
		
		
	});
});

router.get('/productCount',(request,response) =>{
	console.log('Inside /api/products search  Product Search Count');

	mongoClient.connect(constants.mongo_url, { useNewUrlParser: true }, (err, database) => {
		if(err){
			console.log('Error occured while trying to connect to database');
			console.log("Error occurred");
		}
		var db = database.db(constants.ease_db);
		var length=request.query.length;
		var filter=[];
		for(var i=0;i<length;i++)
			filter.push(request.query[i.toString()]);
		db.collection(constants.products_collection).aggregate([{ $match:  {productName: {$in: filter}} },{ $group: { _id: null, count: { $sum: 1 } } } ]).toArray(function(error, x){
				if(error) throw error;
				response.send(JSON.stringify(x[0].count));
				database.close();
			});

		});
});


router.get('/productCompanyList',(request,response) =>{
	console.log('Inside /api/products search  Company result for all products');

	mongoClient.connect(constants.mongo_url, { useNewUrlParser: true }, (err, database) => {
		if(err){
			console.log('Error occured while trying to connect to database');
			console.log("Error occurred");
		}
		var db = database.db(constants.ease_db);
		var length=request.query.length;
		var filter=[];
		for(var i=0;i<length;i++)
			filter.push(request.query[i.toString()]);
		db.collection(constants.products_collection).distinct('company',{productName: {$in: filter}},function(error, x){
				if(error) throw error;
				for(var i=0;i<x.length;i++)
					x[i]=x[i].trim();
				response.send(JSON.stringify(x));
				database.close();
			});

		});
});

module.exports = router;
