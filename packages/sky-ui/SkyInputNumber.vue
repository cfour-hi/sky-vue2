<template>
  <div :class="rootClass">
    <SkyInput type="number" v-bind="$attrs" v-on="proxyListeners" />

    <div
      class="sky-input__number-arrow flex-center top-0"
      :class="{ 'sky-disabled': disableIncrease }"
      @click="handleClickArrowUp"
    >
      <svg-icon filename="arrow-up" />
    </div>

    <div
      class="sky-input__number-arrow flex-center bottom-0"
      :class="{ 'sky-disabled': disableDecrease }"
      style="transform: rotateX(180deg)"
      @click="handleClickArrowDown"
    >
      <svg-icon filename="arrow-up" />
    </div>
  </div>
</template>

<script>
import SkyInput from './SkyInput.vue';
import { toNumber } from './tool';

export default {
  name: 'SkyInputNumber',

  components: {
    SkyInput,
  },

  inheritAttrs: false,

  props: {
    // eslint-disable-next-line vue/require-default-prop
    min: Number,
    // eslint-disable-next-line vue/require-default-prop
    max: Number,
    decimal: {
      type: Number,
      default: 0,
    },
    step: {
      type: Number,
      default: 1,
    },
  },

  computed: {
    proxyListeners() {
      return {
        ...this.$listeners,
        input: this.onInput,
        change: this.onChange,
      };
    },

    rootClass() {
      const base = 'sky-input__number';
      const classs = [base];
      if (this.$attrs.size) classs.push(`${base}--${this.$attrs.size}`);
      if (this.$attrs.readonly !== undefined) classs.push(`${base}-readonly`);
      return classs;
    },

    disableIncrease() {
      return typeof this.max === 'number' && this.$attrs.value >= this.max;
    },

    disableDecrease() {
      return typeof this.min === 'number' && this.$attrs.value <= this.min;
    },
  },

  methods: {
    toNumber(value) {
      value = Number(value);

      if (typeof this.min === 'number') {
        if (value < this.min) value = this.min;
        if (value > this.max) value = this.max;
      }

      return value;
    },

    onInput(value, event) {
      this.$emit('input', this.toNumber(value), event);
    },

    onChange(value, event) {
      this.$emit('change', this.toNumber(value), event);
    },

    handleClickArrowUp() {
      if (this.disableIncrease) return;
      this.$emit(
        'change',
        toNumber(this.$attrs.value + this.step, { decimal: this.decimal }),
      );
    },

    handleClickArrowDown() {
      if (this.disableDecrease) return;
      this.$emit(
        'change',
        toNumber(this.$attrs.value - this.step, { decimal: this.decimal }),
      );
    },
  },
};
</script>

<style lang="scss" scoped>
.sky-input__number {
  @apply relative inline-block;

  $input-inner: '::v-deep .sky-input__inner:not(:read-only)';

  #{$input-inner} {
    @apply pr-5;
  }

  $arrow: #{&}-arrow;

  #{$arrow} {
    @apply absolute  right-0 w-5 h-1/2 text-gray-500 cursor-pointer;

    .svg-icon {
      @apply mt-1;
      font-size: 10px;
    }

    &.sky-disabled {
      @apply text-gray-300 cursor-not-allowed;
    }
  }

  &-readonly {
    #{$arrow} {
      @apply text-gray-300;
    }
  }

  &--small {
    #{$arrow} {
      @apply w-3.5;

      .svg-icon {
        @apply mt-0.5;
        font-size: 8px;
      }
    }

    #{$input-inner} {
      @apply pr-3.5;
    }
  }
}
</style>
