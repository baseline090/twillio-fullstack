const sendToken = (user, statusCode, res) => {
  const token = user.getToken();
  const options = {
    httpOnly: true,
    expires: new Date(
      Date.now() + process.env.COOKIE_EXPIRE * 24 * 60 * 60 * 1000
    ),
    sameSite: "None", // set SameSite attribute to "None"
    secure: false, // use Secure attribute for HTTPS connections
    // domain: "localhost",
  };
  res.status(statusCode).cookie("token", token, options).json({
    success: true,
    user,
    token,
  });
};
module.exports = { sendToken };
