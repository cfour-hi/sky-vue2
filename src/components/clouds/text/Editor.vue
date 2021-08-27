<template>
  <div
    class="cloud-text__editor"
    :style="rootStyle"
    @click="handleClick"
    @mouseup="onMouseup"
  >
    <Slate :value="value" class="slate" @onChange="handleChange">
      <Editable
        ref="slateEditor"
        class="slate-editable"
        :render-leaf="renderLeaf"
        :render-element="renderElement"
        :read-only="readonly"
      ></Editable>
    </Slate>
  </div>
</template>

<script>
import { Transforms } from 'slate';
import { Slate, Editable } from 'slate-vue';

// TODO: 组件在 clouds 进入编辑状态，不可触发拖动行为

const RENDER_DIRECTIONS_BASE = ['ne', 'nw', 'sw', 'se'];

const toRenderDirections = mode => {
  if (mode === 'vertical-rl') {
    return [...RENDER_DIRECTIONS_BASE, 'n', 's'];
  }
  return [...RENDER_DIRECTIONS_BASE, 'w', 'e'];
};

const toStyle = styles => {
  return {
    fontFamily:
      (styles.fontFamily ? styles.fontFamily.join(',') : '') +
      ', Arial, SimSun, Sans-Serif',
    fontSize: styles.fontSize ? `${styles.fontSize}px` : '',
    fontWeight: styles.fontWeight,
    fontStyle: styles.fontStyle ?? '',
    textDecoration: styles.textDecoration,
    textAlign: styles.textAlign ?? '',
    color: styles.color,
    writingMode: styles.writingMode ?? '',
    lineHeight: styles.lineHeight ?? '',
    letterSpacing: `${styles.letterSpacing}px`,
  };
};

const renderLeaf = ({ attributes, children, leaf }) => {
  // console.log('renderLeaf', attributes, children, leaf);

  return {
    render() {
      return (
        <span {...{ attrs: attributes }} style={toStyle(leaf)}>
          {children}
        </span>
      );
    },
  };
};

const renderElement = ({ attributes, children }) => {
  // console.log('renderElement', attributes, children, element);

  return {
    render() {
      return <p {...{ attrs: attributes }}>{children}</p>;
    },
  };
};

export default {
  name: 'CloudTextEditor',

  components: {
    Slate,
    Editable,
  },

  props: {
    cloud: {
      type: Object,
      required: true,
    },
  },

  data() {
    this.clickTimestamp = null;
    this.elTextContent = null;
    this.elTextEffect = null;

    this.skyHooks = {
      moveable: {
        keepRatio: [...RENDER_DIRECTIONS_BASE],
        renderDirections: toRenderDirections(this.cloud.writingMode),
        onClick: this.handleClick,
        onChangeTarget: this.onChangeTarget,
        onLeaveSelect: this.onChangeTarget,
        onResizeStart: this.onResizeStart,
        onResize: this.onResize,
        onResizeEnd: this.onResizeEnd,
        onResizeEndInGroup: this.onResizeEndInGroup,
      },
    };

    return {
      renderLeaf,
      renderElement,
      readonly: true,
      value: JSON.stringify(this.cloud.texts),
    };
  },

  computed: {
    rootStyle() {
      return {
        ...toStyle(this.cloud),
        width: `${this.cloud.width / this.skyState.scale}px`,
        height: `${this.cloud.height / this.skyState.scale}px`,
        transform: `scale(${this.skyState.scale})`,
        transformOrigin: 'top left',
      };
    },
  },

  watch: {
    readonly(value) {
      if (!value) {
        this.$sky.moveable.instance.passDragArea = true;
      }
    },

    'cloud.writingMode'(value) {
      this.skyHooks.moveable.renderDirections = toRenderDirections(value);
      this.$sky.moveable.updateState();
      this.$sky.moveable.instance.updateTarget();
    },
  },

  mounted() {
    ['cloud.letterSpacing', 'cloud.lineHeight'].forEach(key => {
      this.$watch(key, async () => {
        await this.$nextTick();

        this.cloud.height = this.$refs.slateEditor.$el.clientHeight;
        this.$sky.cloud.updateCloudsElementRect();
      });
    });
  },

  methods: {
    handleChange() {
      this.cloud.texts = this.$editor.children;
    },

    doSelectAll() {
      this.$refs.slateEditor.$el.focus();

      const { texts } = this.cloud;
      const focusPath0 = texts.length - 1;
      const { children } = texts[focusPath0];
      const focusPath1 = children.length - 1;
      const focusOffset = children[focusPath1].text.length;

      Transforms.select(this.$editor, {
        anchor: { path: [0, 0], offset: 0 },
        focus: { path: [focusPath0, focusPath1], offset: focusOffset },
      });
    },

    handleClick(event) {
      if (
        !this.readonly ||
        this.cloud.lock ||
        event.metaKey ||
        event.shiftKey
      ) {
        return;
      }

      const now = Date.now();
      if (now - this.clickTimestamp < 300) {
        this.readonly = false;

        this.$nextTick(() => {
          this.doSelectAll();
        });
      }

      this.clickTimestamp = now;
    },

    onChangeTarget() {
      this.readonly = true;
      Transforms.collapse(this.$editor, { edge: 'focus' });
      this.cloud.text = this.$el.textContent;
    },

    onMouseup() {
      // TODO: 判断是否为多种颜色
      // const marks = Editor.marks(this.$editor);
    },

    onResizeStart(event) {
      const { datas } = event;
      datas.startFontSize = this.cloud.fontSize;
    },

    onResize(event) {
      const { datas, direction } = event;
      const [h, v] = direction;

      if (h !== 0 && v !== 0) {
        this.cloud.fontSize = datas.startFontSize * datas.scale[0];
      }
    },

    onResizeEnd() {
      //
    },
  },
};
</script>
