const conexionBD = require('../config/db')

exports.obtenerPedidos = async (request, response) => {
    try {
      const { restaurante } = request.params;
      const query = "SELECT p.id pID,p.codigo pCODIGO,p.precio_total pTOTAL, p.estado pESTADO, CONCAT(c.nombre, ' ', c.apellido) cCLIENTE FROM pedidos p,clientes c WHERE p.restaurante_id = ? AND NOT p.estado = 'Completo' AND c.id =p.cliente_id AND NOT p.estado = 'Carrito';"
      conexionBD.query(query, [restaurante], (err, pedidos) => {
        if (err) {
            console.log(err);
            response.status(500).send('ERROR DURANTE EL PROCEDIMIENTO: OBTENER PEDIDOS');
            return;
        }else {
            response.json(pedidos);
        }
      });
    } catch (error) {
      console.log(error);
      response.status(500).send('ERROR DURANTE EL PROCEDIMIENTO: OBTENER PEDIDOS');
    }
  };
  exports.obtenerPedidosCodigo = async (request, response) => {
    try {
      const { restaurante,codigo } = request.query;
      const query = "SELECT p.id pID,p.codigo pCODIGO,p.precio_total pTOTAL, p.estado pESTADO, CONCAT(c.nombre, ' ', c.apellido) cCLIENTE FROM pedidos p,clientes c WHERE p.restaurante_id = ? AND NOT p.estado = 'Completo' AND c.id =p.cliente_id AND p.codigo LIKE ? AND NOT p.estado = 'Carrito'"
      const codigoParam = `%${codigo}%`;
      conexionBD.query(query, [restaurante,codigoParam], (err, pedidos) => {
        if (err) {
            console.log(err);
            response.status(500).send('ERROR DURANTE EL PROCEDIMIENTO: OBTENER PEDIDOS');
            return;
        }else {
            response.json(pedidos);
        }
      });
    } catch (error) {
      console.log(error);
      response.status(500).send('ERROR DURANTE EL PROCEDIMIENTO: OBTENER PEDIDOS');
    }
  };
  exports.obtenerDetallePedidos = async (request, response) => {
    try {
      const { pedido } = request.params;
      const query = "SELECT plt.nombre pltNOMBRE,pd.cantidad pdCANTIDAD, pd.precio pdPRECIO FROM pedidos p , pedidodetalle pd, platos plt WHERE p.id = pd.pedido_id AND pd.plato_id=plt.id AND p.id = ? ;"
      conexionBD.query(query, [pedido], (err, pedidos) => {
        if (err) {
            console.log(err);
            response.status(500).send('ERROR DURANTE EL PROCEDIMIENTO: OBTENER DETALLE PEDIDOS');
            return;
        }
        if (pedidos.length === 0) {
            response.status(404).send('NO EXISTEN DETALLE PEDIDOS');
        } else {
            response.json(pedidos);
        }
      });
    } catch (error) {
      console.log(error);
      response.status(500).send('ERROR DURANTE EL PROCEDIMIENTO: OBTENER PEDIDOS');
    }
  };

  exports.obtenerPedidosFiltro = async (request, response) => {
    try {
      const { restaurante,filtro } = request.query;
      const query = "SELECT p.id pID,p.codigo pCODIGO,p.precio_total pTOTAL, p.estado pESTADO, CONCAT(c.nombre, ' ', c.apellido) cCLIENTE FROM pedidos p,clientes c WHERE p.restaurante_id = ? AND c.id =p.cliente_id AND p.estado = ?;"
      conexionBD.query(query, [restaurante,filtro], (err, pedidos) => {
        if (err) {
            console.log(err);
            response.status(500).send('ERROR DURANTE EL PROCEDIMIENTO: OBTENER PEDIDOS');
            return;
        }else {
            response.json(pedidos);
        }
      });
    } catch (error) {
      console.log(error);
      response.status(500).send('ERROR DURANTE EL PROCEDIMIENTO: OBTENER PEDIDOS');
    }
  };

  exports.actualizarEstadoPedido = async (request, response) => {
    try {
      const { id,estado } = request.query;
      const query = "UPDATE pedidos SET ESTADO = ? WHERE id=?"
      conexionBD.query(query, [estado,id], (err, pedidos) => {
        if (err) {
            console.log(err);
            response.status(500).send('ERROR DURANTE EL PROCEDIMIENTO: OBTENER PEDIDOS');
            return;
        }else {
            response.json(pedidos);
        }
      });
    } catch (error) {
      console.log(error);
      response.status(500).send('ERROR DURANTE EL PROCEDIMIENTO: OBTENER PEDIDOS');
    }
  };