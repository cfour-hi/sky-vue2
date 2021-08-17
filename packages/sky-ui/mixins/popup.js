export default {
  watch: {
    visible(value) {
      if (!value) return;

      this.mountEl = this.$parent.$el;
      while (this.mountEl && !Reflect.has(this.mountEl.dataset, 'skyPopup')) {
        this.mountEl = this.mountEl.parentElement;
      }
      if (!this.mountEl) return;

      const { top, left, width, height } = this.mountEl.getBoundingClientRect();
      this.$el.style.top = `${top + height}px`;

      // + width / 2
      // 方便 transform: translateX(-50%) 居中
      this.$el.style.left = `${left + width / 2}px`;
    },
  },

  mounted() {
    let mousedown = false;

    this.onMousedown4PopupMixin = () => (mousedown = true);

    this.onMouseup4PopupMixin = () => {
      if (mousedown) {
        mousedown = false;
        return;
      }

      if (this.visible) {
        // 使用 setTimeout 保证 close 在 click 之后执行
        // 其它 DOM 可能绑定了 click 事件切换 popup 的 显示/隐藏 状态
        setTimeout(() => {
          this.$emit('update:visible', false);
          this.$emit('close');
        });
      }
    };

    this.$el.addEventListener('mousedown', this.onMousedown4PopupMixin);
    document.addEventListener('mouseup', this.onMouseup4PopupMixin);
  },

  destroyed() {
    this.$el.removeEventListener('mousedown', this.onMousedown4PopupMixin);
    document.removeEventListener('mouseup', this.onMouseup4PopupMixin);
  },
};
