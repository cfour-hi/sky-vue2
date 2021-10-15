<template>
  <div class="sky-dialog flex-center" :style="rootStyle">
    <div class="mask" @click="handleClickMask"></div>

    <div class="sky-dialog__panel" :style="panelStyle">
      <div class="sky-dialog__header">
        <slot name="header" />
      </div>

      <div class="sky-dialog__body">
        <slot />
      </div>

      <div class="sky-dialog__footer">
        <slot name="footer" />
      </div>
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

  methods: {
    handleClickMask() {
      this.$emit('update:visible', false);
    },
  },
};
</script>

<style lang="scss" scoped>
.sky-dialog {
  z-index: 3002;
  @apply fixed top-0 right-0 bottom-0 left-0;

  &__panel {
    @apply relative flex flex-col w-4/5 h-4/5 rounded-lg bg-white;
  }

  &__header {
    @apply flex-none h-14;
  }

  &__body {
    @apply flex-1 overflow-auto;
  }

  &__footer {
    @apply flex-none h-14;
  }
}

.mask {
  @apply absolute w-full h-full bg-black bg-opacity-60;
}
</style>
