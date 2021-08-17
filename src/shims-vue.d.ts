declare module '*.vue' {
  import Vue from 'vue';

  export default Vue;
}

declare module 'vue/types/vue' {
  import { Sky } from '@packages/sky/editor/create-sky';

  interface Vue {
    $sky: Sky;
  }
}
