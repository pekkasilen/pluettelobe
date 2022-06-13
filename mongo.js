const mongoose = require('mongoose');

if(process.argv.length<3) {
    console.log('give at least pwd argument');
    process.exit(1);
}

const password = process.argv[2];
const url = `mongodb+srv://fs22DBtest:${password}@cluster0.sby65.mongodb.net/phonebook?retryWrites=true&w=majority`;
mongoose.connect(url);

const contactSchema = new mongoose.Schema({
    name: String,
    number: String
})

const Contact = mongoose.model('Contact', contactSchema);

if(process.argv.length == 3) {
    Contact.find({}).then((res) => {
        console.log("Phonebook")
        res.forEach((contact => {
            console.log(contact.name, contact.number);
        }))
        mongoose.connection.close();
    })
}

if(process.argv.length == 5) {
    const contact = new Contact({
        name: process.argv[3],
        number: process.argv[4]
    })
    contact.save().then((res)=> {
        console.log(`Added ${process.argv[3]} to phonebook`)
        mongoose.connection.close();
    })
}