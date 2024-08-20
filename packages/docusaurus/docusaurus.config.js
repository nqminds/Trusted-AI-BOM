const isPublic = process.env.NODE_ENV === 'public';

const config = isPublic ? require('./docusaurus.public.config.js') : require('./docusaurus.project.config.js');

module.exports = config;
