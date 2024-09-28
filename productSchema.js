const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
  productName: {
    type: String,
    required: [true, 'Product name is required'],
    maxlength: [50, 'Product name cannot exceed 50 characters'],
    trim: true
  },
  price: {
    type: Number,
    required: [true, 'Price is required'],
    min: [0.01, 'Price must be a positive number']
  },
  category: {
    type: String,
    required: [true, 'Category is required'],
    enum: {
      values: ['Electronics', 'Clothing', 'Books', 'Home Appliances'],
      message: '{VALUE} is not a valid category'
    }
  },
  stock: {
    type: Number,
    required: [true, 'Stock quantity is required'],
    min: [0, 'Stock cannot be negative'],
    validate: {
      validator: Number.isInteger,
      message: 'Stock must be an integer'
    }
  },
  SKU: {
    type: String,
    required: [true, 'SKU is required'],
    unique: true,
    validate: {
      validator: function(v) {
        return /^PROD-[A-Za-z0-9]{4}$/.test(v);
      },
      message: props => `${props.value} is not a valid SKU! Format should be PROD-XXXX`
    }
  },
  tags: {
    type: [String],
    validate: {
      validator: function(v) {
        return v.every(tag => tag.trim() !== '' && !/[^a-zA-Z0-9]/.test(tag));
      },
      message: 'Tags must be non-empty and contain only alphanumeric characters'
    }
  }
});

// Custom validator to check for duplicate tags
productSchema.path('tags').validate(function(value) {
  return new Set(value).size === value.length;
}, 'Duplicate tags are not allowed');

module.exports = mongoose.model('Product', productSchema);