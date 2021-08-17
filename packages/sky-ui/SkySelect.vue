<template>
  <div class="sky-select" data-sky-popup>
    <div @click="showPopup = !showPopup">
      <SkyInput :value="value" readonly />

      <div class="sky-select__arrow flex-center">
        <svg-icon filename="arrow-down--line" />
      </div>
    </div>

    <SkyPopup :visible.sync="showPopup" class="sky-select__popup">
      <slot />
    </SkyPopup>
  </div>
</template>

<script>
export default {
  name: 'SkySelect',

  provide() {
    return {
      vmSelect: this,
    };
  },

  props: {
    value: {
      type: [String, Number],
      required: true,
    },
  },

  data() {
    return {
      showPopup: false,
    };
  },

  methods: {
    handleChange(value) {
      this.$emit('input', value);
      this.$emit('change', value);
      this.showPopup = false;
    },
  },
};
</script>

<style lang="scss" scoped>
.sky-select {
  @apply relative;

  &__arrow {
    @apply absolute top-0 right-0 bottom-0 w-6 text-lg text-gray-300 cursor-pointer;
  }

  ::v-deep .sky-input__inner {
    @apply pr-6;

    &:read-only {
      @apply select-none;
    }
  }

  &__popup {
    @apply max-h-80 overflow-auto;
  }
}
</style>
