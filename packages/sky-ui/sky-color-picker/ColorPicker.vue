<template>
  <div class="sky-color-picker">
    <div class="mb-3">{{ mode }}</div>

    <SkyTabs
      v-if="modes.length > 1"
      :value="mode"
      @change="$emit('changeMode', $event)"
    >
      <SkyTabPanel v-for="label in modes" :key="label" :label="label">
      </SkyTabPanel>
    </SkyTabs>

    <template v-if="showGradient">
      <div v-show="mode === '渐变'" class="sky-cp__gradient flex-center">
        <div class="sky-cp__gradient-bar w-48 h-4">
          <div
            ref="gradientTrack"
            class="sky-cpgb__track h-full"
            style="width: 174px"
            :style="{ background: value }"
          >
            <!-- tabindex="-1" 是元素可以触发 keydown 事件 -->
            <div
              v-for="(gradient, index) in gradients"
              :key="index"
              class="sky-cpgb__pointer"
              :class="{
                'sky-cpgb__pointer--active': gradient === activeGradient,
              }"
              :data-sort="index"
              :style="{
                left: `${gradient.offset * 100}%`,
                background: gradient.color,
              }"
              tabindex="-1"
              @mousedown="handleMousedownGradientPointer(gradient)"
              @keyup.stop="handleKeyupGradientPointer"
            ></div>
          </div>
        </div>
      </div>
    </template>

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
import { registerMoveableElement } from '../moveable';
import {
  hexA2HSLA,
  HSLA2HexA,
  hex2RGB,
  RGB2HSL,
  hexA2RGBA,
  RGBA2HexA,
} from '../color';
import { toGradientString } from './helper';

export default {
  name: 'ColorPicker',

  props: {
    value: {
      type: String,
      required: true,
    },

    modes: {
      type: Array,
      default: () => ['纯色', '渐变', '图案'],
    },

    mode: {
      type: String,
      default: '纯色',
      validator: value => ['纯色', '渐变', '图案'].includes(value),
    },
  },

  data() {
    return {
      angle: 90,
      gradients: [],
      hsla: { h: 0, s: 0, l: 0, a: 0 },
      paletteBackground: '#f00',
      hex: '#000',
      alpha: 0,
      activeGradient: null,
    };
  },

  computed: {
    showGradient() {
      return this.modes.includes('渐变');
    },

    sliderAlphaBackgroundStyle() {
      const rgb = hex2RGB(this.hex).join(',');
      return {
        background: `linear-gradient(to right, rgba(${rgb}, 0) 0%, rgb(${rgb}) 100%)`,
      };
    },
  },

  watch: {
    mode(value) {
      this.changeMode(value);
    },

    activeGradient(value) {
      this.setColor(value.color);
    },
  },

  async mounted() {
    this.changeMode(this.mode);

    const { palettePointer, sliderHuxPointer, sliderAlphaPointer } = this.$refs;

    palettePointer.style.left = `${this.hsla.s}%`;
    palettePointer.style.top = `${100 - this.hsla.l}%`;
    sliderHuxPointer.style.left = `${(this.hsla.h / 360) * 100}%`;
    sliderAlphaPointer.style.left = `${this.hsla.a * 100}%`;

    if (this.showGradient) {
      this.gradientMoveable = registerMoveableElement(
        this.$refs.gradientTrack,
        {
          onmousedown: this.onMousedownGradient,
          onmousemove: this.onMousemoveGradient,
          onmouseup: this.onMouseupGradient,
        },
      );
    }

    this.paletteMoveable = registerMoveableElement(this.$refs.palette, {
      onmousemove: this.onChangeSL,
      onmouseup: this.onChangeSL,
    });

    this.sliderHuxMoveable = registerMoveableElement(this.$refs.sliderHux, {
      onmousemove: this.onChangeHux,
      onmouseup: this.onChangeHux,
    });

    this.sliderAlphaMoveable = registerMoveableElement(this.$refs.sliderAlpha, {
      onmousemove: this.onChangeAlpha,
      onmouseup: this.onChangeAlpha,
    });

    await this.$nextTick();

    this.unwatchHSLA = this.$watch('hsla', this.onChangeHSLA, { deep: true });
  },

  beforeDestroy() {
    this.paletteMoveable?.destroy();
    this.sliderHuxMoveable?.destroy();
    this.sliderAlphaMoveable?.destroy();
    this.unwatchHSLA();

    if (this.gradientMoveable) {
      this.gradientMoveable.destroy();
    }
  },

  methods: {
    changeMode(mode) {
      if (mode === '渐变') {
        if (this.gradients.length === 0) {
          this.value.match(/[^,]+/g).forEach((item, index) => {
            if (index === 0) {
              this.angle = Number(item.match(/\d+/)[0]);
              return;
            }

            let [color, offset] = item.trim().split(' ');
            if (!color.startsWith('#')) color = RGBA2HexA(color);

            offset = offset.match(/\d+/)[0] / 100;

            this.gradients.push({ color, offset });
            this.activeGradient = this.gradients[0];
          });
        } else {
          this.setColor(this.activeGradient.color);
        }
      } else if (mode === '纯色') {
        this.setColor(this.value);
      }

      // TODO: 图案
    },

    updateColorData(hexA) {
      this.paletteBackground = `hsl(${this.hsla.h}, 100%, 50%)`;
      this.hex = hexA.slice(0, 7);
      this.backendHex = this.hex;
      this.alpha = Math.round((this.hsla.a ?? 1) * 100);
    },

    setColor(color) {
      const hsla = hexA2HSLA(color);
      this.hsla.h = hsla[0];
      this.hsla.s = hsla[1];
      this.hsla.l = hsla[2];
      this.hsla.a = hsla[3];

      this.updateColorData(color);

      let x = this.hsla.s;
      const y = Math.round(100 - this.hsla.l);
      this.$refs.palettePointer.style.left = `${x}%`;
      this.$refs.palettePointer.style.top = `${y}%`;

      x = this.hsla.h / 360;
      this.$refs.sliderHuxPointer.style.left = `${x * 100}%`;

      this.$refs.sliderAlphaPointer.style.left = `${this.hsla.a * 100}%`;
    },

    onMousedownGradient(position) {
      if (this.mousedownGradientPointer) {
        return;
      }

      const index = this.gradients.findIndex(stop => stop.offset >= position.x);
      const start = this.gradients[index - 1];
      const startRGBA = hexA2RGBA(start.color);
      const end = this.gradients[index];
      const endRGBA = hexA2RGBA(end.color);

      const rgb = [];
      for (let i = 0; i < 3; i += 1) {
        rgb.push(startRGBA[i] + (endRGBA[i] - startRGBA[i]) * position.x);
      }

      const a =
        end.offset - position.x - (position.x - start.offset) > 0
          ? startRGBA[3]
          : endRGBA[3];

      const color = RGBA2HexA(...rgb, a);
      this.activeGradient = {
        color,
        offset: position.x,
      };

      this.gradients.splice(index, 0, this.activeGradient);
    },

    onMousemoveGradient(position) {
      if (!this.mousedownGradientPointer) return;

      this.activeGradient.offset = position.x;
      this.gradients.sort((a, b) => a.offset - b.offset);

      this.$emit('input', toGradientString(this.angle, this.gradients));
    },

    onMouseupGradient() {
      this.mousedownGradientPointer = false;
    },

    handleMousedownGradientPointer(stop) {
      this.mousedownGradientPointer = true;
      this.activeGradient = stop;
    },

    handleKeyupGradientPointer(event) {
      if (!['Backspace', 'Delete'].includes(event.key)) return;
      if (this.gradients.length === 2) return;

      const index = this.gradients.indexOf(this.activeGradient);
      this.gradients.splice(index, 1);
      this.activeGradient = this.gradients[0];
    },

    onChangeHSLA(hsla) {
      const hexA = HSLA2HexA(...Object.values(hsla));

      if (this.mode === '纯色') {
        this.$emit('input', hexA);
      } else if (this.mode === '渐变') {
        this.activeGradient.color = hexA;
        this.$emit('input', toGradientString(this.angle, this.gradients));
      }
      this.updateColorData(hexA);
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
    },

    handleChangeHex(value) {
      if (/^#(?:[0-9a-f]{3}){1,2}$/i.test(value)) {
        const rgb = hex2RGB(value);
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
    },

    handleChangeAlpha(value) {
      this.hsla.a = value / 100;
      this.$refs.sliderAlphaPointer.style.left = `${value}%`;
    },
  },
};
</script>

<style lang="scss" scoped>
.sky-color-picker {
  @apply select-none;
}

.sky-cp__gradient {
  &-bar {
    @apply flex justify-center;
  }
}

.sky-cpgb__track {
  @apply relative;
}

.sky-cpgb__pointer {
  @apply absolute h-5 -top-0.5 border-2 border-solid border-white transform -translate-x-2/4 shadow outline-none;

  width: 18px;

  &--active {
    z-index: 1;
    box-shadow: 0 0 4px 0 rgb(0 0 0 / 20%), 0 0 0 1.2px #2254f4;
  }
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
