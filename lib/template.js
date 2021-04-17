module.exports = {
  //본문을 표시해주는 함수
  HTML: function (
    _title,
    _head,
    _list,
    _body,
    _comment,
    _writecomment,
    _topicContorl
  ) {
    return ` 
        <!doctype html>
        <html>
        <head>
        <title>WEB - ${_title}</title>
        <meta charset="utf-8">
        <link rel="stylesheet" href="http://localhost:3156/">
        <script src="http://localhost:3268/"></script>
        </head>
        <body>
        <h1>${_head}</h1>
        <div id="grid">
            ${_list}
                <div id="article">
                    ${_body}
                </div>
        </div>
        ${_topicContorl}

        ${_writecomment}

        ${_comment}

        <div id="box">
            <div id="button"> 
                <input style="font-size: 25px;" type="button" value="night" onclick="night_day_control(this)">
            </div>
        </div>

        </body>
        </html>
        `;
  },
  List: function (topics) {
    var list = "<ol>";
    var i = 0;
    while (i < topics.length) {
      list =
        list + `<li><a href="/?id=${topics[i].id}">${topics[i].title}</a></li>`;
      i++;
    }
    list = list + "</ol>";
    return list;
  },
  CommentList: function (_commentlist) {
    var text = "<ul>";
    for (var i = 0; i < _commentlist.length; i++) {
      var comment = _commentlist[i].description;
      text =
        text +
        `<li>
                Title: ${_commentlist[i].title} 
                <p>Description: 
                    ${comment}
                    <p>
                      by ${_commentlist[i].name}
                    </p>
                    <form action="/delete_process" method="post">
                        <input type="hidden" name="id" value="${_commentlist[i].id}">
                        <input type="submit" value="delete">
                    </form>
                    <form action="/update" method="post">
                        <input type="hidden" name="id" value="${_commentlist[i].id}">
                        <input type="submit" value="update">
                    </form>
                </p>
            </li>`;
    }
    text = text + "</ul>";
    return text;
  },
  homepage_comment_box: function (
    path,
    id,
    title,
    description,
    named,
    profile,
    value
  ) {
    return `
    <div id="comment_box_line">
        <form action="${path}" method="post">
            <input type="hidden" name="id" value="${id}">
            <input type="text" placeholder="title....." name="title" id="comment_input_box" value="${title}">
            <p><textarea placeholder="description....." name="description" id="comment_textarea" cols="30" rows="10">${description}</textarea></p> 
            <p><input type="text" placeholder="author" name="name" value="${named}"></p>
            <p><textarea type="text" placeholder="profile....." name="profile">${profile}</textarea></p>
            <input type="submit" value="${value}">
        </form>
    </div>
    `;
  },
  TopicList: function (topics) {
    var list = "<ol>";
    var i = 0;
    while (i < topics.length) {
      list =
        list +
        `<li><a href="/handle_topic/manage/?id=${topics[i].id}">${topics[i].title}</a></li>`;
      i++;
    }
    list = list + "</ol>";
    return list;
  },
};
