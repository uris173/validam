const {Schema, model} = require('mongoose')

const salary = new Schema({
  user: {
    type: Schema.Types.ObjectId
  },
  date: Date,
  pay: Number
})


module.exports = model('Salary', salary)