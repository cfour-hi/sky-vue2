<template>
  <div class="sky-input" :class="rootClass">
    <input
      ref="input"
      class="sky-input__inner"
      :type="type"
      :value="value"
      v-bind="$attrs"
      @input="handleInput"
      @change="handleChange"
      @click="$emit('click')"
    />

    <div v-if="$slots.append" class="sky-input__append flex-center">
      <slot name="append" />
    </div>
  </div>
</template>

<script>
export default {
  name: 'SkyInput',

  inheritAttrs: false,

  props: {
    // eslint-disable-next-line vue/require-default-prop
    value: [String, Number],

    type: {
      type: String,
      default: 'text',
    },

    size: {
      type: String,
      default: '',
      validator(value) {
        return !value || ['small', 'large'].includes(value);
      },
    },
  },

  computed: {
    rootClass() {
      const classs = [];
      if (this.size) classs.push(`sky-input--${this.size}`);
      if (this.$slots.append) classs.push('sky-input--append');
      return classs;
    },
  },

  methods: {
    handleInput(event) {
      this.$emit('input', event.target.value, event);
    },

    handleChange(event) {
      this.$emit('change', event.target.value, event);

      // 输入之后失焦
      // 如果上层改变 value
      // 输入框内容不会更新
      // 通过以下方式更新输入框内容
      this.$nextTick(() => {
        this.$refs.input.value = this.value;
      });
    },
  },
};
</script>

<style lang="scss" scoped>
.sky-input {
  @apply relative inline-block;

  $input-inner: #{&}__inner;

  #{$input-inner} {
    @apply w-full py-2 px-3 border border-gray-200 text-sm text-gray-700 rounded outline-none;

    &:not(:read-only):hover {
      @apply border-gray-300;
    }

    &:not(:read-only):focus {
      @apply border-blue-500;
    }

    /* Chrome, Safari, Edge, Opera */
    &::-webkit-outer-spin-button,
    &::-webkit-inner-spin-button {
      -webkit-appearance: none;
      @apply m-0;
    }

    /* Firefox */
    &[type='number'] {
      -moz-appearance: textfield;
    }
  }

  &--small {
    #{$input-inner} {
      @apply py-1 px-1.5 text-xs;
    }
  }

  &--large {
    #{$input-inner} {
      @apply py-3 px-4 text-base;
    }
  }

  &--append {
    .sky-input__inner {
      @apply pr-6;
    }
  }

  &__append {
    @apply absolute top-0 right-0 w-6 h-full text-gray-500;
  }
}
</style>
