"use strict";

const sgMail = use("@sendgrid/mail");

sgMail.setApiKey(process.env.SENDGRID_API_KEY);

const sendEmail = async (data) => {
    const msg = {
        to: data.email, 
        from: "caf.trt21@gmail.com", 
        subject: "Confirmação de Senha",
        text: `Link para confirmação de senha`,
        html: `<h1>olá ${data.username} esse é seu link de confirmação de senha: https://caf-web-git-master-caf-controle-de-ambiente-fisico.vercel.app/signup/confirmation?token=${data.code}</h1>`
    };
    sgMail
    .send(msg)
    .then(() => {   
        console.log("Email sent");
    })
    .catch((error) => {
        console.error(error);
      });
  }

module.exports = sendEmail; 