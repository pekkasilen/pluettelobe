const mongoose = require('mongoose')

//const password = process.argv[2]
const url = process.env.MONGODB_URI
mongoose
  .connect(url)
  .then((res) => {
    console.log('connected',res)
  })
  .catch((err) => {
    console.log(err.message)
  })

const contactSchema = new mongoose.Schema({
  name: {
    type: String,
    minlength: 3,
    required: true,
  },
  number: String,
})

contactSchema.set('toJSON', {
  transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id.toString()
    delete returnedObject._id
    delete returnedObject.__v
  },
})

module.exports = mongoose.model('Contact', contactSchema)
