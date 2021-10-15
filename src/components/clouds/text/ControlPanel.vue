<template>
  <div class="control-panel__cloud-text">
    <ControlPanelHeader title="文字" />

    <div class="body">
      <div class="bar__font">
        <SkySelect
          ref="selectFontFamily"
          :value="proxyCloud.fontFamily[0]"
          class="select__font-family"
          @change="handleChangeFontFamily"
        >
          <SkyOption
            v-for="fontFamily in fontFamilyList"
            :key="fontFamily.id"
            :label="fontFamily.name"
            :value="fontFamily.name"
          >
            <img :src="fontFamily.preview.url" alt="" />
          </SkyOption>
        </SkySelect>

        <SkyInputNumber
          class="ml-2"
          :value="Math.round(proxyCloud.fontSize)"
          @input="handleChangeCloud('fontSize', $event)"
          @change="handleChangeCloud('fontSize', $event)"
        />
      </div>

      <div class="bar bar-tool">
        <SkyButton
          plain
          :class="{ active: proxyCloud.fontWeight === 700 }"
          @click="handleChangeCloudMix('fontWeight', 700, 400)"
        >
          <SkyTooltip content="加粗" direction="bottom" />
          <svg-icon filename="bold" />
        </SkyButton>

        <SkyButton
          plain
          :class="{ active: proxyCloud.fontStyle === 'italic' }"
          @click="handleChangeCloudMix('fontStyle', 'italic', 'normal')"
        >
          <SkyTooltip content="斜体" direction="bottom" />
          <svg-icon filename="italic" />
        </SkyButton>

        <SkyButton
          plain
          :class="{ active: proxyCloud.textDecoration === 'underline' }"
          @click="handleChangeCloudMix('textDecoration', 'underline', 'none')"
        >
          <SkyTooltip content="下划线" direction="bottom" />
          <svg-icon filename="underline" />
        </SkyButton>

        <SkyButton
          plain
          :class="{ active: proxyCloud.textDecoration === 'line-through' }"
          @click="
            handleChangeCloudMix('textDecoration', 'line-through', 'none')
          "
        >
          <SkyTooltip content="删除线" direction="bottom" />
          <svg-icon filename="deleteline" />
        </SkyButton>
      </div>

      <div class="bar bar-tool" :class="{ vertical: isVerticalRL }">
        <SkyButton
          plain
          :class="{ active: proxyCloud.textAlign === 'left' }"
          @click="handleChangeCloud('textAlign', 'left')"
        >
          <SkyTooltip content="左对齐" direction="bottom" />
          <svg-icon filename="text-align-left" />
        </SkyButton>

        <SkyButton
          plain
          :class="{ active: proxyCloud.textAlign === 'center' }"
          @click="handleChangeCloud('textAlign', 'center')"
        >
          <SkyTooltip content="居中对齐" direction="bottom" />
          <svg-icon filename="align-center" />
        </SkyButton>

        <SkyButton
          plain
          :class="{ active: proxyCloud.textAlign === 'right' }"
          @click="handleChangeCloud('textAlign', 'right')"
        >
          <SkyTooltip content="右对齐" direction="bottom" />
          <svg-icon filename="text-align-right" />
        </SkyButton>

        <SkyButton
          plain
          :class="{ active: proxyCloud.textAlign === 'justify' }"
          @click="handleChangeCloud('textAlign', 'justify')"
        >
          <SkyTooltip content="两端对齐" direction="bottom" />
          <svg-icon filename="align-justify" />
        </SkyButton>
      </div>

      <div class="bar bar__color" data-sky-popup>
        <BarColorPicker
          :value="proxyCloud.color"
          :modes="['纯色']"
          @input="handleChangeColor"
        />
      </div>

      <div class="bar bar-tool" data-sky-popup>
        <SkyButton
          plain
          :class="{ active: isVerticalRL }"
          @click="handleChangeWritingMode"
        >
          <SkyTooltip content="文字竖版" direction="bottom" />
          <svg-icon filename="writing-mode" />
        </SkyButton>

        <SkyButton plain @click="showSpacingPopup = !showSpacingPopup">
          <SkyTooltip content="间距" direction="bottom" />
          <svg-icon filename="spacing" />
        </SkyButton>

        <PopupSpacing :visible.sync="showSpacingPopup" :cloud="proxyCloud" />

        <SkyButton plain>
          <SkyTooltip content="文字变形" direction="bottom" />
          <svg-icon filename="text-distortion" />
        </SkyButton>
      </div>
    </div>
  </div>
</template>

<script>
import { Editor, Range } from 'slate';
import ControlPanelHeader from '@/components/control-panel/Header.vue';
import { toProxyCloud } from './helper';
import BarColorPicker from '@/components/biz/BarColorPicker.vue';
import PopupSpacing from './control-panel/PopupSpacing.vue';
import { isSupportFontFamily } from '@/utils/font';
import useFont from '@/composables/useFont';
import { addFont2Style } from '@/composables/useFont';

window.EditorEditor = Editor;
window.RangeRange = Range;

// TODO: 局部选择完成之后，处理多种颜色的情况

export default {
  name: 'ControlPanelCloudText',

  components: {
    ControlPanelHeader,
    BarColorPicker,
    PopupSpacing,
  },

  setup() {
    const { fonts } = useFont();
    return {
      fontFamilyList: fonts,
    };
  },

  data() {
    this.cloudTextVM = null;

    return {
      proxyCloud: {},
      showSpacingPopup: false,
    };
  },

  computed: {
    isVerticalRL() {
      return this.proxyCloud.writingMode === 'vertical-rl';
    },

    cloud() {
      return this.skyState.targetClouds[0];
    },

    isGroup() {
      return this.skyState.targetClouds.length > 1;
    },
  },

  created() {
    this.proxyCloud = toProxyCloud(this.skyState.targetClouds);

    window.cloudTextVM = this.cloudTextVM = this.$sky.editor.getBirdVMById(
      this.cloud.id,
    );
  },

  mounted() {
    this.handleChangeFontFamily(this.proxyCloud.fontFamily[0]);
  },

  methods: {
    doRemoveAllMark(key) {
      this.cloudTextVM.readonly = false;
      this.$nextTick(() => {
        this.cloudTextVM.doSelectAll();
        this.cloudTextVM.$editor.removeMark(key);
        this.cloudTextVM.readonly = true;
      });
    },

    handleChangeCloudMix(key, value, defaultValue) {
      if (this.cloudTextVM.readonly) {
        this.proxyCloud[key] =
          this.proxyCloud[key] === value ? defaultValue ?? value : value;

        this.doRemoveAllMark(key);
      } else {
        const marks = Range.isCollapsed(this.cloudTextVM.$editor.selection)
          ? this.cloudTextVM.$editor.marks
          : Editor.marks(this.cloudTextVM.$editor);
        this.cloudTextVM.$editor.addMark(
          key,
          marks?.[key] === value ? defaultValue ?? value : value,
        );

        if (['textAlign'].includes(key)) {
          this.proxyCloud[key] = value;
        }
      }
    },

    handleChangeCloud(key, value) {
      this.proxyCloud[key] = value;
    },

    handleChangeFontFamily(value) {
      this.proxyCloud.fontFamily.splice(0, 1, value);

      const font = this.fontFamilyList.find(f => f.name === value);
      if (!font) return;

      const elInputInner = this.$refs.selectFontFamily.$el.querySelector(
        '.sky-input__inner',
      );
      const style = {
        backgroundImage: `url(${font.preview.url})`,
        backgroundSize: '80%',
        backgroundPosition: '12px center',
        backgroundRepeat: 'no-repeat',
      };

      Object.assign(elInputInner.style, style);

      if (isSupportFontFamily(value)) return;

      addFont2Style(font.name, font.content.woff);
    },

    handleChangeColor(value) {
      // console.log('handleChangeColor', value);

      if (this.cloudTextVM.readonly) {
        this.proxyCloud.color = value;
        this.doRemoveAllMark('color');
      } else {
        this.cloudTextVM.$refs.slateEditor.$el.focus();
        this.cloudTextVM.$editor.addMark('color', value);
      }
    },

    handleChangeWritingMode() {
      this.handleChangeCloud(
        'writingMode',
        this.isVerticalRL ? 'horizontal-tb' : 'vertical-rl',
      );
      const { width, height } = this.cloud;
      this.cloud.width = height;
      this.cloud.height = width;

      this.$sky.cloud.updateCloudsElementRect();
    },

    handleChangeStyle(key, value, defaultValue = '') {
      this.cloud[key] = this.cloud[key] === value ? defaultValue : value;
    },
  },
};
</script>

<style lang="scss" scoped>
.bar__font {
  @apply flex justify-between;

  .select__font-family {
    ::v-deep {
      .sky-input__inner {
        @apply text-transparent cursor-pointer;
      }
    }
  }

  .sky-input__number {
    width: 60px;

    ::v-deep {
      .sky-input__number--increase,
      .sky-input__number--decrease {
        @apply w-4;
      }

      .sky-input .sky-input__inner {
        @apply pl-2 pr-4;
      }
    }
  }
}

.bar {
  @apply mt-3;

  &.vertical {
    .svg-icon {
      transform: rotate(90deg);
    }
  }
}
</style>
