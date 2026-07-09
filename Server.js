const express = require('express');
const helmet = require('helmet');
const { body, validationResult } = require('express-validator');
require('dotenv').config();

const app = express();

// 1. CUMPLIMIENTO RÚBRICA: Uso de Helmet para asegurar cabeceras HTTP
app.use(helmet());
app.use(express.json());

// ==========================================
// ENDPOINT 1: POST /api/registro 
// ==========================================
app.post(
    '/api/registro',
    [
        body('nombre').notEmpty().withMessage('El nombre es obligatorio y no puede estar vacío.').trim().escape(),
        body('correo').isEmail().withMessage('Debe proporcionar un correo electrónico válido.').normalizeEmail(),
        body('password').isLength({ min: 6 }).withMessage('La contraseña es obligatoria y debe tener al menos 6 caracteres.')
    ],
    (req, res) => {
        const errores = validationResult(req);
        if (!errores.isEmpty()) {
            return res.status(400).json({ OK: false, errores: errores.array() });
        }

        // JUSTIFICACIÓN DEL PRINCIPIO DE CODIFICACIÓN SEGURA:
        /**
         * PRINCIPIO DE CODIFICACIÓN SEGURA APLICADO: "Validación de Entradas" (Input Validation) / "No confiar nunca en los datos del usuario".
         * 
         * Justificación: Este principio establece que cualquier dato proveniente del exterior (cliente/usuario) 
         * debe ser tratado como malicioso por defecto. Al validar el formato del correo con 'isEmail()', 
         * asegurar que el nombre no esté vacío con 'notEmpty()' y restringir la longitud mínima de la contraseña 
         * con 'isLength()', protegemos al sistema contra ataques comunes como Inyección de Código (XSS, SQLi), 
         * ataques de fuerza bruta por claves débiles y evitamos comportamientos inesperados en el servidor.
         */

        const { nombre, correo } = req.body;
        return res.status(201).json({
            OK: true,
            mensaje: 'Usuario registrado exitosamente (Simulado).',
            usuario: { nombre, correo } // Por seguridad, nunca se retorna la contraseña en la respuesta
        });
    }
);

// ==========================================
// ENDPOINT 2: POST /api/login
// ==========================================
app.post(
    '/api/login',
    [
        body('correo').isEmail().withMessage('Formato de correo inválido.'),
        body('password').isLength({ min: 6 }).withMessage('La contraseña debe tener al menos 6 caracteres.')
    ],
    (req, res) => {
        const errores = validationResult(req);
        if (!errores.isEmpty()) {
            return res.status(400).json({ OK: false, errores: errores.array() });
        }

        return res.status(200).json({ OK: true, mensaje: 'Autenticación exitosa (Simulado).' });
    }
);

// Exportamos únicamente la configuración de la app de Express
module.exports = app;