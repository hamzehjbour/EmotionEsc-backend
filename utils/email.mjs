/* eslint-disable no-useless-catch */
import nodemailer from "nodemailer";

const sendMail = async (options) => {
  try {
    let transporter;

    if (process.env.NODE_ENV === "production") {
      transporter = nodemailer.createTransport({
        service: "Gmail",
        auth: {
          user: process.env.GMAIL_USERNAME,
          pass: process.env.GMAIL_PASSWORD,
        },
      });
    } else {
      transporter = nodemailer.createTransport({
        host: process.env.EMAIL_HOST,
        port: process.env.EMAIL_PORT,
        auth: {
          user: process.env.EMAIL_USERNAME,
          pass: process.env.EMAIL_PASSWORD,
        },
      });
    }

    const mailOptions = {
      from: "EmotionEsc team <hamzehjbour322@gmail.com>",
      to: options.email,
      subject: options.subject,
      text: options.message,
      html: options.html,
    };

    const info = await transporter.sendMail(mailOptions);
  } catch (error) {
    throw error;
  }
};

export default sendMail;
