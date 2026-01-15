const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

const apiService = {
  // Autenticar usuario con Google
  async authWithGoogle(userData) {
    try {
      const response = await fetch(`${API_URL}/users/auth`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          googleId: userData.id,
          email: userData.email,
          name: userData.name,
          picture: userData.picture
        })
      });

      if (!response.ok) {
        throw new Error('Error en autenticación');
      }

      return await response.json();
    } catch (error) {
      console.error('API Error - authWithGoogle:', error);
      throw error;
    }
  },

  // Guardar datos del CV
  async saveCVData(userId, cvData) {
    try {
      const response = await fetch(`${API_URL}/users/${userId}/cv`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ cvData })
      });

      if (!response.ok) {
        throw new Error('Error guardando CV');
      }

      return await response.json();
    } catch (error) {
      console.error('API Error - saveCVData:', error);
      throw error;
    }
  },

  // Registrar pago
  async registerPayment(userId, operationNumber, paymentMethod) {
    try {
      const response = await fetch(`${API_URL}/payments`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          userId,
          operationNumber,
          paymentMethod
        })
      });

      if (!response.ok) {
        throw new Error('Error registrando pago');
      }

      return await response.json();
    } catch (error) {
      console.error('API Error - registerPayment:', error);
      throw error;
    }
  },

  // Obtener usuario
  async getUser(userId) {
    try {
      const response = await fetch(`${API_URL}/users/${userId}`);
      
      if (!response.ok) {
        throw new Error('Error obteniendo usuario');
      }

      return await response.json();
    } catch (error) {
      console.error('API Error - getUser:', error);
      throw error;
    }
  }
};

export default apiService;
