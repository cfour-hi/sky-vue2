<template>
  <div class="sky-tabs">
    <div class="sky-tabs__header">
      <div class="sky-tabs__header-shell">
        <div
          v-for="(tab, index) in $slots.default"
          :key="tab.componentOptions.propsData.label"
          class="sky-tab__title"
          :class="{
            'sky-active': tab.componentOptions.propsData.label === value,
          }"
          @click="handleClickTabTitle(tab, index)"
        >
          {{ tab.componentOptions.propsData.label }}
        </div>

        <div class="sky-tab__slider" :style="sliderStyle"></div>
      </div>
    </div>

    <div class="sky-tabs__content">
      <slot />
    </div>
  </div>
</template>

<script>
export default {
  name: 'SkyTabs',

  props: {
    value: {
      type: String,
      required: true,
    },
  },

  data() {
    this.tabWidth = 100 / this.$slots.default.length;
    const width = `${this.tabWidth}%`;

    return {
      sliderStyle: { width, left: 0 },
    };
  },

  watch: {
    value(value) {
      this.doChange(value);
    },
  },

  mounted() {
    this.doChange(this.value);
  },

  methods: {
    doChange(value) {
      const index = this.$slots.default.findIndex(
        vn => vn.componentOptions.propsData.label === value,
      );
      this.sliderStyle.left = `${this.tabWidth * index}%`;

      this.preActiveTabVN = this.$slots.default[index];
      this.preActiveTabVN?.componentInstance?.changeActive?.(true);
    },

    handleClickTabTitle(tab, index) {
      this.$emit('input', tab.componentOptions.propsData.label);
      this.$emit('change', tab.componentOptions.propsData.label);

      this.sliderStyle.left = `${this.tabWidth * index}%`;

      this.preActiveTabVN?.componentInstance?.changeActive?.(false);
      this.preActiveTabVN = this.$slots.default[index];
      this.preActiveTabVN.componentInstance.changeActive(true);
    },
  },
};
</script>

<style lang="scss" scoped>
.sky-tabs__header {
  @apply p-0.5 mb-3 rounded bg-gray-100 cursor-pointer;
}

.sky-tabs__header-shell {
  @apply relative flex justify-between;
}

.sky-tab__title {
  @apply relative flex-auto py-1 text-center;
  z-index: 1;

  &.sky-active {
    @apply font-bold;
  }
}

.sky-tab__slider {
  @apply absolute top-0 bottom-0 rounded bg-white shadow transition-all duration-150 ease-in-out;
}
</style>
