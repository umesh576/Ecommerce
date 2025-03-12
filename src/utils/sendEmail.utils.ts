import nodemailer from "nodemailer";

interface IMailOption {
  to: string;
  subject: string;
  html: string;
}

const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: parseInt(process.env.SMTP_PORT as string), // Convert to number
  secure: process.env.SMTP_PORT === "465", // Correct comparison
  auth: {
    user: process.env.MAIL_FROM,
    pass: process.env.SMTP_PASSWORD,
  },
});

export const sendMail = async (mailOptions: IMailOption) => {
  try {
    console.log("first");
    const mailOption = {
      from: `"${process.env.MAIL_FROM}" <${process.env.SMTP_EMAIL}>`,
      to: mailOptions.to,
      subject: mailOptions.subject, // Fixed typo
      html: mailOptions.html,
    };
    const sent = await transporter.sendMail(mailOption);
    console.log(sent);
  } catch (error) {
    console.log(error);
  }
};
