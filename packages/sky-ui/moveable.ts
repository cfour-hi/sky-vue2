import { toNumber } from './tool';

interface Position {
  x: number;
  y: number;
}

interface RegisterMoveablePanelOptions {
  onmousedown?(position: Position): void;
  onmousemove?(position: Position): void;
  onmouseup?(position: Position): void;
}

export const registerMoveableElement = (
  el: HTMLElement,
  { onmousedown, onmousemove, onmouseup }: RegisterMoveablePanelOptions = {},
) => {
  let elRect = el.getBoundingClientRect();
  const position = { x: 0, y: 0 };

  const update = (event: MouseEvent) => {
    let dx = event.pageX - elRect.x;
    let dy = event.pageY - elRect.y;

    if (dx < 0) dx = 0;
    if (dx > elRect.width) dx = elRect.width;
    if (dy < 0) dy = 0;
    if (dy > elRect.height) dy = elRect.height;

    position.x = toNumber(dx / elRect.width, { decimal: 2 });
    position.y = toNumber(dy / elRect.height, { decimal: 2 });
  };

  const _onmousemove = (event: MouseEvent) => {
    update(event);

    if (onmousemove) {
      onmousemove(position);
    }
  };

  const _onmouseup = () => {
    document.removeEventListener('mousemove', _onmousemove);
    document.removeEventListener('mouseup', _onmouseup);

    if (onmouseup) {
      onmouseup(position);
    }
  };

  const _onmousedown = (event: MouseEvent) => {
    // elRect 可能不准确，这里更新一下
    elRect = el.getBoundingClientRect();

    update(event);

    document.addEventListener('mousemove', _onmousemove);
    document.addEventListener('mouseup', _onmouseup);

    if (onmousedown) {
      onmousedown(position);
    }
  };

  el.addEventListener('mousedown', _onmousedown);

  return {
    destroy() {
      el.removeEventListener('mousedown', _onmousedown);
    },
  };
};
