"use strict";

const sgMail = use("@sendgrid/mail");

sgMail.setApiKey(process.env.SENDGRID_API_KEY);

const sendCodeAccess = async (data) => {
    const msg = {
        to: data.email, 
        from: "caf.trt21@gmail.com", 
        subject: "Código de Acesso",
        text: "Use essa senha de acesso para entrar no TRT",
        html: `
            <h1>Seja bem vindo ${data.username}!</h1> 
            <p>Para que você tenha acesso ao prédio, criamos um código de segurança para sua identificação!</p>
            <p>Não <strong>DIVULGE</strong> ou <strong>PERMITA</strong> que usem sua senha de acesso, ela é <strong>ÚNICA</strong> para identificação <strong>INDIVIDUAL SUA</strong>.</p>
            <h5>Você não precisa decorar essa senha, ela estará disponível pra você aqui neste email e na nossa <strong><h4><a href='http://localhost:3000'>PLATAFORMA</a></h4></strong></h5>
            <h3>Código de Acesso</h3>
            <h2>${data.code}</h2>
            `};
    sgMail
    .send(msg)
    .then(() => {   
        console.log("Code Access sent");
    })
    .catch((error) => {
        console.error(error);
      });
  }

module.exports = sendCodeAccess; 