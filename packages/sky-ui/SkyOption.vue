<template>
  <div
    class="sky-option"
    :class="rootClass"
    :value="value"
    @click="handleClick"
  >
    <template v-if="$slots.default">
      <slot />
    </template>

    <span v-else>
      {{ label }}
    </span>
  </div>
</template>

<script>
export default {
  name: 'SkyOption',

  inject: ['vmSelect'],

  inheritAttrs: false,

  props: {
    label: {
      type: String,
      default: '',
    },

    // eslint-disable-next-line vue/require-prop-types
    value: {
      required: true,
    },
  },

  computed: {
    rootClass() {
      return {
        active: this.value === this.vmSelect.value,
      };
    },
  },

  methods: {
    handleClick() {
      this.vmSelect.handleChange(this.value);
    },
  },
};
</script>

<style lang="scss" scoped>
.sky-option {
  @apply py-1.5 px-3 text-blue-700 cursor-pointer;

  &.active {
    @apply bg-gray-100;
  }

  &:hover {
    @apply bg-gray-100;
  }
}
</style>
