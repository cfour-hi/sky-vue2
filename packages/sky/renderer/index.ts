import { CreateSkyOptions } from '@packages/sky/editor/create-sky';
import SkyRenderer from './SkyRenderer.vue';

export default function(Vue: any, options?: CreateSkyOptions) {
  Vue.component(SkyRenderer.name, SkyRenderer);
  Vue.prototype.SkyComponents = options?.components;
}
