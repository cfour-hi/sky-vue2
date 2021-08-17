<template>
  <div class="sky-dialog flex-center" :style="rootStyle">
    <div class="mask" @click="handleClickDialog"></div>

    <div class="sky-dialog__panel" :style="panelStyle">
      <div class="sky-dialog__header"></div>
      <div class="sky-dialog__body"></div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'SkyDialog',

  props: {
    visible: {
      type: Boolean,
      default: false,
    },

    width: {
      type: [Number, String],
      default: '80%',
    },

    height: {
      type: [Number, String],
      default: '80%',
    },

    destroyOnClose: {
      type: Boolean,
      default: true,
    },
  },

  computed: {
    rootStyle() {
      return {
        display: this.visible ? 'flex' : 'none',
      };
    },

    panelStyle() {
      return {
        width: this.width,
        height: this.height,
      };
    },
  },

  watch: {
    visible(value) {
      if (value) {
        document.body.appendChild(this.$el);
      }
    },
  },

  mounted() {
    // console.log('this', this);
    document.body.appendChild(this.$el);
  },

  methods: {
    handleClickDialog() {
      this.$emit('update:visible', false);
    },
  },
};
</script>

<style lang="scss" scoped>
.sky-dialog {
  z-index: 3001;
  @apply fixed top-0 right-0 bottom-0 left-0;

  &__panel {
    @apply rounded-lg bg-white;
  }
}

.mask {
  @apply absolute w-full h-full bg-opacity-60;
}
</style>
