const jwt = require("jsonwebtoken");

exports.Logger = async (req, res, next) => {
  try {
    let token;
    if (req.headers.authorization == "") {
      return res.status(400).json({
        success: false,
        error: "таны эрх хүрэхгүй байна",
      });
    }
    token = req.headers.authorization.split(" ")[1];
  } catch (error) {
    return res.status(400).json({
      success: false,
      error: error,
    });
  }

  next();
};