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
