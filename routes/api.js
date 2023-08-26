/*
 *
 *
 *       Complete the API routing below
 *
 *
 */

"use strict";

const mongoose = require("mongoose");

mongoose.connect(process.env["DB"], {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

module.exports = function (app) {
  const bookSchema = new mongoose.Schema({
    title: {
      type: String,
      required: true,
    },
    comments: [],
    commentcount: {
      type: Number,
      default: 0,
    },
  });

  let Book = mongoose.model("Book", bookSchema);

  app
    .route("/api/books")
    .get(function (req, res) {
      Book.find().then((data) => res.send(data));
    })

    .post(function (req, res) {
      let title = req.body.title;

      let book = new Book({
        title: title,
      });

      if (title) {
        book.save().then((data) => res.send(data));
      } else {
        res.json("missing required field title");
      }
    })

    .delete(function (req, res) {
      Book.deleteMany().then(() => res.json("complete delete successful"));
    });

  app
    .route("/api/books/:id")
    .get(function (req, res) {
      let bookid = req.params.id;

      if (bookid) {
        Book.findById(bookid)
          .then(function (data) {
            //Check if data is true; freeCodeCamp test cases return {} for for data for an invalid id instead of catching an error and returning 'no book exists'
            if (data) {
              res.send(data);
            } else {
              res.json("no book exists");
            }
          })
          .catch(() => res.json("no book exists"));
      }
    })

    .post(function (req, res) {
      let bookid = req.params.id;
      let comment = req.body.comment;

      let bookComment = {
        $push: { comments: comment }, //Pushing comment into comments array
        $inc: { commentcount: 1 }, //Incrementing commentcount on each comment entry
      };

      if (bookid) {
        if (comment) {
          Book.findByIdAndUpdate(bookid, bookComment, { new: true })
            .then(function (data) {
              if (data) {
                res.send(data);
              } else {
                res.json("no book exists");
              }
            })
            .catch(() => res.json("no book exists"));
        } else {
          res.json("missing required field comment");
        }
      }
    })

    .delete(function (req, res) {
      let bookid = req.params.id;
      if (bookid) {
        Book.findByIdAndRemove(bookid)
          .then(function (data) {
            if (data) {
              res.json("delete successful");
            } else {
              res.json("no book exists");
            }
          })
          .catch(() => res.json("no book exists"));
      }
    });
};
