const express = require('express');
const router = express.Router();
const bodyParser = require('body-parser');
const jsonParser = bodyParser.json();

const {BlogPosts} = require('./models');

//adds blog posts since we are not using a datsabase yet
BlogPosts.create('Title 1', 'Content for this blog post will go here', 'Ty Miller', '5 Dec 17');
BlogPosts.create('Title 2', 'Content for this blog post will go here', 'Ty Miller', '2 Dec 17');
BlogPosts.create('Title 3', 'Content for this blog post will go here', 'Ty Miller', '1 Dec 17');

//when there's a GET request to this router, return all blog posts
router.get('/', (req, res) => {
	res.json(BlogPosts.get());
});

//when a new blog post is posted, make sure it has the required fields
//if not, log an error and return a 400 status code
//if OK, add new blog post and return a 201 status code
router.post('/', jsonParser, (req, res) => {
	const requiredFields = ['title', 'content', 'author'];
	for (let i=0; i<requiredFields.length; i++) {
		const field = requiredFields[i];
		if (!(field in req.body)) {
			const message = `Missing \`${field}\` in request body`
			console.error(message);
			return res.status(400).send(message);
		}
	}
	const item = BlogPosts.create(req.body.title, req.body.content, req.body.author);
	res.status(201).json.item;
});

//when a delete request comes in with an ID in the path, delete that blog post
router.delete('/:id', (req, res) => {
	BlogPosts.delete(req.params.id);
	console.log(`Deleted blog post \`${req.params.ID}\``);
	res.status(204).end();
});

//when a put request comes in with an updated item, make sure it has required fields
//also make sure the item ID in url path and updated item object match
//if errors, log error and send back 400 status code
//otherwise call BlogPosts.update with updated item
router.put('/id', jsonParser, (req, res) => {
	const requiredFields = ['title', 'content', 'author'];
	for (let i=0; i<requiredFields.length; i++) {
		const field = requiredFields[i];
		if (!(field in req.body)) {
			const message = `Missing \`${field}\` in request body`
			console.error(message);
			return res.status(400).send(message);
		}
	}
	if (req.params.id !== req.body.id) {
		const message = (`Request path id (${req.params.id}) and request body id (${req.body.id}) must match`);
		console.error(message);
		return res.status(400).send(message);
	}
	console.log(`Updating blog post \`${req.params.id}\``);
	const updatedItem = BlogPosts.update({
		title: req.params.title,
		content: req.params.content,
		author: req.params.author
	});
	res.status(204).end();
})

module.exports = router