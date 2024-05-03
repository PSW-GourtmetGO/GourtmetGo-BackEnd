class Empleado {
    constructor(id, cedula, nombre, apellido, correo, contrasenia, telefono, direccion, rol_id, restaurante_id, estado) {
      this.id = id;
      this.cedula = cedula;
      this.nombre = nombre;
      this.apellido = apellido;
      this.correo = correo;
      this.contrasenia = contrasenia;
      this.telefono = telefono;
      this.direccion = direccion;
      this.rol_id = rol_id;
      this.restaurante_id = restaurante_id;
      this.estado = estado;
    }
  }
  
  module.exports = Empleado;