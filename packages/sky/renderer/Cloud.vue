<template>
  <div
    class="sky-cloud"
    :class="toCloudClass(cloud)"
    :style="rootStyle"
    :data-cloud-id="cloud.id"
  >
    <component
      :is="toCloudComponent(cloud.type)"
      :cloud="cloud"
      class="sky-bird"
      v-bind="$attrs"
    />
    <i class="border-before" />
  </div>
</template>

<script>
import { SKY_CLOUD_LOCK } from '../constants';
import { toCloudReflowStyle } from './helper';

export default {
  name: 'Cloud',

  inheritAttrs: false,

  props: {
    cloud: {
      type: Object,
      require: true,
      default: () => ({}),
    },
  },

  computed: {
    rootStyle() {
      return {
        opacity: this.cloud.opacity,
      };
    },
  },

  mounted() {
    // 不做成 computed
    // cloud width height top left 变更
    // 调用 sky.cloud.updateCloudsElementRect 更新 sky-cloud
    // 避免不必要开销
    Object.assign(this.$el.style, toCloudReflowStyle(this.cloud));
  },

  methods: {
    toCloudClass(cloud) {
      return {
        [SKY_CLOUD_LOCK]: cloud.lock,
      };
    },

    toCloudComponent(type) {
      return this.SkyComponents[type];
    },
  },
};
</script>
