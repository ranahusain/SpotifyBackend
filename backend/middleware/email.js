const transporter = require("./email.config");

const SendVerificationCode = async (email, verificationCode) => {
  try {
    const response = await transporter.sendMail({
      from: '"Spotify" <capthussain2point0@gmail.com>',
      to: email,
      subject: "Verify Your Email",
      text: `Your verification code is: ${verificationCode}`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: auto; padding: 20px; background-color: #f7f7f7; border-radius: 8px;">
          <h2 style="color: #1DB954;">Welcome to Spotify!</h2>
          <p style="font-size: 16px; color: #333;">
            Thanks for signing up! To complete your registration, please use the following verification code:
          </p>
          <div style="font-size: 24px; font-weight: bold; margin: 20px 0; color: #1DB954;">${verificationCode}</div>
          <p style="font-size: 14px; color: #666;">
            If you didn’t request this, you can safely ignore this email.
          </p>
          <p style="font-size: 14px; color: #666;">
            – The Spotify Team
          </p>
        </div>
      `,
    });
    console.log("Email sent Successfully!");
  } catch (error) {
    console.log("Error while sending Email", error);
  }
};

const SendWelcomeEmail = async (email, name) => {
  try {
    await transporter.sendMail({
      from: '"Spotify" <capthussain2point0@gmail.com>',
      to: email,
      subject: "Welcome to Spotify!",
      html: `
        <div style="font-family: Arial, sans-serif; background-color: #f9f9f9; padding: 30px; border-radius: 8px; max-width: 600px; margin: auto; color: #333;">
          <h2 style="color: #1DB954;">Hi ${name},</h2>
          <p style="font-size: 16px;">
            Your email has been <strong style="color: #1DB954;">successfully verified</strong>.
          </p>
          <p style="font-size: 16px;">
            Welcome to <strong>Spotify</strong>! We're thrilled to have you on board. 🎧
          </p>
          <p style="font-size: 16px;">
            Start discovering music, creating playlists, and sharing your vibe with the world!
          </p>
          <hr style="margin: 30px 0; border: none; border-top: 1px solid #ddd;" />
          <p style="font-size: 14px; color: #777;">
            Need help? Visit our <a href="https://support.spotify.com" style="color: #1DB954;">Support Center</a>.
          </p>
          <p style="font-size: 14px; color: #777;">
            – The Spotify Team
          </p>
        </div>
      `,
    });

    console.log("Welcome email sent!");
  } catch (error) {
    console.error("Error sending welcome email:", error.message);
  }
};

module.exports = { SendVerificationCode, SendWelcomeEmail };
