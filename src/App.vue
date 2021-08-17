<template>
  <div id="app">
    <AppHeader />
    <AsideCategory />
    <AppMain />

    <EditorContextmenu />
  </div>
</template>

<script>
import AppHeader from '@/components/layout/AppHeader.vue';
import AsideCategory from '@/components/layout/AsideCategory.vue';
import AppMain from '@/components/layout/AppMain.vue';
import EditorContextmenu from '@/components/biz/EditorContextmenu.vue';
import useFont from '@/composables/useFont';

export default {
  name: 'App',

  components: {
    AppHeader,
    AsideCategory,
    AppMain,
    EditorContextmenu,
  },

  setup() {
    const { initFonts } = useFont();
    initFonts();
  },
};
</script>

<style lang="scss" src="@/styles/base.scss"></style>

<style scoped>
#app {
  position: absolute;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
}
</style>
