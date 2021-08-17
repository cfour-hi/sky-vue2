<template>
  <div
    class="bar__color-picker"
    data-sky-popup
    @click="showSkyColorPicker = !showSkyColorPicker"
  >
    <div
      class="relative h-6 rounded cursor-pointer"
      :style="{ background: color }"
    >
      <div v-if="multiple" class="multiple-mask flex-center">
        多种颜色
      </div>
    </div>

    <SkyColorPicker
      :visible.sync="showSkyColorPicker"
      v-bind="$attrs"
      v-on="$listeners"
    />
  </div>
</template>

<script>
export default {
  name: 'BarColorPicker',

  props: {
    multiple: {
      type: Boolean,
      default: false,
    },
  },

  data() {
    return {
      showSkyColorPicker: false,
    };
  },

  computed: {
    color() {
      return `rgba(${this.$attrs.value.join(',')})`;
    },
  },
};
</script>

<style lang="scss" scoped>
.bar__color-picker {
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
  background-size: 8px 8px;
  background-position: 0 0, 4px 4px;
  box-shadow: inset 0 0 0 1px rgb(0 0 0 / 6%);

  @apply w-full rounded;
}

.multiple-masks {
  @apply absolute w-full h-full text-xs bg-white border border-dashed border-gray-500 rounded;
}
</style>
