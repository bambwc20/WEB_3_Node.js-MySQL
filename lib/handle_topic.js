var db = require("./db");
var template = require("./template");
var url = require("url");
var template = require("./template");
var qs = require("querystring");

exports.home = function (request, response) {
  db.query(`SELECT * FROM topic`, function (error, topics) {
    if (error) {
      throw error;
    }
    var title = "Manage Topic";
    var description =
      "Choose topic to manage or change from left side and Create topic from create topic button!";
    var list = template.TopicList(topics);
    var html = template.HTML(
      title,
      "Manage Topic",
      list,
      `<h2>${title}</h2><p>${description}</p>`,
      "",
      "",
      `<div style="margin-top: 20px; margin-left: 10px;"><a href="/handle_topic/manage/create">Create Topic</a></div> <div id="manage"><a href="/">*Go To WEB*</a></div>`
    );
    response.end(html);
    response.writeHead(200);
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
        var title = topic[0].title;
        var description = topic[0].description;
        var topic_author = "by " + topic[0].name;
        var author_profile = topic[0].name + " profile: " + topic[0].profile;
        var list = template.TopicList(topics);
        var html = template.HTML(
          "Manage Topic - " + title,
          `Manage Topic - ${topic[0].title}`,
          list,
          `<h2>${title}</h2><p>${description}</p><p>${topic_author}</p><p>${author_profile}</p>
            <p>
            <form action="/handle_topic/manage/delete_process" method="post">
                <input type="hidden" name="id" value="${topic[0].id}">
                <input type="submit" value="delete">
            </form>
            <form action="/handle_topic/manage/update" method="post">
                <input type="hidden" name="id" value="${topic[0].id}">
                <input type="submit" value="update">
            </form>
          </p>
          `,
          "",
          "",
          `<div style="margin-top: 20px; margin-left: 10px;"><a href="/handle_topic/manage/create">Create Topic</a></div> <div id="manage"><a href="/">*Go To WEB*</a></div>`
        );
        response.end(html);
        response.writeHead(200);
      }
    );
  });
};

exports.create = function (request, response) {
  db.query(`SELECT * FROM topic`, function (error, topics) {
    var title = "Create Topic";
    var list = template.TopicList(topics);
    var html = template.HTML(
      title,
      `Manage Topic - Create`,
      list,
      `<h2>${title}</h2>
        ${template.homepage_comment_box(
          "/handle_topic/manage/create_process",
          "",
          "",
          "",
          "",
          "",
          "create"
        )}`,
      "",
      "",
      `<div style="margin-top: 20px; margin-left: 10px;"><a href="/handle_topic/manage/create">Create Topic</a></div> <div id="manage"><a href="/">*Go To WEB*</a></div>`
    );
    response.end(html);
    response.writeHead(200);
  });
};

exports.create_process = function (request, response) {
  var body = "";
  request.on("data", function (data) {
    body = body + data;
  });
  request.on("end", function () {
    var post = qs.parse(body);
    db.query(
      "INSERT INTO author(name, profile) VALUES(?, ?)",
      [post.name, post.profile],
      function (error, result) {
        db.query(
          "INSERT INTO topic(title, description, created, author_id) VALUES(?, ?, NOW(), ?)",
          [post.title, post.description, result.insertId],
          function (error2, result2) {
            response.writeHead(302, {
              Location: `/handle_topic/manage/?id=${result2.insertId}`,
            });
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
        "SELECT * FROM author LEFT JOIN topic ON topic.author_id = author.id WHERE topic.id = ?",
        [post.id],
        function (error, topic) {
          var title = topic[0].title;
          var list = template.TopicList(topics);
          var html = template.HTML(
            "UPDATE - " + title,
            '<a href="/">WEB</a>',
            list,
            `<h2>${title}</h2>
                  ${template.homepage_comment_box(
                    "/handle_topic/manage/update_process",
                    topic[0].id,
                    topic[0].title,
                    topic[0].description,
                    topic[0].name,
                    topic[0].profile,
                    "update"
                  )}`,
            "",
            "",
            `<div style="margin-top: 20px; margin-left: 10px;"><a href="/handle_topic/manage/create">Create Topic</a></div> <div id="manage"><a href="/">*Go To WEB*</a></div>`
          );
          response.end(html);
          response.writeHead(200);
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
      "UPDATE topic SET title = ?, description = ? WHERE id = ?",
      [post.title, post.description, post.id],
      function (err, result) {
        db.query(
          "SELECT * FROM topic WHERE id = ?",
          [post.id],
          function (err2, result2) {
            db.query(
              "UPDATE author SET name = ?, profile = ? WHERE id = ?",
              [post.name, post.profile, result2[0].author_id],
              function (err3, result3) {
                response.writeHead(302, {
                  Location: `/handle_topic/manage/?id=${post.id}`,
                });
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
      "SELECT * FROM topic WHERE id = ?",
      [post.id],
      function (err, result) {
        db.query(
          "DELETE FROM author WHERE id = ?",
          [result[0].author_id],
          function (err2, result2) {
            db.query(
              "DELETE FROM topic WHERE id = ?",
              [post.id],
              function (err3, result3) {
                response.writeHead(302, { Location: "/handle_topic" });
                response.end();
              }
            );
          }
        );
      }
    );
  });
};
