class Dueño {
    constructor(id, cedula, nombre, apellido, correo, contrasenia, fecha_nacimiento ,planDueño_id, restaurante_id, rol_id, estado) {
      this.id = id;
      this.cedula = cedula;
      this.nombre = nombre;
      this.apellido = apellido;
      this.correo = correo;
      this.contrasenia = contrasenia;
      this.fecha_nacimiento = fecha_nacimiento;
      this.planDueño_id = planDueño_id;
      this.restaurante_id = restaurante_id;
      this.rol_id = rol_id;
      this.estado = estado;
    }
  }
  
  module.exports = Dueño;
  