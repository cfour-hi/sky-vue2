<template>
  <div class="sky-editor" :style="rootStyle">
    <sky-renderer
      ref="skyRenderer"
      :background="skyState.background"
      :clouds="skyState.clouds"
      :scale="skyState.scale"
      @mousedown.left.native="handleMousedownLeft"
    />

    <ControlPanelContainer class="sky-control-panel" />
  </div>
</template>

<script>
import { isBackgroundElement, isLockCloudElement } from './helper';

export default {
  name: 'SkyEditor',

  data() {
    this.mousedownEvent = null;
    this.mousedownTarget = null;
    this.mousedownAndMoved = false;

    return {};
  },

  computed: {
    rootStyle() {
      return {
        width: `${this.skyState.width}px`,
        height: `${this.skyState.height}px`,
      };
    },
  },

  watch: {
    'skyState.clouds': {
      immediate: true,
      deep: true,
      handler() {
        this.$sky.history.unshift();
      },
    },

    'skyState.background': {
      immediate: true,
      deep: true,
      handler() {
        this.$sky.history.unshift();
      },
    },
  },

  beforeCreate() {
    this.$sky.vm = this;
  },

  mounted() {
    this.$sky.moveable.createInstance();
    this.$sky.selecto.createInstance();
  },

  methods: {
    mousemove() {
      // console.log('mousemove', event);

      this.mousedownAndMoved = true;
      const [target0] = this.mousedownTarget;

      if (
        !target0 ||
        isBackgroundElement(target0) ||
        isLockCloudElement(target0)
      ) {
        return;
      }

      this.$sky.moveable.setTarget(this.mousedownTarget);
      this.$sky.moveable.instance.dragStart(this.mousedownEvent);

      document.removeEventListener('mousemove', this.mousemove);
    },

    mouseup(event) {
      // console.log('mouseup', event);
      document.removeEventListener('mousemove', this.mousemove);
      document.removeEventListener('mouseup', this.mouseup);

      if (this.mousedownAndMoved) {
        this.mousedownAndMoved = false;
      } else {
        this.$sky.moveable.setTarget(this.mousedownTarget);
        this.$sky.cloud.setSelectCloud(event);
      }

      this.mousedownEvent = null;
      this.mousedownTarget = null;
    },

    handleMousedownLeft(event) {
      // console.log('handleMousedownLeft', event);

      this.mousedownEvent = event;
      this.mousedownTarget = this.$sky.moveable.getTarget(event);

      document.addEventListener('mousemove', this.mousemove);
      document.addEventListener('mouseup', this.mouseup);
    },
  },
};
</script>

<style scoped>
.sky-editor {
  position: relative;
  background-color: #fff;
  background-size: 16px 16px;
  background-position: 0 0, 8px 8px;
  background-image: linear-gradient(
      to top right,
      #ccc 25%,
      transparent 0,
      transparent 75%,
      #ccc 0,
      #ccc
    ),
    linear-gradient(
      to top right,
      #ccc 25%,
      transparent 0,
      transparent 75%,
      #ccc 0,
      #ccc
    );
  user-select: none;
}
</style>

<style>
.moveable-area,
.sky-cloud-select {
  cursor: move;
}

.border-before {
  content: '';
  display: none;
  box-sizing: initial;
  border: 1px solid #666;
  margin: -1px 0 0 -1px;
  height: 100%;
  width: 100%;
  position: absolute;
  left: 0;
  top: 0;
  z-index: 2;
  pointer-events: none;
}

.cloud > .border-before {
  content: '';
  display: none;
  box-sizing: initial;
  border: 1px solid #666;
  margin: -1px 0 0 -1px;
  height: 100%;
  width: 100%;
  position: absolute;
  left: 0;
  top: 0;
  z-index: 2;
  pointer-events: none;
}

.sky-cloud-select > .border-before {
  box-sizing: initial;
  display: block;
  border-color: #4af;
  border-style: solid;
  background-color: initial;
  border-width: 1px;
  margin: -1px 0 0 -1px;
}

.moveable-control-box.lock .moveable-line {
  background: #f84545;
}
</style>
