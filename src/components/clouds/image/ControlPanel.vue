<template>
  <div class="control-panel__cloud-image">
    <ControlPanelHeader title="图片" />

    <div class="body">
      <SkyButton>替换图片</SkyButton>
    </div>
  </div>
</template>

<script>
import ControlPanelHeader from '@/components/control-panel/Header.vue';

export default {
  name: 'ControlPanelCloudImage',

  components: {
    ControlPanelHeader,
  },

  methods: {
    handleChange(e) {
      const url = URL.createObjectURL(e.target.files[0]);
      this.skyState.targetClouds.forEach(cloud => {
        cloud.src = url;
      });
    },
  },
};
</script>
