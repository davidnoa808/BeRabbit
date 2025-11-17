const Bolt = require('@boltcom/bolt-api');

const bolt = new Bolt({
  publicKey: process.env.BOLT_PUBLIC_KEY,
  privateKey: process.env.BOLT_PRIVATE_KEY,
});

module.exports = async (req, res) => {
  if (req.method === 'POST') {
    try {
      const { amount, currency = 'COP' } = req.body;

      // Crear un pago con Bolt
      const payment = await bolt.createPayment({
        amount: amount * 100, // Convertir a centavos
        currency,
        source: 'nequi', // O el método de pago que prefieras
        description: 'Pago por suscripción DJ Playlist',
      });

      res.status(200).json({ success: true, payment });
    } catch (error) {
      console.error('Error creating Bolt payment:', error);
      res.status(500).json({ error: 'Error al crear el pago' });
    }
  } else {
    res.status(405).json({ error: 'Método no permitido' });
  }
};
