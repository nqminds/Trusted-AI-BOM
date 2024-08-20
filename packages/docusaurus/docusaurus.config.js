const isPublic = process.env.NODE_ENV === 'public';
console.log("is public", isPublic)

const config = isPublic ? require('./docusaurus.public.config.js') : require('./docusaurus.project.config.js');

module.exports = config;
