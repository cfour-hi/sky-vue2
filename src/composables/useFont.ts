import { reactive, toRefs } from '@vue/composition-api';
import { CloudText } from '@/components/clouds/text/type';
import { getFonts } from '@/api/gaoding';
import { isSupportFontFamily } from '@/utils/font';
import { blob2B64 } from '@/utils/dataer';
import skyEditor from '@/plugins/use-sky-editor';

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

// 以 base64 的格式存储字体
export const downloadFonts: {
  [propname: string]: any;
} = {};

export const initFonts = async () => {
  const localFonts = localStorage.getItem('SKY_FONTS');
  state.fonts = localFonts ? JSON.parse(localFonts) : [];

  if (state.fonts.length === 0) {
    for (let i = 1; i < 99; i += 1) {
      const res = await getFonts(i);
      state.fonts.push(...res);
      if (res.length < 100) break;
    }
  }

  localStorage.setItem('SKY_FONTS', JSON.stringify(state.fonts));

  skyEditor.sky.state.clouds.forEach(async cloud => {
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

    if (Reflect.has(downloadFonts, fontFamily0)) {
      return;
    }

    await addFont2Style(font.name, font.content.woff);
  });
};

export const addFont2Style = async (name: string, url: string) => {
  if (downloadFonts[name]) return;

  const response = await fetch(url, { headers: { responseType: 'blob' } });
  const blob = await response.blob();
  const b64 = await blob2B64(blob);
  downloadFonts[name] = b64;

  const ff = new FontFace(name, `url(${URL.createObjectURL(blob)})`);
  const f = await ff.load();
  document.fonts.add(f);

  document.head.appendChild(generateFontStyle(name, b64));
};

export function generateFontStyle(name: string, url: string): HTMLStyleElement {
  const el = document.createElement('style');
  el.id = name;
  el.classList.add('font-face');
  el.innerHTML = `@font-face { font-family: "${name}"; src: local("${name}"), url("${url}"); }`;
  return el;
}

const useFont = () => {
  return {
    ...toRefs(state),
    initFonts,
  };
};

export default useFont;
