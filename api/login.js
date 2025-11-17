const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

module.exports = async (req, res) => {
  // Habilitar CORS
  res.setHeader('Access-Control-Allow-Credentials', true);
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
  res.setHeader('Access-Control-Allow-Headers', 'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version');
  
  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  if (req.method === 'POST') {
    try {
      const { username, password } = req.body;
      
      // Verificar credenciales (en producción usar base de datos)
      const validUser = process.env.ADMIN_USER || 'admin';
      const validPassword = process.env.ADMIN_PASSWORD || 'admin123';
      
      if (username === validUser && password === validPassword) {
        // Crear token JWT
        const token = jwt.sign(
          { username, role: 'admin' },
          process.env.JWT_SECRET || 'secret-key',
          { expiresIn: '24h' }
        );
        
        res.status(200).json({
          success: true,
          message: 'Login exitoso',
          token,
          user: { username, role: 'admin' }
        });
      } else {
        res.status(401).json({
          success: false,
          error: 'Usuario o contraseña incorrectos'
        });
      }
    } catch (error) {
      console.error('Login error:', error);
      res.status(500).json({ error: 'Error en el servidor' });
    }
  } else {
    res.status(405).json({ error: 'Método no permitido' });
  }
};
