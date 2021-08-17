<template>
  <div class="sky-slider">
    <div class="sky-slider__progress" :style="progressStyle"></div>

    <div ref="pointer" class="sky-slider__pointer" :style="pointerStyle">
      <SkyTooltip
        v-show="showTooltip"
        :content="value"
        :active="activeTooltip"
      />
    </div>
  </div>
</template>

<script>
import { registerMoveableElement } from './moveable';
import { toNumber } from './tool';

export default {
  name: 'SkySlider',

  props: {
    value: {
      type: Number,
      default: 0,
    },

    min: {
      type: Number,
      default: 0,
    },

    max: {
      type: Number,
      default: 100,
    },

    step: {
      type: Number,
      default: 0, // 0 标识此值无效
    },

    showTooltip: {
      type: Boolean,
      default: true,
    },
  },

  data() {
    return {
      activeTooltip: false,
    };
  },

  computed: {
    difference() {
      return Math.round(this.max - this.min);
    },

    progress() {
      return Math.round(((this.value - this.min) / this.difference) * 100);
    },

    progressStyle() {
      return {
        width: `${this.progress}%`,
      };
    },

    pointerStyle() {
      return {
        left: `${this.progress}%`,
      };
    },

    // 为 0 标识此值无效
    stepRatio() {
      return this.step / this.max;
    },
  },

  mounted() {
    this.pointerMoveable = registerMoveableElement(this.$el, {
      onmousedown: this.onChangeValue,
      onmousemove: this.onChangeValue,
    });

    this.onMousedown = () => {
      this.activeTooltip = true;
    };
    this.onMouseup = () => {
      this.activeTooltip = false;
    };
    this.$refs.pointer.addEventListener('mousedown', this.onMousedown);
    document.addEventListener('mouseup', this.onMouseup);
  },

  beforeDestroy() {
    this.pointerMoveable.destroy();
    this.$refs.pointer.removeEventListener('mousedown', this.onMousedown);
    document.removeEventListener('mouseup', this.onMouseup);
  },

  methods: {
    onChangeValue(position) {
      let value = position.x * this.difference;

      if (this.step > 0) {
        value = Math.round((position.x * this.max) / this.step) * this.step;
      }

      const x = toNumber(value + this.min, { decimal: 2 });
      if (x === this.value) return;

      this.$emit('input', x);
    },
  },
};
</script>

<style lang="scss" scoped>
.sky-slider {
  @apply relative h-4 cursor-pointer;

  &::before {
    content: '';
    @apply absolute top-1/2 left-0 w-full h-0.5 rounded-sm bg-gray-200 transform -translate-y-1/2;
  }

  &__progress {
    @apply absolute h-0.5 top-1/2 rounded-sm bg-blue-700 -translate-y-1/2;
  }

  &__pointer {
    @apply absolute top-1/2 h-3 w-3 bg-white rounded-full shadow transform -translate-x-1/2 -translate-y-1/2 cursor-pointer;
  }
}
</style>
