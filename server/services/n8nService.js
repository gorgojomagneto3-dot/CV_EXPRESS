const axios = require('axios');

// URL del webhook de n8n
const N8N_WEBHOOK_URL = process.env.N8N_WEBHOOK_URL || 'https://n8n.dpovi2458.dev/webhook/pago-cvexpress';

console.log('🔗 n8n Webhook URL configurada:', N8N_WEBHOOK_URL);

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

      console.log('📧 Enviando notificación de login a n8n:', JSON.stringify(payload));
      console.log('📧 URL:', N8N_WEBHOOK_URL);
      
      const response = await axios.post(N8N_WEBHOOK_URL, payload, {
        headers: { 'Content-Type': 'application/json' },
        timeout: 15000
      });
      
      console.log('✅ Notificación de login enviada exitosamente. Status:', response.status);
      return { success: true, data: response.data };
    } catch (error) {
      console.error('❌ Error enviando notificación de login:', error.message);
      if (error.response) {
        console.error('❌ Response status:', error.response.status);
        console.error('❌ Response data:', error.response.data);
      }
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

      console.log('💰 ========== ENVIANDO NOTIFICACIÓN DE PAGO ==========');
      console.log('💰 URL:', N8N_WEBHOOK_URL);
      console.log('💰 Payload:', JSON.stringify(payload, null, 2));
      
      const response = await axios.post(N8N_WEBHOOK_URL, payload, {
        headers: { 'Content-Type': 'application/json' },
        timeout: 15000
      });
      
      console.log('✅ Notificación de pago enviada exitosamente');
      console.log('✅ Status:', response.status);
      console.log('✅ Response:', JSON.stringify(response.data));
      return { success: true, data: response.data };
    } catch (error) {
      console.error('❌ ========== ERROR ENVIANDO NOTIFICACIÓN ==========');
      console.error('❌ Error:', error.message);
      if (error.response) {
        console.error('❌ Response status:', error.response.status);
        console.error('❌ Response data:', JSON.stringify(error.response.data));
      }
      if (error.code) {
        console.error('❌ Error code:', error.code);
      }
      return { success: false, error: error.message };
    }
  }
};

module.exports = n8nService;
