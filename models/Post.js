const mongoose = require('mongoose');

const postSchema = new mongoose.Schema({
  content: String,
  likes: { type: Number, default: 0 },
  comments: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Comment' }]
}, { timestamps: true });

const Post = mongoose.model('Post', postSchema);

module.exports = Post;
