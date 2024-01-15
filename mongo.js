const mongoose = require('mongoose')

if (process.argv.length < 3) {
  console.log('Please provide the password as an argument: node mongo.js <password>')
  process.exit(1)
}

const password = process.argv[2]

const url = `mongodb+srv://fullstack:${password}@cluster0.k2c7laj.mongodb.net/PhoneBook?retryWrites=true&w=majority`

const phoneBookSchema = new mongoose.Schema({
    name: String,
    number: String,
})

const PhoneBook = mongoose.model('PhoneBook', phoneBookSchema)


if (process.argv.length === 3) {
    mongoose.connect(url)
    .then(() => {
        console.log('phonebook:')
        PhoneBook.find({}).then((result) => {
            result.forEach((person) => {
                console.log(person.name, person.number)
            })
            mongoose.connection.close()
        })
    })
} else {
    mongoose.connect(url)
        .then(() => {
            const new_phone_book = new PhoneBook({
                name: process.argv[3],
                number: process.argv[4],
            })
            return new_phone_book.save()
        })
        .then(() => {
            console.log(`added ${process.argv[3]} number ${process.argv[4]} to phonebook`)
            return mongoose.connection.close()
        })
        .catch((err) => console.log(err))
}

