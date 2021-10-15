<template>
  <div class="sky-renderer" :style="rootStyle">
    <div class="sky-background" :style="backgroundStyle"></div>

    <template v-for="cloud in clouds">
      <Clouds
        v-if="cloud.type === 'clouds'"
        :key="cloud.id"
        :cloud="cloud"
        v-bind="$attrs"
      />

      <Cloud v-else :key="cloud.id" :cloud="cloud" v-bind="$attrs" />
    </template>
  </div>
</template>

<script>
import { SKY_CLOUD_LOCK } from '../constants';
import Clouds from './Clouds.vue';
import Cloud from './Cloud.vue';

export default {
  name: 'SkyRenderer',

  components: {
    Clouds,
    Cloud,
  },

  inheritAttrs: false,

  props: {
    background: {
      type: Object,
      required: true,
    },

    clouds: {
      type: Array,
      default: () => [],
    },
  },

  computed: {
    rootStyle() {
      return {
        width: `${this.skyState.width}px`,
        height: `${this.skyState.height}px`,
      };
    },

    backgroundStyle() {
      return {
        background: this.background.color,
        opacity: this.background.opacity ?? 1,
      };
    },
  },

  methods: {
    toCloudClass(sky) {
      return {
        [SKY_CLOUD_LOCK]: sky.lock,
      };
    },
  },
};
</script>
