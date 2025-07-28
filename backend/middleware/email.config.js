const nodemailer = require("nodemailer");

// Create a test account or replace with real credentials.
const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 587,
  secure: false, // true for 465, false for other ports
  auth: {
    user: "capthussain2point0@gmail.com",
    pass: "hrwx fdio werz iout",
  },
});

// Wrap in an async IIFE so we can use await.
// const SendEmail = (async () => {
//   try {
//     const info = await transporter.sendMail({
//       from: '"Spotify" <capthussain2point0@gmail.com>',
//       to: "ranaitx194@gmail.com",
//       subject: "Hello ✔",
//       text: "Hello world?", // plain‑text body
//       html: "<b>Hello world?</b>", // HTML body
//     });
//     console.log(info);
//   } catch (error) {
//     console.log(error);
//   }
// })();

module.exports = transporter;
