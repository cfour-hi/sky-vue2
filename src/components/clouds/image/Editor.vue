<template>
  <CloudImage v-bind="$attrs" v-on="$listeners" />
</template>

<script>
import CloudImage from './index.vue';

export default {
  name: 'CloudImageEditor',

  components: {
    CloudImage,
  },

  inheritAttrs: false,

  data() {
    return {
      skyHooks: {
        moveable: {
          keepRatio: ['ne', 'nw', 'sw', 'se'],
        },
      },
    };
  },
};
</script>
