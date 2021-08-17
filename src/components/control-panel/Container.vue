<template>
  <div class="control-panel__container">
    <component :is="panel" :key="panelKey" />

    <div v-if="!isDefaulePanel" class="py-4 border-t mx-4">
      <div v-show="showOpacity" class="bar mb-3">
        <img src="https://cdn.dancf.com/design/img/fill_opacity.f6330ad5.svg" />

        <SkySlider
          v-model="cloud0.opacity"
          :min="0"
          :max="1"
          :show-tooltip="false"
          class="w-28"
        />

        <SkyInputNumber
          :value="Math.round(cloud0.opacity * 100)"
          :min="0"
          :max="100"
          size="small"
          class="w-12"
          @change="handleChangeOpacity"
        />
      </div>

      <div class="bar bar-tool" data-sky-popup>
        <SkyButton plain @click="handleClickLock">
          <SkyTooltip :content="cloud0.lock ? '解锁' : '锁定'" />
          <svg-icon :filename="cloud0.lock ? 'locked' : 'unlock'" />
        </SkyButton>

        <SkyButton plain :disabled="cloud0.lock" @click="handleClickLayer">
          <SkyTooltip content="图层顺序" />
          <svg-icon filename="layer" />
        </SkyButton>

        <PopupLayer :visible.sync="showLayerPopup" />

        <SkyButton plain :disabled="cloud0.lock" @click="handleClickCopy">
          <SkyTooltip content="复制" :disabled="cloud0.lock" />
          <svg-icon filename="copy" />
        </SkyButton>

        <SkyButton plain :disabled="cloud0.lock" @click="handleClickDelete">
          <SkyTooltip content="删除" :disabled="cloud0.lock" />
          <svg-icon filename="trash" />
        </SkyButton>
      </div>
    </div>
  </div>
</template>

<script>
import ControlPanelCloudText from '../clouds/text/ControlPanel.vue';
import ControlPanelCloudImage from '../clouds/image/ControlPanel.vue';
import ControlPanelGroup from './Group.vue';
import ControlPanelDefault from './Default.vue';
import PopupLayer from './PopupLayer.vue';
import { CLOUD_TYPE } from '@/constants';
import { toNumber } from '@packages/sky-ui/tool';

const ENUM_CONTROL_PANEL = {
  [CLOUD_TYPE.text]: ControlPanelCloudText,
  [CLOUD_TYPE.image]: ControlPanelCloudImage,
};

export default {
  name: 'ControlPanelContainer',

  components: {
    PopupLayer,
  },

  data() {
    return {
      showLayerPopup: false,
    };
  },

  computed: {
    cloud0() {
      return this.skyState.targetClouds[0];
    },

    panel() {
      if (this.skyState.targetClouds.length === 0) return ControlPanelDefault;
      if (this.skyState.targetClouds.length > 1) return ControlPanelGroup;

      if (this.cloud0.type === 'clouds') return ControlPanelGroup;
      return ENUM_CONTROL_PANEL[this.cloud0.type];
    },

    panelKey() {
      if (this.skyState.targetClouds.length === 0) return 'default';
      if (this.skyState.targetClouds.length > 1) return 'group';

      return this.skyState.targetClouds[0].id;
    },

    isDefaulePanel() {
      return this.panelKey === 'default';
    },

    showOpacity() {
      const [cloud0] = this.skyState.targetClouds;
      return (
        this.skyState.targetClouds.length === 1 &&
        !this.$sky.cloud.isCloudsObject(cloud0)
      );
    },
  },

  methods: {
    handleChangeOpacity(value) {
      this.cloud0.opacity = toNumber(value / 100, { decimal: 2 });
    },

    handleClickLock() {
      if (this.cloud0.lock) {
        this.$sky.cloud.unlock();
      } else {
        this.$sky.cloud.lock();
      }
    },

    handleClickLayer() {
      this.showLayerPopup = !this.showLayerPopup;
    },

    handleClickCopy() {
      this.$sky.cloud.copy();
      this.$sky.cloud.paste();
    },

    handleClickDelete() {
      this.$sky.cloud.delete();
    },
  },
};
</script>

<style lang="scss">
.control-panel__container {
  top: var(--app-header-height);
  width: var(--aside-control-width);
  z-index: 3001;

  @apply fixed right-0 bottom-0 bg-white;

  .body {
    height: calc(100% - 48px);
    @apply p-4;
  }

  .bar {
    @apply flex justify-around items-center h-10 rounded text-gray-700 bg-gray-100;

    &-tool {
      > .sky-button {
        @apply p-1.5;

        &:not(.sky-button--disabled) {
          &:hover {
            @apply text-black bg-gray-200;
          }

          &.active {
            @apply text-blue-700;
          }
        }
      }

      .svg-icon {
        font-size: 20px;
      }
    }
  }

  .bar__color {
    @apply relative p-2;
  }
}
</style>
