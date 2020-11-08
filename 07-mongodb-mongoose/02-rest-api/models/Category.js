const mongoose = require('mongoose');
const connection = require('../libs/connection');

const subCategorySchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
},
{
  toJSON: {
    transform: function (doc, ret) {
        ret.id = ret._id;
        delete ret._id;
        delete ret.__v;
    }
  }
}
);

const categorySchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },

  subcategories: [subCategorySchema],
  },
  {
    toJSON: {
      transform: function (doc, ret) {
          ret.id = ret._id;
          delete ret._id;
          delete ret.__v;
      }
    }
});

module.exports = connection.model('Category', categorySchema);
