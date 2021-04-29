const express = require('express')
const app = express()
const cors = require('cors')
var bodyParser = require('body-parser');
require('dotenv').config()
const { v4: uuidv4 } = require('uuid');
app.use(cors())
app.use(express.static('public'))


let users=new Map()
let ids=new Map()
let exercises=new Map()
app.use(bodyParser.urlencoded({ extended: true })); 
app.use(bodyParser.json()); 
app.post('/api/users',(req,res)=>{
  let {username}=req.body;
  if(users.has(username))
  res.send('Username already taken');
  else{
    let _id=uuidv4();
    ids.set(_id,username)
    users.set(username,_id);
    exercises.set(_id,[])
    res.send(JSON.stringify({username:username,_id:_id}));
  }
})

app.post('/api/users/:_id/exercises',(req,res)=>{
  let {_id}=req.params;
  if(!ids.has(_id))
  res.send('Username Not found');
  else{
    let {description,duration,date} = req.body;
    if(!date)
    date=new Date()
    let exercise = {_id:_id, username:ids.get(_id),date:date,duration:duration,description:description};
    exercises.get(_id).push(exercise);
    res.send(JSON.stringify(exercise));
  }
})

app.get('/api/users/:_id/logs',(req,res)=>{
  let {_id}=req.params;
  if(!ids.has(_id))
  res.send("Username not found");
  else{
    let totalExercises=exercises.get(_id);
    let {from,to,limit} = req.query;
    res.send(JSON.stringify(totalExercises))
  }
})
app.get('/',(req,res)=>{
  res.render('index.html');
})
app.all('*',(req,res)=>{
  res.status(404).send("ERROR: 404 not found")
})

const listener = app.listen(process.env.PORT || 3000, () => {
  console.log('Your app is listening on port ' + listener.address().port)
})
