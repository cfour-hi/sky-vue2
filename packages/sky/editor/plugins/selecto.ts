import { Sky } from '@packages/sky/editor/create-sky';
import Selecto, { OnDragStart, OnSelect } from 'selecto';
import { getElementInfo } from 'moveable';

export interface SelectoPlugin {
  createInstance(): void;
  instance: Selecto;
}

export default function createSelecto(sky: Sky) {
  const module: SelectoPlugin = ({
    instance: null,
  } as unknown) as SelectoPlugin;

  let flogMousemove = false;

  const onMousemove = () => {
    flogMousemove = true;
    sky.moveable.setTarget([]);
  };

  const onMouseup = () => {
    if (!flogMousemove) {
      sky.moveable.setTarget([]);
    }
    flogMousemove = false;
  };

  const onDragStart = (event: OnDragStart) => {
    const moveableControlBox = document.querySelector('.moveable-control-box');
    const skyControlPanel = document.querySelector('.sky-control-panel');

    if (
      moveableControlBox?.contains(event.inputEvent.target) ||
      skyControlPanel?.contains(event.inputEvent.target)
    ) {
      return event.stop();
    }

    document.addEventListener('mousemove', onMousemove, { once: true });
    document.addEventListener('mouseup', onMouseup, { once: true });
  };

  const onSelect = (event: OnSelect) => {
    sky.moveable.setTarget([...event.selected] as HTMLElement[]);
  };

  const onSelectEnd = () => {
    document.removeEventListener('mousemove', onMousemove);
    document.removeEventListener('mousemove', onMouseup);
  };

  module.createInstance = () => {
    const container = (document.querySelector(sky.options.selectoContainer) ??
      sky.vm.$el) as HTMLElement;

    module.instance = new Selecto({
      container,
      selectableTargets: ['.sky-cloud'],
      selectByClick: false,
      selectFromInside: false,
      hitRate: 0,
      getElementRect: getElementInfo,
    });

    module.instance.on('dragStart', onDragStart);
    module.instance.on('select', onSelect);
    module.instance.on('selectEnd', onSelectEnd);
  };

  return new Proxy(module, {
    get(target, key) {
      if (Reflect.has(target, key)) {
        return Reflect.get(target, key);
      }
      return Reflect.get(module.instance, key);
    },

    set(target, key, value) {
      if (Reflect.has(target, key)) {
        Reflect.set(target, key, value);
      } else {
        Reflect.set(target.instance, key, value);
      }
      return true;
    },
  });
}
