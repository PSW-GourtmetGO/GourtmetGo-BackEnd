class Plato {
    constructor(id, nombre,precio, descripcion,imagen,categoria_id,estado,eliminado) {
      this.id = id;
      this.nombre = nombre;
      this.precio= precio;
      this.descripcion = descripcion
      this.imagen = imagen;
      this.categoria_id = categoria_id;
      this.estado = estado;
      this.eliminado = eliminado;
    }
  }
  
  module.exports = Plato;