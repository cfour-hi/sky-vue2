<template>
  <div class="text-index" :style="rootStyle">
    <div class="text__effect">
      <div
        v-for="(stroke, index) in cloud.strokes"
        :key="`stroke${index}`"
        class="text__stroke"
        :style="toStrokeStyle(stroke)"
      >
        <span
          v-for="(text, index1) in cloud.texts"
          :key="index1"
          :style="toTextStyle(text)"
          v-text="text.text"
        ></span>
      </div>

      <div
        v-for="(shadow, index) in cloud.shadows"
        :key="`shadow${index}`"
        class="text__shadow"
        :style="toShadowStyle(shadow)"
      >
        <span
          v-for="(text, index1) in cloud.texts"
          :key="index1"
          :style="toTextStyle(text)"
          v-text="text.text"
        ></span>
      </div>
    </div>

    <div
      ref="text"
      class="text__content"
      :style="textContentStyle"
      v-on="$listeners"
    >
      <template v-if="cloud.texts.length > 0">
        <span
          v-for="(text, index) in cloud.texts"
          :key="index"
          :style="toTextStyle(text)"
          v-text="text.text"
        ></span>
      </template>

      <span v-else><br /></span>
    </div>
  </div>
</template>

<script>
const toStyle = styles => {
  return {
    fontFamily:
      (styles.fontFamily ? styles.fontFamily.join(',') : '') +
      ', Arial, SimSun, Sans-Serif',
    fontSize: styles.fontSize ? `${styles.fontSize}px` : '',
    textAlign: styles.textAlign ?? '',
    color: styles.color ? `rgba(${styles.color.join(',')})` : '',
    textDecoration: styles.textDecoration ?? '',
    writingMode: styles.writingMode ?? '',
    fontWeight: styles.fontWeight ?? '',
    fontStyle: styles.fontStyle ?? '',
    lineHeight: styles.lineHeight ?? '',
    letterSpacing: styles.letterSpacing ?? '',
  };
};

export default {
  name: 'CloudText',

  props: {
    cloud: {
      type: Object,
      required: true,
    },
  },

  computed: {
    rootStyle() {
      return toStyle(this.cloud);
    },

    textContentStyle() {
      const isVertical = this.cloud.writingMode === 'vertical-rl';
      return {
        width: isVertical ? 'auto' : '100%',
        height: isVertical ? '100%' : 'auto',
      };
    },
  },

  methods: {
    toTextStyle(text) {
      return toStyle(text);
    },

    toStrokeStyle(stroke) {
      return {
        webkitTextStroke: `${stroke.width}px rgba(${stroke.color.join(',')})`,
      };
    },

    toShadowStyle(shadow) {
      const { distance, angle, color, blur } = shadow;
      const x = distance * Math.cos((180 - angle) * (Math.PI / 180));
      const y = distance * Math.sin((180 - angle) * (Math.PI / 180));
      // console.log(`${x}px ${y}px ${blur}px rgba(${color.join(',')})`);

      return {
        textShadow: `${x}px ${y}px ${blur}px rgba(${color.join(',')})`,
      };
    },
  },
};
</script>

<style scoped>
.text-index {
  word-wrap: break-word;
}

.text__effect {
  position: absolute;
  width: 100%;
  height: 100%;
}

.text__content {
  position: absolute; /* 用来提升 DOM 层级 + 获取内容真实宽高 */
}
</style>