const server = require('./api/server');

const port = 5000;

// START YOUR SERVER HERE
const express = require("express")
const generate = require("shortid").generate

const app = express()
app.use(express.json())

const PORT = 2224

let wrestlers = [
    {id:generate(), name:"John Bo", bio:"Arm wrestler"},
    {id:generate(), name:"John Bodo", bio:"Arm wrestling master"}
]

// GET request without id
app.get("/wrestlers", (req, res)=>{
    !wrestlers 
    ? res.status(500).json({message:`The users information could not be retrieved`}) 
    : res.status(200).json(wrestlers)
})

// GET request with ID
app.get("/wrestlers/:id", (req, res)=>{
    const idVar = req.params.id
    const w = wrestlers.find(wrestler => wrestler.id === idVar)
    try{
        !w 
    ? res.status(404).json({message:`ID: ${idVar} does not exist.`}) 
    : res.status(200).json(w)
    }
    catch(error){
        res.status(500).json({message:`The user information could not be retrieved. Server error: ${error}`})
    }
})


// POST request
app.post("/wrestlers", (req,res)=>{
    const {name, bio} = req.body
    try{
        if(!name || !bio){
            res.status(400).json({message:`Please provide name AND bio for the user`})
        }else{
            const newW = {id: generate(), name, bio}
            console.log(newW)
            wrestlers.push(newW)
            res.status(201).json(newW)
        }
    }
    catch(error){
        res.status(500).json({message:`There was an error while saving the user to the database. Server error: ${error}`})
    }
})

// PUT request
app.put("/wrestlers/:id", (req,res)=>{
    const id = req.params.id
    const {name, bio} = req.body
    const indexOfW = wrestlers.findIndex(w => w.id === id)

    try{
        if(!name || !bio){
            res.status(400).json({message:`Please provide name and bio for the user.`})
        }
        else if(indexOfW != -1){
            wrestlers[indexOfW] = {id, name, bio}
            res.status(200).json({id, name, bio})
        }
        else{
            res.status(404).json({message:` User with ID: ${id} does not exist`})
        }
    }
    catch(error){
        res.status(500).json({message:`Server error: ${error}`})
    }
})

// DELETE
app.delete("wrestlers/:id", (req, res)=>{
    const idVar = req.params.id
    try{
        if(!wrestlers.find(w => w.id === idVar)){
            res.status(404).json({message:`Wrestlers with id: ${idVar} not found.`})
        }
        else{
            wrestlers = wrestlers.filter(w => w.id !== idVar)
            res.status(200).json({message:`Wrestler ${idVar} successfully removed`})
        }
    }catch(error){
        res.status(500).json({message:`The user could not be removed. Server error: ${error}`})
    }
})

app.use("*",(req,res)=>{
    res.status(404).json({message:"404 Not found )*:"})
})

app.listen(PORT, ()=>{
    console.log('Server is running on port 2224')
})