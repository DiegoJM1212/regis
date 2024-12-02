const express = require('express');
const sql = require('mssql');


const app = express();
const PORT = process.env.PORT;  

const config = {
  user: 'diego', 
  password: 'Paramore.1997', 
  server: 'diegojm.database.windows.net',  
  database: 'kawaipet', 
  options: {
    encrypt: true, 
    trustServerCertificate: false, 
  },
};

app.use(express.json());

app.get('/registro-civil/:cedula', async (req, res) => {
    let cedula = req.params.cedula.trim(); 

  console.log('Buscando cédula:', cedula); 
  try {
    await sql.connect(config);

    const result = await sql.query`SELECT * FROM registro_civil WHERE cedula = ${cedula}`;

    console.log('Resultado de la consulta:', result.recordset);

    
    if (result.recordset.length === 0) {
      console.log('No se encontraron resultados para la cédula:', cedula);
      return res.status(404).json({ message: 'Cédula no encontrada' });
    }

    
    const { nombre, telefono, fecha_nacimiento } = result.recordset[0];

    
    return res.json({ nombre, telefono, fecha_nacimiento });
  } catch (err) {
    console.error('Error al acceder a la base de datos:', err);
    res.status(500).json({ message: 'Error al acceder a la base de datos' });
  } finally {
    
    await sql.close();
  }
});


app.listen(PORT, () => {
    console.log(`API escuchando en el puerto ${PORT}`);
});
