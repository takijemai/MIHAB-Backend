const express= require('express')
const mongoose = require('mongoose')
const cookies = require('cookie-parser')
const cors = require('cors')
const _ = require('lodash')
const request= require('request')
const corsOptions ={
  origin:   ['http://localhost:8100','http://localhost' , 'https://newmihab-d65abc91a2d0.herokuapp.com/'],
  credentials:true,  
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  exposedHeaders: ['Content-Length', 'Authorization'],          //access-control-allow-credentials:true
  optionSuccessStatus:200,
}
const app = express()
app.use(cors(corsOptions))

const server = require('http').createServer(app)
const io = require('socket.io')(server,{
    cors: {
    origin:  ['http://localhost:8100','http://localhost', 'https://newmihab-d65abc91a2d0.herokuapp.com/'],
    credentials:true,
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    exposedHeaders: ['Content-Length', 'Authorization'],         
    optionSuccessStatus:200,
}},
);


const {User}= require('./helpers/UserClass')
require('./socket config/events')(io,User,_)
require('./socket config/connection')(io)


app.use(cookies())
app.use(express.json({limit:'50mb'}))
app.use(express.urlencoded({limit:'50mb', extended:true}))



const auth =  require('./routes/authroute')
const dbConfig= require('./config/secret')

const image= require('./routes/imageroute')
const post = require('./routes/postroute')
const message = require('./routes/messageroute')
const user = require('./routes/userroute')


mongoose.Promise= global.Promise
mongoose.connect('mongodb+srv://cluster0.ciybmqk.mongodb.net/newapp', {
  user: dbConfig.user,
  pass: dbConfig.pass
})
.then(() => {
  console.log('Connected to the MongoDB Atlas database  newapp');
})
.catch((error) => {
  console.error('Error connecting to the MongoDB Atlas database  newapp', error);
});


app.use('/api/newapp', auth)
app.use('/api/newapp', image)
app.use('/api/newapp', message)
app.use('/api/newapp',post)
app.use('/api/newapp', user)





function getOAuthToken() {
  return new Promise((resolve, reject) => {
      const apiKey = dbConfig.apikey;
      const secret = dbConfig.ideasecret;
      const credentials = Buffer.from(`${apiKey}:${secret}`).toString('base64');
      const options = {
          url: 'https://api.idealista.com/oauth/token',
          headers: {
              'Authorization': `Basic ${credentials}`,
              'Content-Type': 'application/x-www-form-urlencoded'
          },
          form: {
              grant_type: 'client_credentials',
              scope: 'read'
          }
      };

      request.post(options, function (error, response, body) {
          if (!error && response.statusCode == 200) {
              const data = JSON.parse(body);
              resolve(data.access_token);
          } else {
              reject(error);
          }
      });
  });
}


function searchProperties(propertyType, city, maxPrice, operation, country, apiKey,center,distance) {
return new Promise((resolve, reject) => {
getOAuthToken().then((token) => {
  const searchHeaders = {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json' };
const searchUrl = `https://api.idealista.com/3.5/${country}/search?location=${city}&propertyType=${propertyType}&operation=${operation}&maxPrice=${maxPrice}&apiKey=${apiKey}&center=${center}&distance=${distance}`;
request.post(searchUrl, { headers: searchHeaders }, (err, res, body) => {
   if (err) {
    reject(err);
  } else {
    const data = JSON.parse(body);
   resolve(data);
              }
          });
      }).catch((error) => {
          reject(error);
      });
  });
}

app.get('/getToken', async function(req,res){
  try {
    const token= await getOAuthToken()
    res.send({access_token: token})
  } catch (error) {
    console.log(error);
    res.status(500).send({error:'Error getting access token'})
  }
})


app.post('/searchProperties', async function (req,res){
  try {
    
    const {propertyType, city, maxPrice, operation, country, apiKey, center, distance}= req.query

    const data= await searchProperties(propertyType, city, maxPrice, operation, country, apiKey, center, distance)
    res.send(data)
  } catch (error) {
    console.log(error);
    res.status(500).send({error:'Error getting search properties'})
  }
})

const port = process.env.PORT || 3000;
server.listen(port, function(req,res){
  console.log(`App is running on  port ${port}`);
})