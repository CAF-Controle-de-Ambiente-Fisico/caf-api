"use strict";

const sgMail = use("@sendgrid/mail");

sgMail.setApiKey(process.env.SENDGRID_API_KEY);

const sendEmail = async (data) => {
    const msg = {
        to: data.email, 
        from: "caf.trt21@gmail.com", 
        subject: "Confirmação de Senha",
        text: `Link para confirmação de senha`,
        html: `<h1>Olá ${data.username}</h1> 
            <p>Clique no link abaixo para o próximo passo do seu cadastro:</p> 
            <a href='http://localhost:3000/signup/confirmation?token=${data.code}&role=${data.role}'> Seguir com meu cadastro </a>`};
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