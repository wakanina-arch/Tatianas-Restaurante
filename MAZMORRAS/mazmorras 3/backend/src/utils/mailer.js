import nodemailer from 'nodemailer';

export const transporter = nodemailer.createTransport({
  service: 'gmail', // Puedes cambiar a otro proveedor
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

export const sendTicketMail = async ({ to, subject, html }) => {
  return transporter.sendMail({
    from: `Tatiana's Restaurante <${process.env.EMAIL_USER}>`,
    to,
    subject,
    html,
  });
};
