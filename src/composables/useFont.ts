import { reactive, toRefs } from '@vue/composition-api';
import { Cloud } from '@packages/sky/editor/plugins/cloud';
import { CloudText } from '@/components/clouds/text/type';
import { getFonts } from '@/api/gaoding';
import { isSupportFontFamily, downloadFont } from '@/utils/font';

export interface Font {
  name: string;
  content: {
    woff: string;
  };
}

interface State {
  fonts: Font[];
}

const state: State = reactive({
  fonts: [],
});

export const initFonts = async () => {
  const localFonts = localStorage.getItem('SKY_FONTS');
  state.fonts = localFonts ? JSON.parse(localFonts) : [];

  // TODO: 策略
  if (state.fonts.length > 0) return;

  for (let i = 1; i < 99; i += 1) {
    const res = await getFonts(i);
    state.fonts.push(...res);
    if (res.length < 100) break;
  }

  localStorage.setItem('SKY_FONTS', JSON.stringify(state.fonts));
};

export const downloadNonLocalFont = (clouds: Cloud[]) => {
  clouds.forEach(cloud => {
    if (cloud.type !== 'text') return;

    const { fontFamily } = cloud as CloudText;

    // TODO: 多字体处理
    const [fontFamily0] = fontFamily;
    if (isSupportFontFamily(fontFamily0)) return;

    const font = state.fonts.find(f => f.name === fontFamily0);
    if (!font) {
      fontFamily.unshift('SourceHanSansSC-Regular');
      return;
    }

    downloadFont(font.name, font.content.woff);
  });
};

const useFont = () => {
  return {
    ...toRefs(state),
    initFonts,
    downloadNonLocalFont,
  };
};

export default useFont;
