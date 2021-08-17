import Vue from 'vue';
import createSkyEditor from '@packages/sky/editor/index';
import CloudTextEditor from '../components/clouds/text/Editor.vue';
import CloudImageEditor from '../components/clouds/image/Editor.vue';
import ControlPanelContainer from '../components/control-panel/Container.vue';
import initMousetrap from './mousetrap';
import { CLOUD_TYPE } from '../constants';

export const skyEditor = createSkyEditor();

Vue.use(skyEditor, {
  initMousetrap,
  ControlPanelContainer,
  components: {
    [CLOUD_TYPE.text]: CloudTextEditor,
    [CLOUD_TYPE.image]: CloudImageEditor,
  },
  selectoContainer: '.app-main',
});
