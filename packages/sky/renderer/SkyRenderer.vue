<template>
  <div class="sky-renderer">
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
    backgroundStyle() {
      return {
        background: this.background.value,
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

<style scoped>
.sky-renderer {
  position: absolute;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
}

.sky-background {
  width: 100%;
  height: 100%;
  background-size: cover;
  background-repeat: no-repeat;
}
</style>

<style>
.sky-cloud {
  position: absolute;
}
</style>
