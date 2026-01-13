// server/database/models/index.js
const User = require('./User');
const Book = require('./Book');

// Associations
User.hasMany(Book, { foreignKey: 'userId' });
Book.belongsTo(User, { foreignKey: 'userId' });

module.exports = { User, Book };