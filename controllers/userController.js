const userService = require("../services/userService");

const nodemailer = require("nodemailer");

// In-memory storage for simplicity
let verificationCodes = {};

// Mail transporter setup (using nodemailer with a dummy SMTP service)
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: "smartdev0214@gmail.com",
    pass: "sriy vyti ubvq rnyc",
  },
});

// Endpoint to generate and send a code
const sendCode = async (req, res) => {
  console.log("email: ", req.body.email);
  const { email } = req.body;
  const code = Math.floor(1000 + Math.random() * 9000);
  verificationCodes[email] = code; // Store code
  console.log("pass: ", email);
  try {
    console.log("1: ", transporter.sendMail);

    const mailOptions = {
      from: "smartdev0214@gmail.com",
      to: email,
      subject: "Your Verification Code",
      text: `Your verification code is : ${code}`,
    };

    await transporter.sendMail(mailOptions);
    console.log("2:");
    res.json({ email });
  } catch (error) {
    console.log("3: ", error);
    res.status(500).json({ msg: "Failed to send email" });
  }
};

const verifyCode = (req, res) => {
  console.log("req.body: ", req.body.email, req.body.code);
  const { email, code } = req.body;
  const validCode = verificationCodes[email];
  console.log("ValidCode: ", code);
  if (parseInt(code) === validCode) {
    delete verificationCodes[email]; // Remove code after verification
    res.json({ msg: "Verification successful" });
  } else {
    res.json({ msg: "Verification failed" });
  }
};

module.exports = {
  sendCode,
  verifyCode,
};
