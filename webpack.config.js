const env = process.env.NODE_ENV || "development"; // development, production

module.exports = () => {
  console.log(`🛠️  running ${env} Mode using ./webpack.${env}.js 🛠️`);
  return require(`./webpack.${env}.js`);
};
