<template>
  <div class="app-header">
    <input type="file" @change="handleChange" />
    <SkyButton @click="handleLock">Lock</SkyButton>
    <SkyButton @click="handleHistoryBack">Back</SkyButton>
    <SkyButton @click="handleHistoryForward">Forward</SkyButton>
    <SkyButton @click="handleViewportSub">viewport-</SkyButton>
    <SkyButton @click="handleViewport1">{{ skyState.scale }}</SkyButton>
    <SkyButton @click="handleViewportPlus">viewport+</SkyButton>
    <SkyButton @click="handleGetClouds">getClouds</SkyButton>
    <SkyButton @click="handleSave">Save</SkyButton>
    <SkyButton @click="handleAdaptive">Adaptive</SkyButton>
    <SkyButton @click="handleAddText">Add Text</SkyButton>
    <SkyButton @click="handleGenerateImage">Generate Image</SkyButton>
  </div>
</template>

<script>
import { processPSD2Sky } from '@/plugins/psd';
import { loadLocalTemplateData, saveTemplate2Local } from '@/plugins/template';
import { adaptiveZoom } from '@/utils/zoom';
import { addTextCloud } from '@/components/clouds/text/config';
import dom2Svg, { svg2ImageBlob } from '@/plugins/generate-image';

export default {
  async mounted() {
    // SkyEditor 在 AppMain 组件内
    // SkyEditor 的一些准备工作需要等到 mounted 执行
    await this.$nextTick();

    const data = loadLocalTemplateData();
    if (!data) return;

    this.skyState.width = data.width;
    this.skyState.height = data.height;
    this.skyState.background = data.background;
    this.skyState.clouds = data.clouds;
    this.skyState.scale = data.scale;
  },

  methods: {
    async handleChange(e) {
      const data = await processPSD2Sky(e.target.files[0]);
      const clouds = data.clouds.map(cloud => this.$sky.cloud.create(cloud));

      this.skyState.scale = 1;
      this.skyState.width = data.width;
      this.skyState.height = data.height;
      this.skyState.clouds = clouds;
      this.skyState.background = data.background;

      this.handleAdaptive();
    },

    handleLock() {
      this.$sky.cloud.lock();
    },

    handleHistoryBack() {
      this.$sky.history.back();
    },

    handleHistoryForward() {
      this.$sky.history.forward();
    },

    handleViewportSub() {
      this.skyState.scale = (Math.round(this.skyState.scale * 100) - 5) / 100;
    },

    handleViewport1() {
      this.skyState.scale = 1;
    },

    handleViewportPlus() {
      this.skyState.scale = (Math.round(this.skyState.scale * 100) + 5) / 100;
    },

    handleGetClouds() {
      console.log(this.skyState.clouds);
    },

    handleSave() {
      saveTemplate2Local(this.$sky.getState());
    },

    handleAdaptive() {
      this.skyState.scale = adaptiveZoom(
        this.skyState.width / this.skyState.scale,
        this.skyState.height / this.skyState.scale,
      );
    },

    handleAddText() {
      addTextCloud();
    },

    async handleGenerateImage() {
      console.time('handleGenerateImage');

      const svg = dom2Svg(this.skyState);
      const blob = await svg2ImageBlob(svg);

      console.timeEnd('handleGenerateImage');

      // downloadBlob(blob);

      const blobURL = URL.createObjectURL(blob);
      window.open(blobURL);
      URL.revokeObjectURL(blobURL);
    },
  },
};
</script>

<style lang="scss" scoped>
.app-header {
  height: var(--app-header-height);
  background: #fff;
}
</style>
