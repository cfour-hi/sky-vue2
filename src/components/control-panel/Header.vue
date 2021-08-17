<template>
  <div class="header">
    <svg-icon
      v-if="showBack"
      filename="arrow-left"
      @click.native="$emit('back')"
    />
    <div>{{ title }}</div>
  </div>
</template>

<script>
export default {
  name: 'ControlPanelHeader',

  props: {
    showBack: {
      type: Boolean,
      default: false,
    },

    title: {
      type: String,
      default: '',
    },
  },
};
</script>

<style lang="scss" scoped>
.header {
  .el-icon-arrow-left {
    @apply mr-2 cursor-pointer;
  }

  @apply flex items-center h-12 px-6 border-b text-sm font-bold;
}
</style>
