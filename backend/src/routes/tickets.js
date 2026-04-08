import express from 'express';
import nodemailer from 'nodemailer';
import dotenv from 'dotenv';

dotenv.config();

const router = express.Router();

/**
 * Configurar transportador de email (usando Gmail, SendGrid, etc.)
 * Para usar: 
 * - Gmail: Habilita contraseña de app en cuenta Google
 * - SendGrid: Usa tu API key
 * - Mailtrap: Para desarrollo
 */
const transporter = nodemailer.createTransport({
  service: process.env.EMAIL_SERVICE || 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASSWORD
  },
  // Alternativa con SendGrid:
  // host: 'smtp.sendgrid.net',
  // port: 587,
  // auth: {
  //   user: 'apikey',
  //   pass: process.env.SENDGRID_API_KEY
  // }
});

/**
 * Validar que el email esté conectado
 */
transporter.verify((error, success) => {
  if (error) {
    console.error('⚠️ Error en configuración de email:', error);
  } else {
    console.log('✅ Servidor de email configurado correctamente');
  }
});

/**
 * POST /api/tickets/send
 * Envía el ticket por email y WhatsApp
 */
router.post('/send', async (req, res) => {
  try {
    const { order, ticketHTML, userEmail, userPhone } = req.body;

    if (!userEmail && !userPhone) {
      return res.status(400).json({
        error: 'Se necesita al menos un correo o número de WhatsApp',
        success: false
      });
    }

    const results = {
      emailSent: false,
      whatsappSent: false,
      errors: []
    };

    // 📧 Enviar por Email
    if (userEmail) {
      try {
        await transporter.sendMail({
          from: process.env.EMAIL_USER || 'noreply@oneoone.app',
          to: userEmail,
          subject: `🎭 Tu Ticket del Pedido #${order.numero} - One To One`,
          html: `
            <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
              <div style="background: linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%); padding: 20px; border-radius: 10px; text-align: center;">
                <h1 style="color: white; margin: 0;">🎭 Tu Ticket está listo</h1>
              </div>
              
              <div style="padding: 20px; background: #f9fafb;">
                <p style="color: #374151; font-size: 16px;">¡Hola! Tu pedido #<strong>${order.numero}</strong> ha sido procesado.</p>
                
                <div style="background: white; padding: 20px; border-radius: 10px; margin: 20px 0; border: 2px solid #e5e7eb;">
                  <h2 style="color: #047857; margin-top: 0;">Resumen</h2>
                  <div>
                    ${order.items.map(item => `
                      <div style="display: flex; justify-content: space-between; padding: 8px 0; border-bottom: 1px solid #f3f4f6;">
                        <span>${item.cantidad}x ${item.nombre}</span>
                        <strong>$${item.precio?.toFixed(2) || '0.00'}</strong>
                      </div>
                    `).join('')}
                  </div>
                  <div style="display: flex; justify-content: space-between; padding: 12px 0; margin-top: 12px; border-top: 2px solid #f3f4f6; font-size: 18px; font-weight: bold; color: #f97316;">
                    <span>Total:</span>
                    <span>$${order.total?.toFixed(2) || '0.00'}</span>
                  </div>
                </div>

                <div style="background: #fef3c7; padding: 15px; border-radius: 10px; border-left: 4px solid #f59e0b; margin: 20px 0;">
                  <p style="margin: 0; color: #92400e;"><strong>💡 Consejo:</strong> Guarda este email. Contiene tu ticket completamente funcional que puedes imprimir o compartir.</p>
                </div>

                <div style="text-align: center; padding: 20px 0; border-top: 2px solid #e5e7eb;">
                  <p style="color: #6b7280; font-size: 14px; margin: 10px 0;">
                    🔱 One To One - El Arte de Servir
                  </p>
                  <p style="color: #9ca3af; font-size: 12px;">
                    Este es un ticket del sistema. Si tienes dudas, contáctanos.
                  </p>
                </div>
              </div>

              <!-- ADJUNTAR EL TICKET COMPLETO COMO PDF/HTML -->
              <div style="display: none;">
                ${ticketHTML}
              </div>
            </div>
          `,
          // Descomentar cuando tengas html2pdf instalado para adjuntar PDF
          // attachments: [{
          //   filename: `ticket_${order.numero}.pdf`,
          //   content: ticketHTML,
          //   contentType: 'application/pdf'
          // }]
        });

        results.emailSent = true;
        console.log(`✅ Email enviado a ${userEmail}`);
      } catch (emailError) {
        console.error('Error enviando email:', emailError);
        results.errors.push(`Email: ${emailError.message}`);
      }
    }

    // 📱 Enviar por WhatsApp (usando Twilio)
    if (userPhone) {
      try {
        // Requisito: instalar 'twilio'
        // npm install twilio
        const twilio = require('twilio');
        const client = twilio(
          process.env.TWILIO_ACCOUNT_SID,
          process.env.TWILIO_AUTH_TOKEN
        );

        const phoneFormatted = userPhone.startsWith('+') ? userPhone : `+${userPhone}`;

        await client.messages.create({
          body: `🎭 Tu pedido #${order.numero} está listo!\nTotal: $${order.total?.toFixed(2)}\n\n🔱 One To One\nGuarda tu ticket para referencia.`,
          from: process.env.TWILIO_PHONE_NUMBER,
          to: phoneFormatted
        });

        results.whatsappSent = true;
        console.log(`✅ WhatsApp enviado a ${phoneFormatted}`);
      } catch (whatsappError) {
        console.error('Error enviando WhatsApp:', whatsappError);
        results.errors.push(`WhatsApp: Funcionalidad no configurada o error en envío`);
        // No fallar totalmente si WhatsApp no funciona
      }
    }

    res.json({
      ...results,
      success: results.emailSent || results.whatsappSent,
      message: `Ticket enviado correctamente${results.errors.length ? ' (con algunas limitaciones)' : ''}`,
      order: {
        numero: order.numero,
        total: order.total
      }
    });

  } catch (error) {
    console.error('Error en /send:', error);
    res.status(500).json({
      error: error.message,
      success: false
    });
  }
});

/**
 * GET /api/tickets/test
 * Probar conexión de email
 */
router.get('/test', async (req, res) => {
  try {
    await transporter.verify();
    res.json({
      status: 'Email service is ready',
      configured: !!process.env.EMAIL_USER
    });
  } catch (error) {
    res.status(500).json({
      error: error.message,
      configured: false
    });
  }
});

export default router;
