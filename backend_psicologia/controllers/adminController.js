const Admin = require("../models/admin");

module.exports = {
  async loginAdmin(req, res, next) {
    try {
      const { email, password } = req.body;
      console.log("=== LOGIN ADMIN (LOCAL) ===");

      const admin = await Admin.getByEmail(email);
      
      if (!admin) {
        return res.status(404).json({
          success: false,
          message: "Administrador no encontrado",
        });
      }

      // Comparación directa en texto plano
      const isPasswordValid = (password === admin.password);

      if (!isPasswordValid) {
        return res.status(401).json({
          success: false,
          message: "Contraseña incorrecta",
        });
      }

      console.log("LOGIN EXITOSO");
      return res.status(200).json({
        success: true,
        message: "Inicio de sesión exitoso",
        // Ya no enviamos token
        user: {
          id: admin.id,
          email: admin.email,
          nombre: admin.nombre,
          rol: 'admin'
        }
      });
    } catch (error) {
      console.error(`Error en loginAdmin:`, error);
      return res.status(500).json({
        success: false,
        message: "Error en el servidor",
        error: error.message,
      });
    }
  },

  async registerAdmin(req, res, next) {
    try {
        const admin = req.body;

        if (!admin.email || !admin.password || !admin.nombre) {
            return res.status(400).json({
                success: false,
                message: "Faltan campos requeridos",
            });
        }

        // Guardamos la contraseña tal cual llega
        const data = await Admin.Create({ 
            ...admin, 
            password: admin.password 
        });

        return res.status(201).json({
            success: true,
            message: "Administrador creado con éxito",
            id: data.id,
        });
    } catch (error) {
        console.error(`Error al crear administrador:`, error);
        return res.status(500).json({
            success: false,
            message: "Error al crear el administrador",
            error: error.message,
        });
    }
  },

  async getAllAdmin(req, res, next) {
    try {
      const data = await Admin.getAll();
      return res.status(200).json(data);
    } catch (error) {
      return res.status(500).json({ success: false, message: "Error al obtener datos" });
    }
  }
};