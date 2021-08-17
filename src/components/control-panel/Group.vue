<template>
  <div class="control-panel__group">
    <ControlPanelHeader title="组合" />

    <div class="body">
      <SkyButton class="button__group" @click="handleClick">
        {{ isClouds ? '拆分' : '成' }}组
      </SkyButton>

      <div class="bar bar-tool mt-3">
        <SkyButton plain @click="$sky.cloud.alignTop">
          <SkyTooltip content="上对齐" direction="bottom" />
          <svg-icon filename="align-top" />
        </SkyButton>

        <SkyButton plain @click="$sky.cloud.alignVerticalMiddle">
          <SkyTooltip content="垂直居中对齐" direction="bottom" />
          <svg-icon filename="align-vertical-middle" />
        </SkyButton>

        <SkyButton plain @click="$sky.cloud.alignBottom">
          <SkyTooltip content="下对齐" direction="bottom" />
          <svg-icon filename="align-bottom" />
        </SkyButton>

        <div class="h-4 w-px bg-gray-300"></div>

        <SkyButton plain @click="$sky.cloud.alignLeft">
          <SkyTooltip content="左对齐" direction="bottom" />
          <svg-icon filename="align-left" />
        </SkyButton>

        <SkyButton plain @click="$sky.cloud.alignHorizontalMiddle">
          <SkyTooltip content="水平居中对齐" direction="bottom" />
          <svg-icon filename="align-horizontal-middle" />
        </SkyButton>

        <SkyButton plain @click="$sky.cloud.alignRight">
          <SkyTooltip content="右对齐" direction="bottom" />
          <svg-icon filename="align-right" />
        </SkyButton>
      </div>
    </div>
  </div>
</template>

<script>
import ControlPanelHeader from '@/components/control-panel/Header.vue';

export default {
  name: 'ControlPanelGroup',

  components: {
    ControlPanelHeader,
  },

  computed: {
    isClouds() {
      return (
        this.skyState.targetClouds.length === 1 &&
        this.skyState.targetClouds[0]?.type === 'clouds'
      );
    },
  },

  methods: {
    handleClick() {
      if (this.isClouds) {
        this.$sky.cloud.unGroup();
      } else {
        this.$sky.cloud.toGroup();
      }
    },
  },
};
</script>

<style lang="scss" scoped>
.button__group {
  @apply w-full bg-blue-50 border-blue-200 text-blue-700 font-bold;
}
</style>
