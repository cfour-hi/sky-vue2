/* eslint-disable @typescript-eslint/no-var-requires */
const loaderUtils = require('loader-utils');
const vueStyleLoader = require('vue-style-loader');

/**
 * @see https://webpack.github.io/docs/loaders.html#pitching-loader
//  */
module.exports.pitch = function(remainingRequest) {
  const request = loaderUtils.stringifyRequest(this, '!!' + remainingRequest);
  const result = vueStyleLoader.pitch.call(this, remainingRequest);
  return `${result}\nmodule.exports=require(${request})`;
};
