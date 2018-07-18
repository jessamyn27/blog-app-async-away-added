const express = require('express');
const router = express.Router();
// Require the model
const Article = require('../models/articles');
const Author  = require('../models/authors');

router.get('/', (req, res)=>{
  Article.find({}, (err, foundArticles)=>{
    res.render('articles/index.ejs', {
      articles: foundArticles
    });
  })
});

router.get('/new', (req, res)=>{
  Author.find({}, (err, allAuthors) => {
    res.render('articles/new.ejs', {
      authors: allAuthors
    });
  });
});

//avoid this handling /new by placing it towards the bottom of the file

// Display the Author with a Link on the Article show page

router.get('/:id', (req, res)=>{
  Article.findById(req.params.id, (err, foundArticle)=>{
    // WE need to find The author of the article
    Author.findOne({'articles._id': req.params.id}, (err, foundAuthor) =>{

       res.render('articles/show.ejs', {
          article: foundArticle,
          author: foundAuthor
        });
    });
  });
});

router.get('/:id/edit', (req, res) => {

  Article.findById(req.params.id, (err, foundArticle) => {
    // Find all the authors, so we can select them in the drop down menu
    // when we are editing
    Author.find({}, (err, allAuthors) => {

      // Then we need to find THe author the article is by
      Author.findOne({'articles._id': req.params.id}, (err, foundArticleAuthor) => {

            res.render('articles/edit.ejs', {
              article: foundArticle,
              authors: allAuthors,
              articleAuthor: foundArticleAuthor
            });
      });
    });
  });
});


router.post('/', (req, res)=>{
  // Create a new Article , Push a copy into the Authors article's array
  Author.findById(req.body.authorId, (err, foundAuthor) => {

    // foundAuthor is the document, with author's articles array

    Article.create(req.body, (err, createdArticle)=>{
      foundAuthor.articles.push(createdArticle);
      foundAuthor.save((err, data) => {
        res.redirect('/articles');
      });
    });
  });
});


router.delete('/:id', (req, res)=>{
  Article.findByIdAndRemove(req.params.id, (err, foundArticle)=>{
    // Finding the author with that article
    Author.findOne({'articles._id': req.params.id}, (err, foundAuthor) => {

      // Finding the article in the authors array and removing it
      foundAuthor.articles.id(req.params.id).remove();
      foundAuthor.save((err, data) => {
        res.redirect('/articles');
      });
    });
  });
});

// UPDATE AND ARTICLE WE ALL WANT TO UPDATE THE AUTHORS ARTICLES LIST
router.put('/:id', (req, res)=>{
  Article.findByIdAndUpdate(req.params.id, req.body, {new: true},(err, updatedArticle)=>{

    // Find the author with that article
    Author.findOne({'articles._id': req.params.id}, (err, foundAuthor) => {

        /// Saying there is a new author
      if(foundAuthor._id.toString() !== req.body.authorId){
        // removing that article from the old author and then saving it
         foundAuthor.articles.id(req.params.id).remove();
         foundAuthor.save((err, savedFoundAuthor) => {
            // Find the new author and and the article to thier array
            Author.findById(req.body.authorId, (err, newAuthor) => {
              newAuthor.articles.push(updatedArticle);
              newAuthor.save((err, savedFoundAuthor) => {
                 res.redirect('/articles');
              })
            })
         });

      } else {
          // If the author is the same as it was before
           // first find the article and removing, req.params.id = articles id
          foundAuthor.articles.id(req.params.id).remove();
          foundAuthor.articles.push(updatedArticle);
          foundAuthor.save((err, data) => {
              res.redirect('/articles');
            });
      }
    });
  });
});















module.exports = router;
