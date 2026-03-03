require('dotenv').config({ path: require('path').resolve(__dirname, '../../.env') });
const { sequelize } = require('../models');

const reset = async () => {
  try {
    await sequelize.sync({ force: true });
    console.log('[Reset] Database reset successfully');
    process.exit(0);
  } catch (err) {
    console.error('[Reset] Error:', err);
    process.exit(1);
  }
};

reset();
