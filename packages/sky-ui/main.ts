import _Vue from 'vue';
import SkyButton from './SkyButton.vue';
import SkyInput from './SkyInput.vue';
import SkyInputNumber from './SkyInputNumber.vue';
import SkySelect from './SkySelect.vue';
import SkyOption from './SkyOption.vue';
import SkyColorPicker from './SkyColorPicker.vue';
import SkyPopup from './SkyPopup.vue';
import SkyTabs from './SkyTabs.vue';
import SkyTabPanel from './SkyTabPanel.vue';
import SkyTooltip from './SkyTooltip.vue';
import SkyDialog from './SkyDialog.vue';
import SkySlider from './SkySlider.vue';

const components = [
  SkyButton,
  SkyInput,
  SkyInputNumber,
  SkySelect,
  SkyOption,
  SkyColorPicker,
  SkyPopup,
  SkyTabs,
  SkyTabPanel,
  SkyTooltip,
  SkyDialog,
  SkySlider,
];

export default function(Vue: typeof _Vue) {
  components.forEach(component => {
    Vue.component(component.name, component);
  });
}
