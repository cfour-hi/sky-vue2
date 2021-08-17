<template>
  <svg
    :class="`svg-icon__${filename}`"
    class="svg-icon"
    aria-hidden="true"
    @click="$emit('click')"
  >
    <use :xlink:href="iconName" />
  </svg>
</template>

<script>
export default {
  name: 'SvgIcon',

  props: {
    filename: {
      type: String,
      required: true,
    },
  },

  computed: {
    iconName() {
      return `#icon-${this.filename}`;
    },
  },
};
</script>

<style scoped>
.svg-icon {
  width: 1em;
  height: 1em;
  @apply fill-current;
}
</style>
