var http = require("http");
var fs = require("fs");
var url = require("url");
var topic = require("./lib/topic");
var comment = require("./lib/comment");
var handle_topic = require("./lib/handle_topic");

//Main 서버
var app = http.createServer(function (request, response) {
  var _url = request.url;
  var queryData = url.parse(_url, true).query;
  var pathname = url.parse(_url, true).pathname;
  switch (pathname) {
    case "/":
      switch (queryData.id) {
        case undefined:
          topic.home(request, response);
          break;

        default:
          topic.page(request, response);
          break;
      }
      break;

    case "/create_process":
      comment.create_process(request, response);
      break;

    case "/update":
      comment.update(request, response);
      break;

    case "/update_process":
      comment.update_process(request, response);
      break;

    case "/delete_process":
      comment.delete_process(request, response);
      break;

    case "/handle_topic":
      handle_topic.home(request, response);
      break;

    case "/handle_topic/manage/":
      handle_topic.page(request, response);
      break;

    case "/handle_topic/manage/create":
      handle_topic.create(request, response);
      break;

    case "/handle_topic/manage/create_process":
      handle_topic.create_process(request, response);
      break;

    case "/handle_topic/manage/update":
      handle_topic.update(request, response);
      break;

    case "/handle_topic/manage/update_process":
      handle_topic.update_process(request, response);
      break;

    case "/handle_topic/manage/delete_process":
      handle_topic.delete_process(request, response);
      break;

    default:
      response.end("Not founded");
      response.writeHead(404);
      break;
  }
});

//이미지 서버
var app1 = http.createServer(function (request, response) {
  fs.readFile(`data/coding.jpg`, function (err, data) {
    response.writeHead(200, { "Content-Type": "image/jpeg" });
    response.end(data);
  });
});

//브라우저 JS서버
var app2 = http.createServer(function (request, response) {
  fs.readFile(`data/colors.js`, function (err, data) {
    response.writeHead(200, { "Content-Type": "text/javascript" });
    response.write(data);
    response.end();
  });
});

//브라우저 CSS서버
var app3 = http.createServer(function (request, response) {
  fs.readFile(`data/style.css`, function (err, data) {
    response.writeHead(200, { "Content-Type": "text/css" });
    response.write(data);
    response.end();
  });
});

app.listen(3000); //Main서버 시작
console.log("Server running at http://localhost:3000/");
app1.listen(3124); //이미지 서버 시작
console.log("Server running at http://localhost:3124/");
app2.listen(3268); //브라우저 JS 서버 시작
console.log("Server running at http://localhost:3268/");
app3.listen(3156); //브라우저 CSS 서버 시작
console.log("Server running at http://localhost:3156/");
