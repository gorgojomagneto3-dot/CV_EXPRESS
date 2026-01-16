const express = require('express');
const router = express.Router();
const crypto = require('crypto');
const User = require('../models/User');
const n8nService = require('../services/n8nService');

// POST /api/auth/register - Registrar nuevo usuario con email
router.post('/register', async (req, res) => {
  try {
    const { email, password, name } = req.body;

    // Validaciones
    if (!email || !password || !name) {
      return res.status(400).json({ error: 'Todos los campos son requeridos' });
    }

    if (password.length < 6) {
      return res.status(400).json({ error: 'La contraseña debe tener al menos 6 caracteres' });
    }

    // Verificar si el email ya existe
    const existingUser = await User.findOne({ email: email.toLowerCase() });
    if (existingUser) {
      return res.status(400).json({ error: 'Este email ya está registrado' });
    }

    // Crear usuario
    const user = new User({
      email: email.toLowerCase(),
      password,
      name,
      authProvider: 'email',
      isEmailVerified: false
    });

    await user.save();
    console.log('🆕 Nuevo usuario registrado con email:', email);

    // Notificar a n8n
    await n8nService.notifyLogin({ ...user.toObject(), isNewUser: true });

    res.status(201).json({
      success: true,
      message: 'Usuario registrado exitosamente',
      user: {
        id: user._id,
        email: user.email,
        name: user.name,
        hasPaid: user.hasPaid,
        isPremium: false,
        cvData: null
      }
    });

  } catch (error) {
    console.error('Error en registro:', error);
    res.status(500).json({ error: 'Error en el servidor' });
  }
});

// POST /api/auth/login - Login con email y password
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ error: 'Email y contraseña son requeridos' });
    }

    // Buscar usuario incluyendo password
    const user = await User.findOne({ email: email.toLowerCase() }).select('+password');

    if (!user) {
      return res.status(401).json({ error: 'Email o contraseña incorrectos' });
    }

    // Si el usuario se registró con Google
    if (user.authProvider === 'google' && !user.password) {
      return res.status(400).json({ 
        error: 'Esta cuenta fue creada con Google. Por favor inicia sesión con Google.' 
      });
    }

    // Verificar password
    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.status(401).json({ error: 'Email o contraseña incorrectos' });
    }

    // Actualizar último login
    user.lastLogin = new Date();
    await user.save();

    console.log('👤 Usuario logueado con email:', email);

    // Verificar premium
    const isPremiumActive = user.isPremiumActive ? user.isPremiumActive() : false;
    const daysRemaining = user.getDaysRemaining ? user.getDaysRemaining() : 0;

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
      }
    });

  } catch (error) {
    console.error('Error en login:', error);
    res.status(500).json({ error: 'Error en el servidor' });
  }
});

// POST /api/auth/forgot-password - Solicitar reset de password
router.post('/forgot-password', async (req, res) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({ error: 'Email es requerido' });
    }

    const user = await User.findOne({ email: email.toLowerCase() });

    if (!user) {
      // Por seguridad, no revelar si el email existe o no
      return res.json({ 
        success: true, 
        message: 'Si el email existe, recibirás instrucciones para restablecer tu contraseña' 
      });
    }

    if (user.authProvider === 'google') {
      return res.status(400).json({ 
        error: 'Esta cuenta fue creada con Google. No puedes restablecer la contraseña.' 
      });
    }

    // Generar token
    const resetToken = user.createPasswordResetToken();
    await user.save({ validateBeforeSave: false });

    console.log('🔑 Token de reset generado para:', email);

    // Notificar a n8n para enviar email
    await n8nService.notifyPasswordReset({
      email: user.email,
      name: user.name,
      resetToken: resetToken
    });

    res.json({
      success: true,
      message: 'Se ha enviado un enlace de recuperación a tu email',
      // En desarrollo, incluir el token (quitar en producción)
      ...(process.env.NODE_ENV !== 'production' && { resetToken })
    });

  } catch (error) {
    console.error('Error en forgot-password:', error);
    res.status(500).json({ error: 'Error en el servidor' });
  }
});

// POST /api/auth/reset-password/:token - Restablecer password
router.post('/reset-password/:token', async (req, res) => {
  try {
    const { password } = req.body;
    const { token } = req.params;

    if (!password || password.length < 6) {
      return res.status(400).json({ error: 'La contraseña debe tener al menos 6 caracteres' });
    }

    // Hash del token recibido
    const hashedToken = crypto.createHash('sha256').update(token).digest('hex');

    // Buscar usuario con token válido
    const user = await User.findOne({
      resetPasswordToken: hashedToken,
      resetPasswordExpires: { $gt: Date.now() }
    });

    if (!user) {
      return res.status(400).json({ error: 'Token inválido o expirado' });
    }

    // Actualizar password
    user.password = password;
    user.resetPasswordToken = undefined;
    user.resetPasswordExpires = undefined;
    await user.save();

    console.log('🔐 Contraseña restablecida para:', user.email);

    res.json({
      success: true,
      message: 'Contraseña restablecida exitosamente'
    });

  } catch (error) {
    console.error('Error en reset-password:', error);
    res.status(500).json({ error: 'Error en el servidor' });
  }
});

// POST /api/auth/google - Login/Registro con Google
router.post('/google', async (req, res) => {
  try {
    const { googleId, email, name, picture } = req.body;

    if (!googleId || !email || !name) {
      return res.status(400).json({ error: 'Datos de Google incompletos' });
    }

    let user = await User.findOne({ 
      $or: [{ googleId }, { email: email.toLowerCase() }] 
    });
    
    let isNewUser = false;

    if (user) {
      // Si existe por email pero sin googleId, vincular
      if (!user.googleId) {
        user.googleId = googleId;
        user.authProvider = 'google';
      }
      user.lastLogin = new Date();
      if (picture) user.picture = picture;
      await user.save();
      console.log('👤 Usuario Google logueado:', email);
    } else {
      // Crear nuevo usuario
      user = new User({
        googleId,
        email: email.toLowerCase(),
        name,
        picture,
        authProvider: 'google',
        isEmailVerified: true
      });
      await user.save();
      isNewUser = true;
      console.log('🆕 Nuevo usuario Google registrado:', email);
    }

    // Notificar a n8n
    await n8nService.notifyLogin({ ...user.toObject(), isNewUser });

    // Verificar premium
    const isPremiumActive = user.isPremiumActive ? user.isPremiumActive() : false;
    const daysRemaining = user.getDaysRemaining ? user.getDaysRemaining() : 0;

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
    console.error('Error en auth Google:', error);
    res.status(500).json({ error: 'Error en el servidor' });
  }
});

module.exports = router;
