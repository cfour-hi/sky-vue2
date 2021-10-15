import { CreateSkyOptions } from '@packages/sky/editor/create-sky';
import SkyRenderer from './SkyRenderer.vue';

export default function(Vue: any, options?: CreateSkyOptions) {
  Vue.component(SkyRenderer.name, SkyRenderer);
  Vue.prototype.SkyComponents = options?.components;
}

export let rendererCSSText = '';

// 借助 webpack 在编译时加载的能力
const request = require.context('./styles', false, /\.css$/);
// console.log(request);
// =>
// function webpackContext(req) {
// 	var id = webpackContextResolve(req);
// 	return __webpack_require__(id);
// }

// console.log(request.keys());
// => ['filePath', ...]

request.keys().forEach(key => {
  // console.log(request(key));
  // => loader export
  rendererCSSText += request(key).toString();
});
