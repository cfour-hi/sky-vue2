import _Vue from 'vue';
import SvgIcon from './SvgIcon.vue';

// 借助 webpack 在编译时加载 svg 图标
(request => request.keys().map(request))(
  require.context('./icons', false, /\.svg$/),
);

export default function(Vue: typeof _Vue) {
  Vue.component(SvgIcon.name, SvgIcon);
}
