const { Resend } = require('resend');

const resend = new Resend(process.env.RESEND_API_KEY);

// Email "from" - usar el dominio verificado o el de Resend por defecto
const FROM_EMAIL = process.env.FROM_EMAIL || 'CV Express <onboarding@resend.dev>';

const emailService = {
  // Enviar email de recuperación de contraseña
  async sendPasswordReset(email, name, resetToken) {
    const resetLink = `https://cv-express.dpovi.me/reset-password/${resetToken}`;
    
    try {
      const { data, error } = await resend.emails.send({
        from: FROM_EMAIL,
        to: email,
        subject: 'Restablecer tu contraseña - CV Express',
        html: `
          <!DOCTYPE html>
          <html>
          <head>
            <meta charset="utf-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
          </head>
          <body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; background: #f5f8ff; padding: 40px 20px; margin: 0;">
            <div style="max-width: 480px; margin: 0 auto; background: #ffffff; border-radius: 16px; padding: 40px; box-shadow: 0 4px 20px rgba(0,0,0,0.1);">
              <div style="text-align: center; margin-bottom: 30px;">
                <h1 style="color: #1a237e; font-size: 28px; margin: 0;">CV Express</h1>
                <p style="color: #d32f2f; font-size: 12px; letter-spacing: 2px; margin: 5px 0;">ATS READY</p>
              </div>
              
              <h2 style="color: #1a2230; font-size: 20px; margin-bottom: 16px;">Hola ${name},</h2>
              
              <p style="color: #5f6b7a; font-size: 15px; line-height: 1.6; margin-bottom: 24px;">
                Recibimos una solicitud para restablecer la contraseña de tu cuenta. Haz clic en el botón de abajo para crear una nueva contraseña:
              </p>
              
              <div style="text-align: center; margin: 32px 0;">
                <a href="${resetLink}" style="display: inline-block; background: #1a237e; color: #ffffff; text-decoration: none; padding: 14px 32px; border-radius: 8px; font-weight: 600; font-size: 15px;">
                  Restablecer Contraseña
                </a>
              </div>
              
              <p style="color: #9ca3af; font-size: 13px; line-height: 1.5; margin-top: 24px;">
                Este enlace expirará en <strong>1 hora</strong>. Si no solicitaste este cambio, puedes ignorar este email.
              </p>
              
              <hr style="border: none; border-top: 1px solid #e5ebf6; margin: 30px 0;">
              
              <p style="color: #9ca3af; font-size: 12px; text-align: center; margin: 0;">
                © ${new Date().getFullYear()} CV Express. Todos los derechos reservados.
              </p>
            </div>
          </body>
          </html>
        `
      });

      if (error) {
        console.error('❌ Error enviando email de reset:', error);
        return { success: false, error: error.message };
      }

      console.log('✅ Email de reset enviado a:', email, '| ID:', data.id);
      return { success: true, id: data.id };
    } catch (error) {
      console.error('❌ Error en emailService.sendPasswordReset:', error);
      return { success: false, error: error.message };
    }
  },

  // Enviar email de bienvenida (opcional)
  async sendWelcome(email, name) {
    try {
      const { data, error } = await resend.emails.send({
        from: FROM_EMAIL,
        to: email,
        subject: '¡Bienvenido a CV Express! 🎉',
        html: `
          <!DOCTYPE html>
          <html>
          <head>
            <meta charset="utf-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
          </head>
          <body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; background: #f5f8ff; padding: 40px 20px; margin: 0;">
            <div style="max-width: 480px; margin: 0 auto; background: #ffffff; border-radius: 16px; padding: 40px; box-shadow: 0 4px 20px rgba(0,0,0,0.1);">
              <div style="text-align: center; margin-bottom: 30px;">
                <h1 style="color: #1a237e; font-size: 28px; margin: 0;">CV Express</h1>
                <p style="color: #d32f2f; font-size: 12px; letter-spacing: 2px; margin: 5px 0;">ATS READY</p>
              </div>
              
              <h2 style="color: #1a2230; font-size: 20px; margin-bottom: 16px;">¡Bienvenido ${name}!</h2>
              
              <p style="color: #5f6b7a; font-size: 15px; line-height: 1.6; margin-bottom: 24px;">
                Tu cuenta en CV Express ha sido creada exitosamente. Ahora puedes crear tu CV profesional optimizado para sistemas ATS.
              </p>
              
              <div style="text-align: center; margin: 32px 0;">
                <a href="https://cv-express.dpovi.me" style="display: inline-block; background: #1a237e; color: #ffffff; text-decoration: none; padding: 14px 32px; border-radius: 8px; font-weight: 600; font-size: 15px;">
                  Crear mi CV
                </a>
              </div>
              
              <hr style="border: none; border-top: 1px solid #e5ebf6; margin: 30px 0;">
              
              <p style="color: #9ca3af; font-size: 12px; text-align: center; margin: 0;">
                © ${new Date().getFullYear()} CV Express. Todos los derechos reservados.
              </p>
            </div>
          </body>
          </html>
        `
      });

      if (error) {
        console.error('❌ Error enviando email de bienvenida:', error);
        return { success: false, error: error.message };
      }

      console.log('✅ Email de bienvenida enviado a:', email);
      return { success: true, id: data.id };
    } catch (error) {
      console.error('❌ Error en emailService.sendWelcome:', error);
      return { success: false, error: error.message };
    }
  }
};

module.exports = emailService;
