const express = require('express');
const router = express.Router();
const User = require('../models/User');
const n8nService = require('../services/n8nService');

// POST /api/users/auth - Autenticar/Registrar usuario con Google o Email
router.post('/auth', async (req, res) => {
  try {
    const { googleId, email, name, picture } = req.body;

    if (!email || !name) {
      return res.status(400).json({ error: 'Email y nombre son requeridos' });
    }

    // Buscar usuario existente por googleId o email
    let user = googleId 
      ? await User.findOne({ googleId })
      : await User.findOne({ email, googleId: { $exists: false } });
    
    let isNewUser = false;

    if (user) {
      // Usuario existente - actualizar último login
      user.lastLogin = new Date();
      if (picture && !user.picture) user.picture = picture;
      await user.save();
      console.log('👤 Usuario existente logueado:', email);
    } else {
      // Nuevo usuario - crear
      user = new User({
        googleId: googleId || `email_${Date.now()}`,
        email,
        name,
        picture: picture || null
      });
      await user.save();
      isNewUser = true;
      console.log('🆕 Nuevo usuario registrado:', email);
    }

    // Enviar notificación a n8n
    await n8nService.notifyLogin({ ...user.toObject(), isNewUser });

    // Verificar si el premium sigue activo
    const isPremiumActive = user.isPremiumActive ? user.isPremiumActive() : false;
    const daysRemaining = user.getDaysRemaining ? user.getDaysRemaining() : 0;

    // Si el premium expiró, actualizar el estado
    if (user.isPremium && !isPremiumActive) {
      user.isPremium = false;
      user.hasPaid = false;
      await user.save();
    }

    res.json({
      success: true,
      user: {
        id: user._id,
        email: user.email,
        name: user.name,
        picture: user.picture,
        hasPaid: user.hasPaid,
        isPremium: isPremiumActive,
        premiumExpiresAt: user.premiumExpiresAt,
        daysRemaining: daysRemaining,
        cvData: user.cvData
      },
      isNewUser
    });

  } catch (error) {
    console.error('Error en autenticación:', error);
    res.status(500).json({ error: 'Error en el servidor' });
  }
});

// GET /api/users/:id - Obtener usuario por ID
router.get('/:id', async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) {
      return res.status(404).json({ error: 'Usuario no encontrado' });
    }
    res.json(user);
  } catch (error) {
    console.error('Error obteniendo usuario:', error);
    res.status(500).json({ error: 'Error en el servidor' });
  }
});

// PUT /api/users/:id/cv - Guardar datos del CV
router.put('/:id/cv', async (req, res) => {
  try {
    const { cvData } = req.body;
    
    const user = await User.findByIdAndUpdate(
      req.params.id,
      { cvData },
      { new: true }
    );

    if (!user) {
      return res.status(404).json({ error: 'Usuario no encontrado' });
    }

    console.log('💾 CV guardado para:', user.email);
    res.json({ success: true, message: 'CV guardado' });

  } catch (error) {
    console.error('Error guardando CV:', error);
    res.status(500).json({ error: 'Error en el servidor' });
  }
});

module.exports = router;
