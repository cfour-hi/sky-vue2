<template>
  <div class="app-main">
    <div class="sky-editor-container" :style="skyEditorContainerStyle">
      <sky-editor class="sky-editor__app" />
    </div>
  </div>
</template>

<script>
import { defineComponent, computed } from '@vue/composition-api';

export default defineComponent({
  name: 'AppMain',

  setup(props, { root }) {
    // console.log('props, context', props, context);

    const skyEditorContainerStyle = computed(() => {
      return {
        width: `${root.skyState.width}px`,
        height: `${root.skyState.height}px`,
      };
    });

    return {
      skyEditorContainerStyle,
    };
  },
});
</script>

<style lang="scss" scoped>
.app-main {
  @apply absolute bg-gray-100 overflow-auto;

  top: var(--app-header-height);
  left: var(--aside-category-width);
  right: var(--aside-control-width);
  bottom: 0;
}

.sky-editor-container {
  @apply box-content my-0 mx-auto;
}
</style>
