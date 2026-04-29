const nodemailer = require('nodemailer');
require('dotenv').config();

// Check if email credentials are properly configured
const isMailConfigured = process.env.MAIL_USER &&
  process.env.MAIL_PASS &&
  process.env.MAIL_PASS.length > 10; // App passwords are 16 chars

let transporter = null;

if (isMailConfigured) {
  transporter = nodemailer.createTransport({
    host: process.env.MAIL_HOST,
    port: process.env.MAIL_PORT,
    secure: false,
    auth: {
      user: process.env.MAIL_USER,
      pass: process.env.MAIL_PASS
    }
  });
  console.log('📧 Email configurado correctamente');
} else {
  console.log('⚠️  Email NO configurado — los contactos se guardarán en BD pero no se enviará auto-reply');
  console.log('   Para activar emails: habilitar Verificación en 2 pasos en Google → generar Contraseña de Aplicación → colocarla en MAIL_PASS');
}

const sendAutoReply = async (clientEmail, clientName) => {
  // If email is not configured, just log and return
  if (!transporter) {
    console.log(`📋 Nueva solicitud de ${clientName} (${clientEmail}) — guardada en BD (email auto-reply desactivado)`);
    return false;
  }

  const mailOptions = {
    from: `"Mx Solutions" <${process.env.MAIL_USER}>`,
    to: clientEmail,
    subject: '¡Hemos recibido tu solicitud! - Mx Solutions',
    html: `
      <div style="font-family: 'Segoe UI', Arial, sans-serif; max-width: 600px; margin: 0 auto; background: #0a0a0a; border: 1px solid #333; border-radius: 12px; overflow: hidden;">
        <div style="background: linear-gradient(135deg, #1a1a2e 0%, #16213e 100%); padding: 40px 30px; text-align: center;">
          <h1 style="color: #d4af37; margin: 0; font-size: 28px; letter-spacing: 2px;">MX SOLUTIONS</h1>
          <p style="color: #c0c0c0; margin-top: 8px; font-size: 14px;">Desarrollo Web a Medida</p>
        </div>
        <div style="padding: 30px;">
          <h2 style="color: #ffffff; font-size: 20px;">¡Hola ${clientName}!</h2>
          <p style="color: #cccccc; line-height: 1.8; font-size: 15px;">
            Gracias por contactarnos. Hemos recibido tu solicitud correctamente y nuestro equipo la está revisando.
          </p>
          <p style="color: #cccccc; line-height: 1.8; font-size: 15px;">
            Nos pondremos en contacto contigo a la brevedad para discutir tu proyecto y encontrar la mejor solución para tus necesidades.
          </p>
          <div style="text-align: center; margin: 30px 0;">
            <div style="display: inline-block; background: linear-gradient(135deg, #d4af37, #b8860b); color: #000; padding: 12px 30px; border-radius: 8px; font-weight: bold; font-size: 14px;">
              Solicitud Recibida ✓
            </div>
          </div>
          <p style="color: #999999; font-size: 13px; border-top: 1px solid #333; padding-top: 20px; margin-top: 30px;">
            Si necesitas comunicarte con urgencia, puedes escribirnos por WhatsApp.
          </p>
        </div>
        <div style="background: #111; padding: 20px; text-align: center;">
          <p style="color: #666; margin: 0; font-size: 12px;">© ${new Date().getFullYear()} Mx Solutions. Todos los derechos reservados.</p>
        </div>
      </div>
    `
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log(`✅ Auto-reply enviado a ${clientEmail}`);
    return true;
  } catch (error) {
    console.error('❌ Error enviando email:', error.message);
    return false;
  }
};

module.exports = { sendAutoReply };
