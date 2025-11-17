const payments = [];

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
      const { user, amount, songsCount, phone } = req.body;
      
      // Crear registro de pago
      const payment = {
        id: 'PAY_' + Date.now(),
        user,
        amount,
        songsCount,
        phone,
        date: new Date().toISOString(),
        status: 'pending',
        nequiNumber: '3127439018'
      };
      
      payments.push(payment);
      
      res.status(200).json({ 
        success: true, 
        message: 'Pago registrado. Realiza la transferencia a Nequi 3127439018',
        paymentId: payment.id,
        nequiNumber: '3127439018'
      });
    } catch (error) {
      console.error('Error processing payment:', error);
      res.status(500).json({ error: 'Error al procesar el pago' });
    }
  } else if (req.method === 'GET') {
    // Obtener estadísticas de pagos (requiere autenticación)
    const token = req.headers.authorization?.replace('Bearer ', '');
    
    if (!token) {
      return res.status(401).json({ error: 'No autorizado' });
    }
    
    try {
      // Verificar token (simplificado - en producción usar JWT)
      if (token !== process.env.ADMIN_TOKEN) {
        return res.status(401).json({ error: 'Token inválido' });
      }
      
      const completedPayments = payments.filter(p => p.status === 'completed');
      const totalRevenue = completedPayments.reduce((sum, p) => sum + p.amount, 0);
      const totalSongs = completedPayments.reduce((sum, p) => sum + p.songsCount, 0);
      
      res.status(200).json({
        payments: completedPayments,
        summary: {
          totalRevenue,
          totalSongs,
          totalPayments: completedPayments.length
        }
      });
    } catch (error) {
      res.status(500).json({ error: 'Error al obtener estadísticas' });
    }
  } else {
    res.status(405).json({ error: 'Método no permitido' });
  }
};
