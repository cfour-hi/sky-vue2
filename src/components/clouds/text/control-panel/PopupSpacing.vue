<template>
  <SkyPopup :width="240" v-bind="$attrs" v-on="$listeners">
    <div class="flex justify-between items-center text-xs">
      <div>字间距</div>

      <SkySlider
        v-model="cloud.letterSpacing"
        :min="minLetterSpacing"
        :max="maxLetterSpacing"
        :show-tooltip="false"
        class="w-28 mx-2"
      />

      <SkyInputNumber
        :value="Math.round(cloud.letterSpacing)"
        size="small"
        class="w-12"
        :min="minLetterSpacing"
        :max="maxLetterSpacing"
        @change="cloud.letterSpacing = $event"
      />
    </div>

    <div class="flex justify-between items-center text-xs mt-2">
      <div>行间距</div>

      <SkySlider
        v-model="cloud.lineHeight"
        :min="0.5"
        :max="2.5"
        :show-tooltip="false"
        class="w-28 mx-2"
      />

      <SkyInputNumber
        :value="cloud.lineHeight"
        :min="0.5"
        :max="2.5"
        :decimal="2"
        :step="0.02"
        size="small"
        class="w-12"
        @change="cloud.lineHeight = $event"
      />
    </div>
  </SkyPopup>
</template>

<script>
export default {
  name: 'PopupSpacing',

  props: {
    cloud: {
      type: Object,
      required: true,
    },
  },

  computed: {
    minLetterSpacing() {
      const { fontSize } = this.cloud;
      if (fontSize > 50) return -50;
      return -fontSize;
    },

    maxLetterSpacing() {
      const { fontSize } = this.cloud;
      if (fontSize < 50) return 50;
      return fontSize;
    },
  },
};
</script>
