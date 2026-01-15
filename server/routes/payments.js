const express = require('express');
const router = express.Router();
const Payment = require('../models/Payment');
const User = require('../models/User');
const n8nService = require('../services/n8nService');

// POST /api/payments - Registrar nuevo pago
router.post('/', async (req, res) => {
  try {
    const { userId, operationNumber, paymentMethod } = req.body;

    if (!userId || !operationNumber || !paymentMethod) {
      return res.status(400).json({ error: 'Datos incompletos' });
    }

    // Obtener usuario
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ error: 'Usuario no encontrado' });
    }

    // Verificar si ya tiene un pago activo
    if (user.hasPaid) {
      return res.json({ 
        success: true, 
        message: 'Usuario ya tiene acceso al PDF',
        alreadyPaid: true 
      });
    }

    // Crear registro de pago
    const payment = new Payment({
      userId: user._id,
      userEmail: user.email,
      userName: user.name,
      operationNumber,
      paymentMethod,
      amount: 0.50,
      status: 'pending'
    });
    await payment.save();

    // Calcular fecha de expiración (7 días desde ahora)
    const now = new Date();
    const expiresAt = new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000);

    // Actualizar usuario como pagado y premium
    user.hasPaid = true;
    user.isPremium = true;
    user.paymentDate = now;
    user.premiumExpiresAt = expiresAt;
    user.paymentId = payment._id;
    await user.save();

    console.log('💳 Pago registrado:', {
      user: user.email,
      operation: operationNumber,
      method: paymentMethod,
      premiumExpiresAt: expiresAt
    });

    // Enviar notificación a n8n
    await n8nService.notifyPayment(payment, user);

    res.json({
      success: true,
      message: 'Pago registrado correctamente',
      payment: {
        id: payment._id,
        operationNumber: payment.operationNumber,
        status: payment.status
      }
    });

  } catch (error) {
    console.error('Error registrando pago:', error);
    res.status(500).json({ error: 'Error en el servidor' });
  }
});

// GET /api/payments/user/:userId - Obtener pagos de un usuario
router.get('/user/:userId', async (req, res) => {
  try {
    const payments = await Payment.find({ userId: req.params.userId });
    res.json(payments);
  } catch (error) {
    console.error('Error obteniendo pagos:', error);
    res.status(500).json({ error: 'Error en el servidor' });
  }
});

// PUT /api/payments/:id/verify - Verificar pago (admin)
router.put('/:id/verify', async (req, res) => {
  try {
    const { status } = req.body; // 'verified' o 'rejected'
    
    const payment = await Payment.findByIdAndUpdate(
      req.params.id,
      { 
        status,
        verifiedAt: status === 'verified' ? new Date() : null
      },
      { new: true }
    );

    if (!payment) {
      return res.status(404).json({ error: 'Pago no encontrado' });
    }

    // Si se rechaza, quitar acceso al usuario
    if (status === 'rejected') {
      await User.findByIdAndUpdate(payment.userId, { hasPaid: false });
    }

    console.log(`✅ Pago ${status}:`, payment.operationNumber);
    res.json({ success: true, payment });

  } catch (error) {
    console.error('Error verificando pago:', error);
    res.status(500).json({ error: 'Error en el servidor' });
  }
});

// GET /api/payments - Listar todos los pagos (admin)
router.get('/', async (req, res) => {
  try {
    const payments = await Payment.find()
      .sort({ createdAt: -1 })
      .limit(100);
    res.json(payments);
  } catch (error) {
    console.error('Error listando pagos:', error);
    res.status(500).json({ error: 'Error en el servidor' });
  }
});

module.exports = router;
