<template>
  <div v-show="visible" class="sky-color-picker" @click.stop>
    <div>颜色</div>

    <SkyTabs v-model="type">
      <SkyTabPanel label="颜色"> </SkyTabPanel>
      <SkyTabPanel label="渐变"> </SkyTabPanel>
    </SkyTabs>

    <div
      ref="palette"
      class="sky-cp__palette"
      :style="{ background: paletteBackground }"
    >
      <div class="sky-cpp__color-saturation"></div>
      <div class="sky-cpp__color-value"></div>
      <div ref="palettePointer" class="sky-cpp__pointer"></div>
    </div>

    <div class="sky-cp__slider sky-cp__slider-hux">
      <div ref="sliderHux" class="sky-cps__track">
        <div ref="sliderHuxPointer" class="sky-cpst__pointer"></div>
      </div>
    </div>

    <div class="sky-cp__slider sky-cp__slider-alpha">
      <div
        class="sky-cpsa__background"
        :style="sliderAlphaBackgroundStyle"
      ></div>
      <div ref="sliderAlpha" class="sky-cps__track">
        <div ref="sliderAlphaPointer" class="sky-cpst__pointer"></div>
      </div>
    </div>

    <div class="flex justify-between mt-3.5">
      <SkyButton size="small">
        <svg-icon filename="straw" />
      </SkyButton>

      <SkyInput
        :value="hex"
        class="w-24 mx-1"
        size="small"
        @change="handleChangeHex"
      />

      <SkyInputNumber
        v-model="alpha"
        class="w-12"
        size="small"
        :min="0"
        :max="100"
        @input="handleChangeAlpha"
        @change="handleChangeAlpha"
      />
    </div>
  </div>
</template>

<script>
import { registerMoveableElement } from './moveable';
import {
  RGBA2HSLA,
  HSLA2RGBA,
  RGB2Hex,
  hex2RGB,
  RGB2HSL,
  HSL2Hex,
} from './color';
import mixinPopup from './mixins/popup';

export default {
  name: 'SkyColorPicker',

  mixins: [mixinPopup],

  props: {
    value: {
      type: Array,
      default: () => [255, 255, 255, 0],
    },

    visible: {
      type: Boolean,
      default: false,
    },
  },

  data() {
    return {
      type: '颜色',
      hsla: { h: 0, s: 0, l: 0, a: 0 },
      paletteBackground: '',
      hex: '',
      alpha: 0,
    };
  },

  computed: {
    sliderAlphaBackgroundStyle() {
      const rgb = hex2RGB(this.hex).join(',');
      return {
        background: `linear-gradient(to right, rgba(${rgb}, 0) 0%, rgb(${rgb}) 100%)`,
      };
    },
  },

  mounted() {
    // console.log('mountedmountedmounted', this.value);

    const { sliderHux, sliderAlpha } = this.$refs;

    const hsla = RGBA2HSLA(...this.value);
    this.hsla.h = hsla[0];
    this.hsla.s = hsla[1];
    this.hsla.l = hsla[2];
    this.hsla.a = hsla[3];

    this.hex = RGB2Hex(...this.value);
    this.backendHex = this.hex;
    this.alpha = Math.round(this.hsla.a * 100);

    this.doUpdate();

    const { palettePointer, sliderHuxPointer, sliderAlphaPointer } = this.$refs;

    palettePointer.style.left = `${this.hsla.s}%`;
    palettePointer.style.top = `${100 - this.hsla.l}%`;
    sliderHuxPointer.style.left = `${(this.hsla.h / 360) * 100}%`;
    sliderAlphaPointer.style.left = `${this.hsla.a * 100}%`;

    this.paletteMoveable = registerMoveableElement(this.$refs.palette, {
      onmousemove: this.onChangeSL,
      onmouseup: this.onChangeSL,
    });

    this.sliderHuxMoveable = registerMoveableElement(sliderHux, {
      onmousemove: this.onChangeHux,
      onmouseup: this.onChangeHux,
    });

    this.sliderAlphaMoveable = registerMoveableElement(sliderAlpha, {
      onmousemove: this.onChangeAlpha,
      onmouseup: this.onChangeAlpha,
    });

    this.unwatchHSLA = this.$watch('hsla', this.onChangeHSLA, { deep: true });
  },

  beforeDestroy() {
    this.paletteMoveable?.destroy();
    this.sliderHuxMoveable?.destroy();
    this.sliderAlphaMoveable?.destroy();
    this.unwatchHSLA();
  },

  methods: {
    doUpdate() {
      this.paletteBackground = `hsl(${this.hsla.h}, 100%, 50%)`;
      this.hex = HSL2Hex(...Object.values(this.hsla));
      this.backendHex = this.hex;
      this.alpha = Math.round((this.hsla.a ?? 1) * 100);
    },

    onChangeHSLA(hsla) {
      const rgba = HSLA2RGBA(...Object.values(hsla));
      this.$emit('input', rgba);
      this.doUpdate();
    },

    onChangeSL(position) {
      const x = position.x * 100;
      const y = position.y * 100;

      this.hsla.s = Math.round(x);
      this.hsla.l = Math.round(100 - y);

      this.$refs.palettePointer.style.left = `${x}%`;
      this.$refs.palettePointer.style.top = `${y}%`;
    },

    onChangeHux(position) {
      this.hsla.h = position.x * 360;
      this.$refs.sliderHuxPointer.style.left = `${position.x * 100}%`;
    },

    onChangeAlpha(position) {
      this.hsla.a = position.x;
      this.$refs.sliderAlphaPointer.style.left = `${position.x * 100}%`;

      // console.log('onChangeAlpha', position.x, position.x * 100);
    },

    handleChangeHex(value) {
      if (/^#(?:[0-9a-f]{3}){1,2}$/i.test(value)) {
        const rgb = hex2RGB(value);
        this.$emit('input', [...rgb, this.alpha / 100]);

        const [h, s, l] = RGB2HSL(...rgb);
        this.hsla.h = h;
        this.hsla.s = s;
        this.hsla.l = l;

        this.$refs.palettePointer.style.left = `${this.hsla.s}%`;
        this.$refs.palettePointer.style.top = `${100 - this.hsla.l}%`;
        this.$refs.sliderHuxPointer.style.left = `${(this.hsla.h / 360) *
          100}%`;

        this.hex = value;
      } else {
        this.hex = this.backendHex;
      }
      // console.log('handleChangeHex', value);
    },

    handleChangeAlpha(value) {
      // console.log('handleChangeAlpha', value, value / 100);
      this.hsla.a = value / 100;
      this.$refs.sliderAlphaPointer.style.left = `${value}%`;
    },
  },
};
</script>

<style lang="scss" scoped>
.sky-color-picker {
  width: 224px;
  z-index: 3002;
  transform: translateX(-50%);
  @apply p-3 mt-2 rounded select-none fixed bg-white shadow;
}

.sky-cp__palette {
  height: 140px;
  @apply relative rounded mt-3.5 cursor-pointer overflow-hidden;

  .sky-cpp__color-saturation,
  .sky-cpp__color-value {
    @apply absolute top-0 right-0 bottom-0 left-0;
  }

  .sky-cpp__color-saturation {
    @apply bg-gradient-to-r from-white to-transparent;
  }

  .sky-cpp__color-value {
    @apply bg-gradient-to-t from-black to-transparent;
  }

  .sky-cpp__pointer {
    @apply absolute w-3 h-3 rounded-full border-2 border-white shadow transform -translate-x-1.5 -translate-y-1.5;
  }
}

.sky-cp__slider {
  @apply relative h-2 mt-3.5 rounded cursor-pointer;

  &-hux {
    background: linear-gradient(
      90deg,
      red 0,
      #ff0 17%,
      #0f0 33%,
      #0ff 50%,
      #00f 67%,
      #f0f 83%,
      red
    );
  }

  &-alpha {
    background: linear-gradient(
        to top right,
        hsla(0, 0%, 80%, 0.4) 25%,
        transparent 0,
        transparent 75%,
        hsla(0, 0%, 80%, 0.4) 0,
        hsla(0, 0%, 80%, 0.4)
      ),
      linear-gradient(
        to top right,
        hsla(0, 0%, 80%, 0.4) 25%,
        transparent 0,
        transparent 75%,
        hsla(0, 0%, 80%, 0.4) 0,
        hsla(0, 0%, 80%, 0.4)
      );
    background-size: 6px 6px;
    background-position: 0 0, 3px 3px;
  }

  .sky-cpsa__background {
    box-shadow: inset 0 0 0 1px rgb(0 0 0 / 6%);
    @apply h-full rounded;
  }
}

.sky-cps__track {
  @apply absolute top-0 left-1 right-1 h-full;
}

.sky-cpst__pointer {
  box-shadow: 0 0 2px rgb(0 0 0 / 60%);
  @apply box-content absolute top-0 w-2 h-2 border-4 border-white rounded-full transform -translate-x-2 -translate-y-1;
}
</style>
