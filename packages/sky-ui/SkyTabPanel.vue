<template>
  <div class="sky-tab-panel" :style="rootStyle">
    <slot />
  </div>
</template>

<script>
export default {
  name: 'SkyTabPanel',

  props: {
    label: {
      type: String,
      required: true,
    },
  },

  data() {
    return {
      active: false,
    };
  },

  computed: {
    rootStyle() {
      return {
        display: this.active ? 'block' : 'none',
      };
    },
  },

  methods: {
    changeActive(value) {
      this.active = value;
    },
  },
};
</script>
