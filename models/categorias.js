class Categoria {
    constructor(id, nombre, descripcion, restaurante_id , estado) {
      this.id = id;
      this.nombre = nombre;
      this.descripcion = descripcion;
      this.restaurante_id = restaurante_id;
      this.estado = estado;
    }
  }
  
  module.exports = Categoria;