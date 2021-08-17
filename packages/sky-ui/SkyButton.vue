<template>
  <button
    type="button"
    class="sky-button"
    :class="rootClass"
    v-bind="$attrs"
    v-on="proxyListeners"
  >
    <slot />
  </button>
</template>

<script>
export default {
  name: 'SkyButton',

  props: {
    plain: {
      type: Boolean,
      default: false,
    },

    size: {
      type: String,
      default: '',
      validator(value) {
        return !value || ['small', 'large'].includes(value);
      },
    },

    disabled: {
      type: Boolean,
      default: false,
    },
  },

  computed: {
    rootClass() {
      const classs = [];
      if (this.size) classs.push(`sky-button--${this.size}`);
      if (this.plain) classs.push('sky-button--plain');
      if (this.disabled) classs.push('sky-button--disabled');
      return classs;
    },

    proxyListeners() {
      return {
        ...this.$listeners,
        click: this.handleClick,
      };
    },
  },

  methods: {
    handleClick() {
      if (this.disabled) return;
      this.$emit('click');
    },
  },
};
</script>

<style lang="scss" scoped>
.sky-button {
  @apply relative py-2 px-3 text-sm border border-gray-300 rounded;

  &:hover {
    @apply text-blue-700 bg-blue-100 border-blue-300;
  }

  &:active {
    @apply text-blue-900 border-blue-500;
  }

  &--small {
    @apply py-1.5 px-2.5 text-xs;
  }

  &--large {
    @apply py-3 px-4 text-base;
  }

  &--plain {
    @apply p-0 border-none bg-transparent;

    &:hover {
      @apply bg-transparent;
    }
  }

  &--disabled {
    @apply text-gray-300 cursor-not-allowed;

    &:hover {
      @apply text-gray-300 bg-transparent;
    }
  }
}
</style>
