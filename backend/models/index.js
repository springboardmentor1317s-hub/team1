// backend/models/index.js
const sequelize = require('../config/db');
const User = require('./User');
const Event = require('./Event');
const Registration = require('./Registration');
const Feedback = require('./Feedback');
const AdminLog = require('./AdminLog');

// Associations
User.hasMany(Event, { foreignKey: 'college_id', sourceKey: 'id' });
Event.belongsTo(User, { foreignKey: 'college_id', as: 'collegeAdmin' });

User.belongsToMany(Event, {
  through: Registration,
  foreignKey: 'user_id',
  otherKey: 'event_id'
});
Event.belongsToMany(User, {
  through: Registration,
  foreignKey: 'event_id',
  otherKey: 'user_id'
});

Event.hasMany(Feedback, { foreignKey: 'event_id' });
Feedback.belongsTo(Event, { foreignKey: 'event_id' });

User.hasMany(Feedback, { foreignKey: 'user_id' });
Feedback.belongsTo(User, { foreignKey: 'user_id' });

User.hasMany(AdminLog, { foreignKey: 'user_id' });
AdminLog.belongsTo(User, { foreignKey: 'user_id' });

module.exports = {
  sequelize,
  User,
  Event,
  Registration,
  Feedback,
  AdminLog
};
