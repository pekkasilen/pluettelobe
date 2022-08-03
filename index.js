require('dotenv').config();
const Contact = require('./models/contact');
const express = require('express');
var morgan = require('morgan')
const app = express();
app.use(express.static('build'));
app.use(express.json());
morgan.token('body', (req,res) => JSON.stringify(req.body));
app.use(morgan(`:method :url :status :req[content-length] :response-time ms :body - `))
const PORT = process.env.PORT;

let phonebook = [
    {
        id:1,
        name:'Arto Hellas',
        number: '040-123456'
    },
    {
        id:2,
        name:'Ada Lovelace',
        number: '39-44-5323523'
    },
    {
        id:3,
        name:'Dan Abramov',
        number: '12-43-234345'
    },
    {
        id:4,
        name:'Mary Poppendick',
        number: '39-23-6423122'
    }
]

app.get('/api/persons', (req,res)=> {
    Contact.find({}).then(contact => {
        res.json(contact);
    })
})

app.get('/api/persons/:id', (req,res,next)=> {
    Contact.findById(req.params.id).then(contact=> {
        res.status(200).send(contact)
    }).catch(error => next(error))
})

app.get('/info', (req,res)=> {
    let d = new Date();
    Contact.find({}).then(contacts => {
        let responseText = `Phonebook has info for ${contacts.length} people <br/> ${d}`;
        res.status(200).send(responseText);
    })
})

app.delete('/api/persons/:id', (req,res)=> {
    Contact.findByIdAndRemove(req.params.id).then((cont)=> {
        console.log(cont);
        res.json(cont)
    }).catch(err => {
        next(err)
    })
})

app.put('/api/persons/:id', (req,res,next) => {
    console.log(req.body.number);
    Contact.findByIdAndUpdate(req.params.id, {number: req.body.number}).then((cont)=>{
        console.log("cont",cont);
        cont.number=req.body.number;
        res.json(cont);
    }).catch(err=> {
        next(err);
    })
})

app.post('/api/persons', (req,res,next)=> {
    if(!req.body.name || !req.body.number){
        res.status(400).send("error: missing name or number");
        return;
    }

    if(phonebook.find((contact) => contact.name == req.body.name)){
        res.status(400).send("error: name already exists");
        return;
    }

    const newContact = new Contact({
        name: req.body.name,
        number: req.body.number
    })
    
    newContact.save().then(savedContact => {
        console.log("saved contact",savedContact);
        res.json(savedContact)
    }).catch(err => {
        next(err);
    })
})

const errorHandler = (error, request, response, next) => {
    console.log("in error handler")
    console.log(error.message);
    return response.status(400).send({ error: error.message})
    next(error)
}
app.use(errorHandler);



app.listen(PORT);