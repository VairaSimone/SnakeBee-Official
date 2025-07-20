import nodemailer from 'nodemailer';

const transporter = nodemailer.createTransport({
  host: process.env.EMAIL_HOST, // es. 'smtp.gmail.com'
  port: process.env.EMAIL_PORT, // es. 465 or 587
  secure: process.env.EMAIL_SECURE === 'true', // true per 465, false per altri
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  }, tls: {
    rejectUnauthorized: false
  }
});

//Email registrazione
const sendVerificationEmail = async (to, code) => {
  const verificationLink = `${process.env.FRONTEND_URL}/verify-email?email=${encodeURIComponent(to)}`;
  const mailOptions = {
    from: `"SnakeBee" <noreply@snakebee.it>`,
    to: to,
    subject: 'Conferma il tuo indirizzo email per SnakeBee',
    text: `Benvenuto in SnakeBee!\n\nUtilizza questo codice per verificare la tua email: ${code}\nOppure clicca qui: ${verificationLink}`,
    html: `
      <div style="
        max-width: 600px;
        margin: 20px auto;
        padding: 30px;
        background-color: #f7f7f7;
        border-radius: 10px;
        font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif;
      ">
        <div style="text-align: center; margin-bottom: 30px;">
          <img src="${process.env.LOGO_URL}" alt="SnakeBee Logo" style="max-width: 200px; height: auto;">
        </div>

        <h1 style="color: #2c3e50; text-align: center; margin-bottom: 30px;">
          Conferma il tuo indirizzo email
        </h1>

        <div style="
          background-color: #ffffff;
          padding: 25px;
          border-radius: 8px;
          margin-bottom: 25px;
        ">
          <p style="font-size: 16px; color: #555; line-height: 1.6;">
            Ciao,<br>
            Grazie per esserti registrato a SnakeBee! Per completare la registrazione,
            conferma il tuo indirizzo email utilizzando il codice qui sotto:
          </p>

          <div style="
            background-color: #f0f0f0;
            padding: 15px;
            border-radius: 5px;
            text-align: center;
            font-size: 24px;
            letter-spacing: 2px;
            margin: 25px 0;
            color: #2c3e50;
          ">
            ${code}
          </div>

          <p style="text-align: center; margin: 30px 0;">
            <a href="${verificationLink}" 
              style="
                background-color: #3498db;
                color: white;
                padding: 12px 25px;
                border-radius: 5px;
                text-decoration: none;
                font-weight: bold;
                display: inline-block;
              ">
              Verifica Ora
            </a>
          </p>

          <p style="font-size: 14px; color: #777; text-align: center;">
            Oppure copia e incolla questo link nel tuo browser:<br>
            <span style="word-break: break-all; color: #3498db;">${verificationLink}</span>
          </p>
        </div>

        <p style="font-size: 12px; color: #777; text-align: center;">
          Se non hai richiesto questa registrazione, puoi ignorare questa email.
        </p>
      </div>
    `  };

  try {
    await transporter.sendMail(mailOptions);
    console.log('Email di verifica inviata a:', to);
  } catch (error) {
    console.error("Errore nell'invio dell'email di verifica a:" + error, to);
  }
};

//Password reset email
const sendPasswordResetEmail = async (to, code) => {
  const resetLink = `${process.env.FRONTEND_URL}/reset-password?email=${encodeURIComponent(to)}`;
  const mailOptions = {
    from: `"SnakeBee" <noreply@snakebee.it>`,
    to: to,
    subject: 'Reset della Password - SnakeBee',
    text: `Hai richiesto il reset della password. Codice: ${code}\nLink diretto: ${resetLink}`,
    html: `
      <div style="
        max-width: 600px;
        margin: 20px auto;
        padding: 30px;
        background-color: #f7f7f7;
        border-radius: 10px;
        font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif;
      ">
        <div style="text-align: center; margin-bottom: 30px;">
          <img src="${process.env.LOGO_URL}" alt="SnakeBee Logo" style="max-width: 200px; height: auto;">
        </div>

        <h1 style="color: #2c3e50; text-align: center; margin-bottom: 30px;">
          Reset della Password
        </h1>

        <div style="
          background-color: #ffffff;
          padding: 25px;
          border-radius: 8px;
          margin-bottom: 25px;
        ">
          <p style="font-size: 16px; color: #555; line-height: 1.6;">
            Ciao,<br>
            Hai richiesto di resettare la tua password. Utilizza il codice qui sotto 
            o clicca il pulsante per completare l'operazione:
          </p>

          <div style="
            background-color: #f0f0f0;
            padding: 15px;
            border-radius: 5px;
            text-align: center;
            font-size: 24px;
            letter-spacing: 2px;
            margin: 25px 0;
            color: #2c3e50;
          ">
            ${code}
          </div>

          <p style="text-align: center; margin: 30px 0;">
            <a href="${resetLink}" 
              style="
                background-color: #e74c3c;
                color: white;
                padding: 12px 25px;
                border-radius: 5px;
                text-decoration: none;
                font-weight: bold;
                display: inline-block;
              ">
              Resetta Password Ora
            </a>
          </p>

          <p style="font-size: 14px; color: #777; text-align: center;">
            Questo link è valido per 1 ora.<br>
            <span style="word-break: break-all; color: #3498db;">${resetLink}</span>
          </p>
        </div>

        <p style="font-size: 12px; color: #777; text-align: center;">
          Se non hai richiesto questa operazione, ti preghiamo di ignorare questa email.
        </p>
      </div>
    `  };

  try {
    await transporter.sendMail(mailOptions);
    console.log('Email di reset password inviata a:', to);
  } catch (error) {
    console.error("Errore nell'invio dell'email di reset password a", to);
    throw error;
  }
};


export { sendVerificationEmail, sendPasswordResetEmail, transporter };
