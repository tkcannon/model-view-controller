const router = require('express').Router();
const sequelize = require('../../config/connection');
const { Post, User, Comment } = require('../../models');
const withAuth = require('../../utils/auth');

// get all
router.get('/', (req, res) => {
    Post.findAll({
        attributes: ['id', 'title', 'text', 'created_at'],
        include: [
            {
                model: Comment,
                attributes: ['id', 'text', 'post_id', 'user_id', 'created_at'],
                include: {
                    model: User,
                    attributes: ['username']
                }
            },
            {
                model: User,
                attributes: ['username']
            }
        ]
    })
        .then(postData => res.json(postData))
        .catch(err => {
            console.log(err);
            res.status(500).json(err);
        });
});

// get by id
router.get('/:id', (req, res) => {
    Post.findOne({
        where: {
            id: req.params.id
        },
        attributes: ['id', 'title', 'text', 'created_at'],
        include: [
            {
                model: Comment,
                attributes: ['id', 'text', 'post_id', 'user_id', 'created_at'],
                include: {
                    model: User,
                    attributes: ['username']
                }
            },
            {
                model: User,
                attributes: ['username']
            }
        ]
    })
        .then(postData => {
            if (!postData) {
                res.status(404).json({ message: 'No post found with requested id' });
                return;
            }
            res.json(postData);
        })
        .catch(err => {
            console.log(err);
            res.status(500).json(err);
        });
});

// create post
router.post('/', withAuth, (req, res) => {
    Post.create({
        title: req.body.title,
        text: req.body.text,
        // user_id:
    })
        .then(postData => res.json(postData))
        .catch(err => {
            console.log(err);
            res.status(400).json(err);
        })
})

//edit post
router.put('/:id', withAuth, (req, res) => {
    Post.update(
        {
            title: req.body.title
        },
        {
            where: {
                id: req.params.id
            }
        }
    )
        .then(postData => {
            if (!postData) {
                res.status(404).json({ message: 'No post found with requested id' });
                return;
            }
            res.json(postData);
        })
        .catch(err => {
            console.log(err);
            res.status(500).json(err);
        })
})

//delete post
router.delete('/id', withAuth, (req, res) => {
    Post.destroy({
        where: {
            id: req.params.id
        }
    })
        .then(postData => {
            if (!postData) {
                res.status(404).json({ message: 'No post found with requested id' });
                return;
            }
            res.json(postData);
        })
        .catch(err => {
            console.log(err);
            res.status(500).json(err);
        });
});

module.exports = router;