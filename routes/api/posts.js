const express = require('express');
const router = express.Router();

//@router GET api/posts
//@desc  Test router
//@acccess Public

router.get('/', (req, res) => res.send('posts route'));
module.exports = router;
