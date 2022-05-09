const mongoose = require('mongoose')

const blogSchema = new mongoose.Schema({
  title: {
    type: String,
    //required: () => {!(this.url)},
    minlength: 3
  },
  author: {
    type: String,
    //required: true,
    minlength: 3
  },
  url: {
    type: String,
    //required: () => {!(this.title)},
    minlength: 7
  },
  likes: {
    type: Number,
    default: 0
  }
})

blogSchema.pre('validate', function(next) {
  if (!this.url && !this.title) {
    this.invalidate('url', 'must have either URL or title', this.url)
  }
  next()
})

blogSchema.set('toJSON', {
  virtuals: true,
  transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id.toString()
    delete returnedObject._id
    delete returnedObject.__v
  }
})

module.exports = mongoose.model('Blog', blogSchema)