import Vue from 'vue';
import VueCompositionAPI from '@vue/composition-api';
import svgIcon from '@/components/svg-icon/index';
import skyUI from '@packages/sky-ui/main';
import { SlatePlugin } from 'slate-vue';

Vue.use(skyUI);
Vue.use(svgIcon);
Vue.use(VueCompositionAPI);
Vue.use(SlatePlugin);
