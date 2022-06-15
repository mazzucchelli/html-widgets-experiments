// const env = process.env.NODE_ENV;

module.exports = (env) => {
    console.log(`🛠️  running dev Mode using ./webpack.dev.js 🛠️`);
    return require(`./webpack.dev.js`);
    // console.log(`🛠️  running ${env} Mode using ./webpack.${env}.js 🛠️`);
    // return require(`./webpack.${env}.js`);
  };
