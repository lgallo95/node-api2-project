// implement your posts router here
const express = require("express");
const Posts = require("./posts-model");
const router = express.Router();

router.get("/", async (req, res) => {
  try {
    const posts = await Posts.find();
    res.json(posts);
  } catch (err) {
    console.log(err);
    res
      .status(500)
      .json({ message: "The posts information could not be retrieved" });
  }
});

router.get("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const posts = await Posts.findById(id);
    if (!posts) {
      res
        .status(404)
        .json({ message: "The post with the specified ID does not exist" });
    } else {
      res.status(200).json(posts);
    }
  } catch (err) {
    res
      .status(500)
      .json({ message: "The post information could not be retrieved" });
  }
});

router.post("/", (req, res) => {
  const { title, contents } = req.body;
  if (!title || !contents) {
    res
      .status(400)
      .json({ message: "Please provide title and contents for the post" });
  } else {
    Posts.insert({ title, contents })
      .then(({ id }) => {
        return Posts.findById(id);
      })
      .then(post => {
        res.status(201).json(post);
      })
      .catch((err) => {
        res
          .status(500)
          .json({ message: "There was an error while saving the post to the database" });
      });
  }
});

router.put('/:id', (req, res) => {
    const { title, contents } = req.body
    if (!title || !contents) {
        res.status(400).json({ 
            message: 'Please provide title and contents for the post'
        })
    } else {
        Posts.findById(req.params.id)
        .then(post => {
            if (!post) {
                res.status(404).json({ 
                    message: "The post with specified ID does not exist",
                })
            } else {
                return Posts.update(req.params.id, req.body)
            }
        })
        .then(info => {
            if (info){
                return Posts.findById(req.params.id)
            }
        })
        .then(post => {
            if (post) {
                res.json(post)
            }
        })
        .catch(err => {
            res.status(500).json({ 
                message: "The post information could not be retrieved",
            })
        }) 
    }
})

router.delete('/:id', async (req, res) => {
    try {
        const post = await Posts.findById(req.params.id)
        if (!post) {
            res.status(404).json({ 
                message: "The post with the specified ID does not exist",
            })
        } else {
            await Posts.remove(req.params.id)
            res.json(post)
        }
    } catch (err) {
        res.status(500).json({ 
            message: "This post could not be removed",
        })
    }
})

router.get('/:id/messages', async (req, res) => {
    try {
        const posts = await Posts.findById(req.params.id)
        if(!posts) {
            res.status(404).json({ 
                message: "The post with the specified ID does not exist"
            })
        } else {
            const posted = await Posts.findPostComments(req.params.id)
            res.json(posted)

        }
    } catch (err) {
        res.status(500).json({
            message: "The comments information could not be retrieved",
        })
    }
})


module.exports = router;
