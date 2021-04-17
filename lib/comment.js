var db = require("./db");
var template = require("./template");
var qs = require("querystring");
var location = require("./location");

exports.create_process = function (request, response) {
  var body = "";
  request.on("data", function (data) {
    body = body + data;
  });
  request.on("end", function () {
    var post = qs.parse(body);
    var spot = location.id_location(post.id);
    db.query(
      "INSERT INTO author_comment(name, profile) VALUES(?, ?)",
      [post.name, post.profile],
      function (error, result) {
        db.query(
          "INSERT INTO comment(title, description, created, author_id) VALUES(?, ?, NOW(), ?)",
          [post.title, post.description, result.insertId],
          function (error2, result2) {
            response.writeHead(302, { Location: spot });
            response.end();
          }
        );
      }
    );
  });
};

exports.update = function (request, response) {
  var body = "";
  request.on("data", function (data) {
    body = body + data;
  });
  request.on("end", function () {
    var post = qs.parse(body);
    db.query(`SELECT * FROM topic`, function (error, topics) {
      db.query(
        "SELECT * FROM author_comment LEFT JOIN comment ON comment.author_id = author_comment.id ORDER BY created ASC",
        function (error2, comments) {
          db.query(
            "SELECT * FROM author_comment LEFT JOIN comment ON comment.author_id = author_comment.id WHERE comment.id = ?",
            [post.id],
            function (error2, comment) {
              var title = "UPDATE";
              var list = template.List(topics);
              var comments_row = template.CommentList(comments);
              var html = template.HTML(
                title,
                '<a href="/">WEB</a>',
                list,
                `<h2>${title}</h2>
                ${template.homepage_comment_box(
                  "/update_process",
                  comment[0].id,
                  comment[0].title,
                  comment[0].description,
                  comment[0].name,
                  comment[0].profile,
                  "update"
                )}`,

                comments_row,
                "",
                '<div id="manage"><a href="/handle_topic">*manage topic*</a></div>'
              );
              response.end(html);
              response.writeHead(200);
            }
          );
        }
      );
    });
  });
};

exports.update_process = function (request, response) {
  var body = "";
  request.on("data", function (data) {
    body = body + data;
  });
  request.on("end", function () {
    var post = qs.parse(body);
    db.query(
      "UPDATE comment SET title = ?, description = ? WHERE id = ?",
      [post.title, post.description, post.id],
      function (err, result) {
        db.query(
          "SELECT * FROM comment WHERE id = ?",
          [post.id],
          function (err2, result2) {
            db.query(
              "UPDATE author_comment SET name = ?, profile = ? WHERE id = ?",
              [post.name, post.profile, result2[0].author_id],
              function (err3, result3) {
                response.writeHead(302, { Location: "/" });
                response.end();
              }
            );
          }
        );
      }
    );
  });
};

exports.delete_process = function (request, response) {
  var body = "";
  request.on("data", function (data) {
    body = body + data;
  });
  request.on("end", function () {
    var post = qs.parse(body);
    db.query(
      "SELECT * FROM comment WHERE id = ?",
      [post.id],
      function (err, result) {
        db.query(
          "DELETE FROM author_comment WHERE id = ?",
          [result[0].author_id],
          function (err2, result2) {
            db.query(
              "DELETE FROM comment WHERE id = ?",
              [post.id],
              function (err3, result3) {
                response.writeHead(302, { Location: "/" });
                response.end();
              }
            );
          }
        );
      }
    );
  });
};
