const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const postSchema = new mongoose.Schema({
  content: String,
  encryptedField: {
    type: String,
    required: true,
  },
  likes: {
    type: Number,
    default: 0,
  },
  comments: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Comment',
  }]
}, { timestamps: true });

postSchema.pre('save', async function(next) {
  const post = this;
  if (post.isModified('encryptedField')) {
    post.encryptedField = await bcrypt.hash(post.encryptedField, 8);
  }
  next();
});

const Post = mongoose.model('Post', postSchema);

module.exports = Post;
