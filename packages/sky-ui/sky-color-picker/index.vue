<template>
  <SkyPopup :visible.sync="proxyVisible" :width="256">
    <ColorPicker
      :mode="mode"
      v-bind="$attrs"
      v-on="$listeners"
      @input="handleInput"
      @changeMode="handleChangeMode"
    />
  </SkyPopup>
</template>

<script>
import SkyPopup from '../SkyPopup.vue';
import ColorPicker from './ColorPicker.vue';
import { parseBackgroundValue } from './helper';

export default {
  name: 'SkyColorPicker',

  components: {
    SkyPopup,
    ColorPicker,
  },

  inheritAttrs: false,

  props: {
    visible: {
      type: Boolean,
      default: false,
    },

    defaultColor: {
      type: String,
      default: '#000000ff',
    },

    defaultGradient: {
      type: String,
      default: 'linear-gradient(90deg, #fffae0ff 0%, #ffd1f1ff 100%)',
    },

    defaultImage: {
      type: String,
      default:
        'https://st0.dancf.com/csc/157/material-2d-textures/0/20190714-174653-ed3c.jpg',
    },
  },

  data() {
    return {
      mode: '纯色',
      color: this.defaultColor,
      gradient: this.defaultGradient,
      image: this.defaultImage,
    };
  },

  computed: {
    proxyVisible: {
      get() {
        return this.visible;
      },
      set(value) {
        this.$emit('update:visible', value);
      },
    },
  },

  watch: {
    ['$attrs.value']: {
      immediate: true,
      handler(value) {
        this.mode = parseBackgroundValue(value);
        this.handleInput(value);
      },
    },
  },

  methods: {
    handleInput(value) {
      if (this.mode === '纯色') {
        this.color = value;
      } else if (this.mode === '渐变') {
        this.gradient = value;
      } else if (this.mode === '图案') {
        this.image = value;
      }
    },

    handleChangeMode(mode) {
      this.mode = mode;

      let background;
      if (mode === '纯色') {
        background = this.color;
      } else if (mode === '渐变') {
        background = this.gradient;
      } else if (mode === '图案') {
        background = this.image;
      }
      this.$emit('input', background);
    },
  },
};
</script>
