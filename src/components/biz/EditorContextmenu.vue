<template>
  <ul
    class="editor-contextmenu"
    :style="{ visibility: showEl ? 'visible' : 'hidden' }"
    @click="handleClick"
    @contextmenu.prevent
  >
    <li
      class="editor-contextmenu__item"
      :class="{ disabled: !hasTarget || isLock }"
      @click="handleClickCopy"
    >
      <span>复制</span>
      <span class="editor-contextmenu__subtitle">⌘ + C</span>
    </li>

    <li
      class="editor-contextmenu__item"
      :class="{ disabled: !hasTarget || isLock }"
      @click="handleClickCut"
    >
      <span>剪切</span>
      <span class="editor-contextmenu__subtitle">⌘ + X</span>
    </li>

    <li
      class="editor-contextmenu__item"
      :class="{ disabled: !skyState.clipboard }"
      @click="$sky.cloud.paste"
    >
      <span>粘贴</span>
      <span class="editor-contextmenu__subtitle">⌘ + V</span>
    </li>

    <li v-show="hasTarget" class="editor-contextmenu__delimiter"></li>

    <li
      v-show="hasTarget"
      class="editor-contextmenu__item"
      @click="handleClickLock"
    >
      <span>{{ isLock ? '解锁' : '锁定' }}图层</span>
    </li>

    <li
      v-show="hasTarget"
      class="editor-contextmenu__item editor-contextmenu__item-parent"
    >
      <span>图层顺序</span>

      <ul
        class="editor-contextmenu"
        :class="{ 'editor-contextmenu--left': subOverflowX }"
      >
        <li
          class="editor-contextmenu__item"
          :class="{ disabled: disableMoveup }"
          @click="handleClickMove('moveTop', $event)"
        >
          <span>移到顶部</span>
          <span class="editor-contextmenu__subtitle">⌘ + ⇧ + ↑</span>
        </li>
        <li
          class="editor-contextmenu__item"
          :class="{ disabled: disableMoveup }"
          @click="handleClickMove('moveUp', $event)"
        >
          <span>上移一层</span>
          <span class="editor-contextmenu__subtitle">⌘ + ↑</span>
        </li>
        <li
          class="editor-contextmenu__item"
          :class="{ disabled: disableMovedown }"
          @click="handleClickMove('moveDown', $event)"
        >
          <span>下移一层</span>
          <span class="editor-contextmenu__subtitle">⌘ + ↓</span>
        </li>
        <li
          class="editor-contextmenu__item"
          :class="{ disabled: disableMovedown }"
          @click="handleClickMove('moveBottom', $event)"
        >
          <span>移到底部</span>
          <span class="editor-contextmenu__subtitle">⌘ + ⇧ + ↓</span>
        </li>
      </ul>
    </li>

    <li v-show="hasTarget" class="editor-contextmenu__delimiter"></li>

    <li
      v-show="overlappingClouds4Point.length > 0"
      class="editor-contextmenu__item editor-contextmenu__item-parent "
    >
      <span>选择重叠图层</span>

      <ul
        class="editor-contextmenu"
        :class="{ 'editor-contextmenu--left': subOverflowX }"
      >
        <li
          v-for="cloud in overlappingClouds4Point"
          :key="cloud.id"
          class="editor-contextmenu__item editor-contextmenu__item--overlapping"
          @click="handleClickSelectCloud(cloud)"
        >
          <span
            class="flex-center w-12 h-12 rounded border text-xl flex-shrink-0 bg-contain"
            style="font-family: -webkit-pictograph,serif"
            :style="[
              cloud.type === 'image'
                ? { backgroundImage: `url(${cloud.src})` }
                : '',
            ]"
          >
            <template v-if="cloud.type === 'text'">
              T
            </template>
          </span>

          <template v-if="cloud.type === 'text'">
            <span
              class="block overflow-hidden whitespace-nowrap overflow-ellipsis text-sm ml-2"
            >
              {{ cloud.text }}
            </span>
          </template>

          <template v-if="cloud.type === 'image'">
            图片
          </template>
        </li>
      </ul>
    </li>

    <li
      v-show="hasTarget"
      class="editor-contextmenu__item text-red-700"
      :class="{ disabled: isLock }"
      @click="handleClickDelete"
    >
      <span>删除图层</span>
      <span class="editor-contextmenu__subtitle">DEL</span>
    </li>
  </ul>
</template>

<script>
import clickOutSide from '@/plugins/click-outside';

export default {
  name: 'EditorContextmenu',

  data() {
    return {
      showEl: false,
      subOverflowX: false,
      overlappingClouds4Point: [],
      overlappingClouds4Cloud: [],
    };
  },

  computed: {
    hasTarget() {
      return this.skyState.targetClouds.length > 0;
    },

    isLock() {
      return this.hasTarget && this.skyState.targetClouds[0].lock;
    },

    disableMoveup() {
      const [lastCloud] = this.overlappingClouds4Cloud.slice(-1);
      return (
        !!this.skyState.targetClouds.find(cloud => cloud === lastCloud) ||
        this.isLock
      );
    },

    disableMovedown() {
      const [firstCloud] = this.overlappingClouds4Cloud;
      return (
        !!this.skyState.targetClouds.find(cloud => cloud === firstCloud) ||
        this.isLock
      );
    },
  },

  mounted() {
    this.elAppMain = document.querySelector('.app-main');
    this.elAppMain.addEventListener('contextmenu', this.onContextmenu);
    this.clickOutSide = clickOutSide(this.$el, this.onClickOutSide);
  },

  beforeDestroy() {
    this.elAppMain.removeEventListener('contextmenu', this.onContextmenu);
    this.clickOutSide.destroy();
  },

  methods: {
    onContextmenu(event) {
      const { target, clientX, clientY } = event;

      const skyControlPanel = document.querySelector('.sky-control-panel');
      if (skyControlPanel?.contains(target)) return;

      event.preventDefault();
      event.stopPropagation();

      this.elSubmenu = document.querySelector(
        '.editor-contextmenu__item-parent .editor-contextmenu',
      );

      const appMainRect = this.elAppMain.getBoundingClientRect();
      const { clientWidth, clientHeight } = this.$el;

      const dis = appMainRect.right - clientX - clientWidth;
      const overflowX = dis < 0;
      this.subOverflowX = dis - this.elSubmenu.clientWidth < 0;
      const overflowY = appMainRect.bottom - clientY - clientHeight < 0;

      Object.assign(this.$el.style, {
        left: `${overflowX ? clientX - clientWidth : clientX}px`,
        top: `${overflowY ? appMainRect.bottom - clientHeight : clientY}px`,
      });

      this.overlappingClouds4Point = this.$sky.cloud.getOverlappingClouds4Point(
        event,
      );
      this.overlappingClouds4Cloud = this.hasTarget
        ? this.$sky.cloud.getOverlappingClouds4Cloud()
        : [];

      this.showEl = true;
    },

    onClickOutSide() {
      this.showEl = false;
    },

    handleClick() {
      this.showEl = false;
    },

    handleClickCopy(e) {
      if (!this.hasTarget || this.isLock) {
        e.stopPropagation();
        return;
      }

      this.$sky.cloud.copy();
    },

    handleClickCut(e) {
      if (!this.hasTarget || this.isLock) {
        e.stopPropagation();
        return;
      }

      this.$sky.cloud.cut();
    },

    handleClickPaste(e) {
      if (!this.skyState.clipboard) {
        e.stopPropagation();
        return;
      }

      this.$sky.cloud.paste();
    },

    handleClickLock() {
      if (this.isLock) {
        this.$sky.cloud.unlock();
      } else {
        this.$sky.cloud.lock();
      }
    },

    handleClickMove(key, e) {
      e.stopPropagation();

      if (this.disableMoveup) {
        if (['moveTop', 'moveUp'].includes(key)) return;
      }

      if (this.disableMovedown) {
        if (['moveBottom', 'moveDown'].includes(key)) return;
      }

      this.$sky.cloud[key]();

      this.overlappingClouds4Cloud = this.$sky.cloud.getOverlappingClouds4Cloud();
    },

    handleClickSelectCloud(cloud) {
      this.$sky.moveable.setTarget([
        this.$sky.cloud.queryCloudElementById(cloud.id),
      ]);
    },

    handleClickDelete() {
      if (this.isLock) return;

      this.$sky.cloud.delete();
    },
  },
};
</script>

<style lang="scss" scoped>
.editor-contextmenu {
  z-index: 3000;
  @apply fixed w-48 py-2 text-sm rounded bg-white shadow cursor-default select-none;

  &__subtitle {
    @apply text-gray-400 text-xs;
  }

  &__item {
    @apply relative flex justify-between items-center h-9 px-4;

    &.disabled {
      @apply text-gray-400 cursor-not-allowed;

      &:hover {
        @apply bg-white;
      }
    }

    &:hover {
      @apply bg-gray-100;
    }

    &-parent {
      &::after {
        content: '';
        @apply border-4 border-r-0 border-transparent border-solid;
        border-right-width: 0;
        border-left-width: 6px;
        border-left-color: rgba(156, 163, 175, var(--tw-border-opacity));
      }

      .editor-contextmenu {
        @apply invisible;
      }

      &:hover {
        .editor-contextmenu {
          @apply visible;
        }
      }
    }

    &--overlapping {
      @apply h-14;
    }

    .editor-contextmenu {
      @apply absolute -bottom-2 w-44 ml-44;
    }

    .editor-contextmenu--left {
      @apply -ml-48;
    }
  }

  &__delimiter {
    @apply border-t border-gray-200 border-solid my-1;
  }
}
</style>
