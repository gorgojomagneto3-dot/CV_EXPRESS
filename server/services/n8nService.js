const axios = require('axios');

// URL del webhook de n8n
const N8N_WEBHOOK_URL = process.env.N8N_WEBHOOK_URL || 'https://n8n.dpovi2458.dev/webhook/pago-cvexpress';

const n8nService = {
  // Notificar nuevo login/registro
  async notifyLogin(user) {
    try {
      const payload = {
        event: 'LOGIN',
        timestamp: new Date().toISOString(),
        data: {
          email: user.email,
          name: user.name,
          isNewUser: user.isNewUser || false
        }
      };

      console.log('📧 Enviando notificación de login a n8n:', payload);
      
      const response = await axios.post(N8N_WEBHOOK_URL, payload, {
        headers: { 'Content-Type': 'application/json' },
        timeout: 10000
      });
      
      console.log('✅ Notificación de login enviada exitosamente');
      return { success: true, data: response.data };
    } catch (error) {
      console.error('❌ Error enviando notificación de login:', error.message);
      return { success: false, error: error.message };
    }
  },

  // Notificar nuevo pago
  async notifyPayment(payment, user) {
    try {
      const payload = {
        event: 'PAGO',
        timestamp: new Date().toISOString(),
        data: {
          operationNumber: payment.operationNumber,
          method: payment.paymentMethod,
          amount: payment.amount,
          email: user.email,
          name: user.name
        }
      };

      console.log('💰 Enviando notificación de pago a n8n:', payload);
      
      const response = await axios.post(N8N_WEBHOOK_URL, payload, {
        headers: { 'Content-Type': 'application/json' },
        timeout: 10000
      });
      
      console.log('✅ Notificación de pago enviada exitosamente');
      return { success: true, data: response.data };
    } catch (error) {
      console.error('❌ Error enviando notificación de pago:', error.message);
      return { success: false, error: error.message };
    }
  }
};

module.exports = n8nService;
