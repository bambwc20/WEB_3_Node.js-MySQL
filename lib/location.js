module.exports = {
  id_location: function (id) {
    if (id === "0") {
      return "/";
    } else {
      return `/?id=${id}`;
    }
  },
};
