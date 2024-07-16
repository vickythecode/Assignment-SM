const express = require('express');
const Post = require('../models/Post');
const Comment = require('../models/Comment');

const router = express.Router();

// Create a new post
router.post('/', async (req, res) => {
  try {
    const post = new Post(req.body);
    await post.save();
    res.status(201).send(post);
  } catch (error) {
    res.status(400).send(error);
  }
});

// Read all posts
router.get('/', async (req, res) => {
  try {
    const posts = await Post.find().populate('comments');
    res.status(200).send(posts);
  } catch (error) {
    res.status(500).send(error);
  }
});

// Read a single post by id
router.get('/:id', async (req, res) => {
  try {
    const post = await Post.findById(req.params.id).populate('comments');
    if (!post) {
      return res.status(404).send();
    }
    res.status(200).send(post);
  } catch (error) {
    res.status(500).send(error);
  }
});

// Update a post by id
router.patch('/:id', async (req, res) => {
  try {
    const post = await Post.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
    if (!post) {
      return res.status(404).send();
    }
    res.status(200).send(post);
  } catch (error) {
    res.status(400).send(error);
  }
});

// Delete a post by id
router.delete('/:id', async (req, res) => {
  try {
    const post = await Post.findByIdAndDelete(req.params.id);
    if (!post) {
      return res.status(404).send();
    }
    res.status(200).send(post);
  } catch (error) {
    res.status(500).send(error);
  }
});

// Like a post
router.post('/:id/like', async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    if (!post) {
      return res.status(404).send();
    }
    post.likes += 1;
    await post.save();
    res.status(200).send(post);
  } catch (error) {
    res.status(500).send(error);
  }
});

// Add a comment to a post
router.post('/:id/comment', async (req, res) => {
  try {
    const comment = new Comment({
      postId: req.params.id,
      text: req.body.text
    });
    await comment.save();
    const post = await Post.findById(req.params.id);
    post.comments.push(comment._id);
    await post.save();
    res.status(201).send(comment);
  } catch (error) {
    res.status(400).send(error);
  }
});

module.exports = router;
