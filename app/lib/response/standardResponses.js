module.exports = {
  http200: function (data) {
    let message = data.message;
    delete data.message;
    return this.status(200).json({
      status: {
        code: 200,
        message: message || "success",
      },
      data: data,
    });
  },
  http400: function (err) {
    return this.status(400).json({
      status: {
        code: 400,
        message: err,
      },
    });
  },

  http401: function (err) {
    return this.status(401).json({
      status: {
        code: 401,
        message: err,
      },
    });
  },

  http404: function (err) {
    return this.status(404).json({
      status: {
        code: 404,
        message: err,
      },
    });
  },
};
