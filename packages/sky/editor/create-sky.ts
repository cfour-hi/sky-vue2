import Vue, { VueConstructor } from 'vue';
import createEditor, { EditorPlugin } from './plugins/editor';
import createCloud, { Cloud, CloudPlugin } from './plugins/cloud';
import createMoveable, { MoveablePlugin } from './plugins/moveable';
import createSelecto, { SelectoPlugin } from './plugins/selecto';
import createHistory, { HistoryPlugin } from './plugins/history';
import { restoreSize } from '../tool';

export interface CreateSkyOptions {
  maxHistoryStack?: number;
  ControlPanelContainer?: VueConstructor<Vue>;
  components?: {
    [propsName: string]: VueConstructor<Vue>;
  };
  initMousetrap?(sky: Sky): void;
  selectoContainer: string;
}

export interface BackgroundState {
  image: string;
  color: number[];
  opacity: number;
}

export interface SkyState {
  width: number;
  height: number;
  scale: number;
  background: BackgroundState;
  clouds: Cloud[];
  targetClouds: Cloud[];
  selectCloud: Cloud | null;
  clipboard: string;
}

export interface Sky {
  options: CreateSkyOptions;
  vm: Vue;
  state: SkyState;
  editor: EditorPlugin;
  cloud: CloudPlugin;
  moveable: MoveablePlugin;
  selecto: SelectoPlugin;
  history: HistoryPlugin;
  setVM(vm: Vue): void;
  getState(): SkyState;
  setState(state: SkyState): void;
}

const createState = (module: Sky) => {
  return new Proxy(
    {
      width: 800,
      height: 800,
      scale: 1,
      background: {
        image: '',
        color: [255, 255, 255, 1],
        opacity: 1,
      },
      clouds: [],
      targetClouds: [],
      selectCloud: null,
      clipboard: '',
    },
    {
      get(target, key) {
        return Reflect.get(target, key);
      },
      set(target, key, value) {
        if (key === 'width') {
          module.moveable.instance.verticalGuidelines = [0, value];
        } else if (key === 'height') {
          module.moveable.instance.horizontalGuidelines = [0, value];
        } else if (key === 'scale') {
          module.editor.zoom(value);
        } else if (key === 'clouds') {
          // 设置 clouds 等于重置
          module.moveable.setTarget([]);
        }
        return Reflect.set(target, key, value);
      },
    },
  );
};

export default function createSky(options: CreateSkyOptions) {
  options = { maxHistoryStack: 20, ...options };

  const module: Sky = ({ options, vm: null } as unknown) as Sky;

  module.state = createState(module);
  module.editor = createEditor(module);
  module.cloud = createCloud(module);
  module.moveable = createMoveable(module);
  module.selecto = createSelecto(module);
  module.history = createHistory(module);

  // 获取画布未缩放的数据
  module.getState = () => {
    return Object.assign({}, module.state, {
      width: restoreSize(module.state.width, module.state.scale),
      height: restoreSize(module.state.height, module.state.scale),
      clouds: module.cloud.getClouds(),
    });
  };

  options.initMousetrap?.(module);

  return module;
}
