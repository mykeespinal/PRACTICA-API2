const express = require('express');
const router = express.Router();
const { param, validationResult } = require('express-validator');
const { obtenerClima } = require('../services/clima');

function validar(req, res, next) {
  const errores = validationResult(req);
  if (!errores.isEmpty()) return res.status(400).json({ errores: errores.array() });
  next();
}

// GET /api/clima/:ciudad — obtiene el clima de una ciudad independiente de las tareas
router.get(
  '/:ciudad',
  param('ciudad').isString().trim().notEmpty().withMessage('La ciudad es requerida y debe ser texto válido'),
  validar,
  async (req, res) => {
    try {
      const clima = await obtenerClima(req.params.ciudad);
      res.status(200).json(clima);
    } catch (error) {
      res.status(502).json({ error: error.message });
    }
  }
);

module.exports = router;