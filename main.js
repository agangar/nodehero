const express = require('express');
const controller = require('./controller');
const path = require('path');
const bodyParser = require('body-parser');
const cors = require('cors');    //to avoid cross-origin reference issues

const port = 8081;

const app = express();

app.use(cors());
app.use(bodyParser.urlencoded({extended:true}));
app.use(bodyParser.json());
//app.use(express.static(path.join(__dirname, 'dist/assets')));
// console.log(path.join(__dirname, 'dist/assets'));
//passing all api requests to controller
app.use('/api', controller);




// // Serve the index.html for all the other requests so that the
// // router in the javascript app can render the necessary components
// app.get('*',function(req,res){
//   res.sendFile(path.join(__dirname+'/build/index.html'));
//   //__dirname : It will resolve to your project folder.
// });


app.listen(port, ()=>{
	console.log('Starting server on port: ' + port);
});