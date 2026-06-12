const User = require("../models/user");

module.exports = {
  async register(req, res, next) {
    try {
      const user = req.body;
      console.log("=== REGISTRO DE USUARIO (LOCAL) ===");

      if (!user.email || !user.password) {
        return res.status(400).json({
          success: false,
          message: "Faltan campos requeridos: email y password",
        });
      }

      const userData = {
        ...user,
        fecha_registro: user.fecha_registro || new Date(),
        password: user.password, // Texto plano
        rol: user.rol || 'usuario'
      };

      const data = await User.Create(userData);

      return res.status(201).json({
        success: true,
        message: "Usuario creado con éxito",
        no_control: data.no_control,
      });
    } catch (error) {
      return res.status(500).json({ success: false, message: "Error al crear usuario", error: error.message });
    }
  },

  async login(req, res, next) {
    try {
      const { email, password } = req.body;

      const user = await User.getByEmail(email);
      if (!user) {
        return res.status(404).json({ success: false, message: "Usuario no encontrado" });
      }

      const isPasswordValid = (password === user.password);

      if (!isPasswordValid) {
        return res.status(401).json({ success: false, message: "Contraseña incorrecta" });
      }

      return res.status(200).json({
        success: true,
        message: "Inicio de sesión exitoso",
        user: {
          id: user.no_control,
          email: user.email,
          rol: user.rol
        }
      });
    } catch (error) {
      return res.status(500).json({ success: false, message: "Error al iniciar sesión" });
    }
  },

  async getAll(req, res, next) {
    try {
      const data = await User.getAll();
      return res.status(200).json(data);
    } catch (error) {
      return res.status(500).json({ success: false, message: "Error al obtener usuarios" });
    }
  }
};