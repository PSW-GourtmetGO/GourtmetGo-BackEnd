const conexionBD = require('../config/db')

exports.activarPlan = async (request, response) => {
    try {
      const { plan_id , fecha_inicio ,fecha_fin,id_propietario} = request.body;
      const query = 'INSERT INTO plandueño VALUES(0,?,?,?,1)';
      conexionBD.query(query, [plan_id , fecha_inicio ,fecha_fin], (err, results) => {
        if (err) {
            console.log(err);
            response.status(500).send('ERROR DURANTE EL PROCEDIMIENTO: ACTIVAR PLAN');
        }
        else {
            const id_plan_activado = results.insertId;
            const updateQuery = 'UPDATE dueños SET planDueño_id = ? WHERE id= ?';
            conexionBD.query(updateQuery, [id_plan_activado,id_propietario], (err, results) => {
              if (err) {
                  console.log(err);
                  response.status(500).send('ERROR DURANTE EL PROCEDIMIENTO: ACTIVAR PLAN');
              }
              else {
                  response.status(200).send('PLAN ACTIVADO');
              }
            });
        }
      });
    } catch (error) {
      console.log(error);
      response.status(500).send('ERROR DURANTE EL PROCEDIMIENTO: ACTIVAR PLAN');
    }
  };