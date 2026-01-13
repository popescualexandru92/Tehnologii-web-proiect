const { sequelize } = require('../server');
const { DataTypes } = require('sequelize');

const Book=sequelize.define('Book',{
    id:{
        type: DataTypes.INTEGER,
        primaryKey:true,
        autoIncrement:true,
    },
    url:{
        type: DataTypes.STRING,
        allowNull:alse
    },
    title:{
        type: DataTypes.STRING,
        allowNull:false
    },
    author:{
        type:DataTypes.STRING,
        allowNull:false
    },
    price:{
        type: DataTypes.DOUBLE,
        allowNull:false
    },
    image:{
        type:DataTypes.STRING,
        allowNull: false,
    },
    userId:{
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: 'users',
            key: 'id'
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE'
    }
}, {
    tableName: 'books',
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at',
});

module.exports = Book;