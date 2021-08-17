<template>
  <div class="cloud__image">
    <img :src="cloud.src" alt="" class="image__content" />
  </div>
</template>

<script>
export default {
  name: 'CloudImage',

  inheritAttrs: false,

  props: {
    cloud: {
      type: Object,
      required: true,
    },
  },
};
</script>

<style scoped>
.cloud__image {
  height: 100%;
}

.image__content {
  display: block;
  width: 100%;
  height: 100%;
  -webkit-user-drag: none;
}
</style>
