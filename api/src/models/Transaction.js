const { DataTypes, UUIDV4 } = require('sequelize');
// Exportamos una funcion que define el modelo
// Luego le injectamos la conexion a sequelize.
module.exports = (sequelize) => {
  // defino el modelo
  sequelize.define('transaction', {
    concept: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    amount:{
      type: DataTypes.STRING,
      allowNull: false,
    },
    date:{
        type: DataTypes.DATEONLY,
        allowNull: false
    },
    type:{
        type:DataTypes.ENUM('ingreso', 'egreso'),
        allowNull: false
    }
  });
};
