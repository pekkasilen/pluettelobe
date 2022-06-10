const mongoose = require('mongoose');

if(process.argv.length<3) {
    console.log('give at least pwd argument');
    process.exit(1);
}

const password = process.argv[2];
for (let i=0;i<process.argv.length;i++){
    console.log(process.argv[i],i)
}
const url = `mongodb+srv://fs22DBtest:${password}@cluster0.sby65.mongodb.net/phonebook?retryWrites=true&w=majority`;
mongoose.connect(url);

const contactSchema = new mongoose.Schema({
    name: String,
    number: String
})

const Contact = mongoose.model('Contact', contactSchema);

if(process.argv.length == 3) {
    Contact.find({}).then((res) => {
        res.forEach((note => {
            console.log(note);
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

        mongoose.connection.close();
    })
}