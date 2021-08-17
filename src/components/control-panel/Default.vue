<template>
  <div class="control-panel__default">
    <ControlPanelHeader title="画布" />

    <div class="body">
      <div class="panel-label">
        <span>画布尺寸</span>
        <SkyButton size="small" plain>编辑</SkyButton>
      </div>

      <div class="size">
        <SkyInput :value="width" readonly>
          <template #append>宽</template>
        </SkyInput>

        <i class="w-2"></i>

        <SkyInput :value="height" readonly>
          <template #append>高</template>
        </SkyInput>
      </div>

      <div class="panel-label">
        <span>画布背景</span>
      </div>

      <SkyTabs v-model="activeTab" class="bg-tabs">
        <SkyTabPanel class="bar bar__color" label="颜色">
          <BarColorPicker v-model="skyState.background.color" />
        </SkyTabPanel>

        <SkyTabPanel label="图片">
          <SkyButton style="height: 40px;" @click="showBgDialog = true"
            >上传背景图</SkyButton
          >
        </SkyTabPanel>
      </SkyTabs>
    </div>

    <SkyDialog :visible.sync="showBgDialog" />
  </div>
</template>

<script>
import ControlPanelHeader from './Header.vue';
import BarColorPicker from '../biz/BarColorPicker.vue';

export default {
  name: 'ControlPanelDefault',

  components: {
    ControlPanelHeader,
    BarColorPicker,
  },

  data() {
    return {
      activeTab: '颜色',
      showBgDialog: false,
    };
  },

  computed: {
    width() {
      return `${parseInt(this.skyState.width / this.skyState.scale)}px`;
    },

    height() {
      return `${parseInt(this.skyState.height / this.skyState.scale)}px`;
    },
  },
};
</script>

<style lang="scss" scoped>
.size {
  @apply flex justify-between mb-5;

  .sky-input {
    @apply w-1/2;
  }
}

.panel-label {
  @apply flex justify-between text-xs mb-3 text-gray-700;
}

.bg-tabs {
  @apply mb-3;
}
</style>
