// Esta función se llamará cuando Bolt notifique un pago
module.exports = async (req, res) => {
  if (req.method === 'POST') {
    const { event, data } = req.body;

    if (event === 'payment.completed') {
      // Actualizar la base de datos o realizar acciones necesarias
      console.log('Pago completado:', data);
    }

    res.status(200).json({ received: true });
  } else {
    res.status(405).json({ error: 'Método no permitido' });
  }
};
