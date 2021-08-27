const { name } = require('../package.json');

const pluginId = name.replace(/^strapi-plugin-/i, '');

module.exports = {
  pluginId,
};
