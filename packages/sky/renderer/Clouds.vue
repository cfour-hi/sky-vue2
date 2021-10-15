<template>
  <div
    :class="toCloudClass(cloud)"
    class="sky-cloud sky-clouds sky-bird"
    :data-cloud-id="cloud.id"
  >
    <!-- resize 时 scale -->
    <div>
      <template v-for="subCloud in cloud.clouds">
        <Clouds
          v-if="subCloud.type === 'clouds'"
          :key="subCloud.id"
          :cloud="subCloud"
          v-bind="$attrs"
        />

        <Cloud v-else :key="subCloud.id" :cloud="subCloud" v-bind="$attrs" />
      </template>
    </div>

    <i class="border-before" />
  </div>
</template>

<script>
import { SKY_CLOUD_LOCK, CLOUD_RENDER_DIRECTIONS } from '../constants';
import { toCloudReflowStyle } from './helper';
import Cloud from './Cloud.vue';

export default {
  name: 'Clouds',

  components: { Cloud },

  inheritAttrs: false,

  props: {
    cloud: {
      type: Object,
      required: true,
      default: () => ({}),
    },
  },

  data() {
    // THINK: configuable?
    return {
      skyHooks: {
        moveable: {
          renderDirections: [...CLOUD_RENDER_DIRECTIONS],
          keepRatio: [...CLOUD_RENDER_DIRECTIONS],
        },
      },
    };
  },

  mounted() {
    Object.assign(this.$el.style, toCloudReflowStyle(this.cloud));
  },

  methods: {
    toCloudClass(cloud) {
      return {
        [SKY_CLOUD_LOCK]: cloud.lock,
      };
    },
  },
};
</script>
