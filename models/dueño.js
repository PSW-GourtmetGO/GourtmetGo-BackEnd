class Dueño {
    constructor(id, cedula, nombre, apellido, correo, contrasenia, telefono, planDueño_id, direccion, restaurante_id, rol_id, estado) {
      this.id = id;
      this.cedula = cedula;
      this.nombre = nombre;
      this.apellido = apellido;
      this.correo = correo;
      this.contrasenia = contrasenia;
      this.telefono = telefono;
      this.planDueño_id = planDueño_id;
      this.direccion = direccion;
      this.restaurante_id = restaurante_id;
      this.rol_id = rol_id;
      this.estado = estado;
    }
  }
  
  module.exports = Dueño;
  