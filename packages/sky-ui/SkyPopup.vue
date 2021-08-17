<template>
  <div v-show="visible" class="sky-popup" :style="rootStyle" @click.stop>
    <slot />
  </div>
</template>

<script>
import mixinPopup from './mixins/popup';

export default {
  name: 'SkyPopup',

  mixins: [mixinPopup],

  props: {
    visible: {
      type: Boolean,
      default: false,
    },

    width: {
      type: Number,
      default: 200,
    },
  },

  computed: {
    rootStyle() {
      return {
        width: `${this.width}px`,
      };
    },
  },
};
</script>

<style lang="scss" scoped>
.sky-popup {
  z-index: 3002;
  transform: translateX(-50%);
  @apply fixed p-3 rounded bg-white shadow;
}
</style>
