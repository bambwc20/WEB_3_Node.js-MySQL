var db = require("./db");
var template = require("./template");
var url = require("url");

exports.home = function (request, response) {
  db.query(`SELECT * FROM topic`, function (error, topics) {
    if (error) {
      throw error;
    }
    db.query(
      "SELECT * FROM author_comment LEFT JOIN comment ON comment.author_id = author_comment.id ORDER BY created ASC",
      function (error2, comments) {
        var title = "WEB";
        var description =
          "The World Wide Web (WWW), commonly known as the Web, is an information system where documents and other web resources are identified by Uniform Resource Locators (URLs, such as https://example.com/), which may be interlinked by hypertext, and are accessible over the Internet.[1][2] The resources of the Web are transferred via the Hypertext Transfer Protocol (HTTP), may be accessed by users by a software application called a web browser, and are published by a software application called a web server. The World Wide Web is not synonymous with the Internet, which pre-dated the Web in some form by over two decades and upon which technologies the Web is built.";
        var topic_author = "by admin";
        var list = template.List(topics);
        var comments_row = template.CommentList(comments);
        var html = template.HTML(
          title,
          '<a href="/">WEB</a>',
          list,
          `<h2>${title}</h2><p>${description}</p><p>${topic_author}</p>`,
          comments_row,
          template.homepage_comment_box(
            "/create_process",
            "0",
            "",
            "",
            "",
            "",
            "create"
          ),
          '<div id="manage"><a href="/handle_topic">*manage topic*</a></div>'
        );
        response.end(html);
        response.writeHead(200);
      }
    );
  });
};

exports.page = function (request, response) {
  var _url = request.url;
  var queryData = url.parse(_url, true).query;
  db.query(`SELECT * FROM topic`, function (error, topics) {
    db.query(
      `SELECT * FROM author LEFT JOIN topic ON topic.author_id = author.id WHERE topic.id = ?`,
      [queryData.id],
      function (error, topic) {
        if (error) {
          throw error;
        }
        db.query(
          "SELECT * FROM author_comment LEFT JOIN comment ON comment.author_id = author_comment.id ORDER BY created ASC",
          function (error2, comments) {
            var title = topic[0].title;
            var description = topic[0].description;
            var topic_author = "by " + topic[0].name;
            var list = template.List(topics);
            var comments_row = template.CommentList(comments);
            var html = template.HTML(
              title,
              '<a href="/">WEB</a>',
              list,
              `<h2>${title}</h2><p>${description}</p><p>${topic_author}</p>`,
              comments_row,
              template.homepage_comment_box(
                "/create_process",
                topic[0].id,
                "",
                "",
                "",
                "",
                "create"
              ),
              '<div id="manage"><a href="/handle_topic">*manage topic*</a></div>'
            );
            response.end(html);
            response.writeHead(200);
          }
        );
      }
    );
  });
};
