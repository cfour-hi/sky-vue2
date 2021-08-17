import _Vue from 'vue';
import createSky, { Sky, CreateSkyOptions } from './create-sky';
import CompSkyEditor from './SkyEditor.vue';
import CompSkyRenderer from '../renderer/index';

interface SkyEditor {
  sky: Sky;
  install(Vue: typeof _Vue, options: CreateSkyOptions): void;
}

const createSkyEditor = () => {
  const module = ({ sky: null } as unknown) as SkyEditor;

  module.install = (Vue, options) => {
    module.sky = createSky(options);
    Vue.prototype.$sky = module.sky;

    Vue.mixin({
      data() {
        return { skyState: module.sky.state };
      },
    });

    Vue.component(CompSkyEditor.name, CompSkyEditor);
    Vue.use(CompSkyRenderer, options);

    if (options.ControlPanelContainer) {
      Vue.component(
        options.ControlPanelContainer.name,
        options.ControlPanelContainer,
      );
    }
  };

  return module;
};

export default createSkyEditor;
