import normalzeCSS from 'normalize.css';
import cloudImageCSS from '@/components/clouds/image/index.css';
import cloudTextCSS from '@/components/clouds/text/index.css';
import { rendererCSSText } from '@packages/sky/renderer/index';
import skyEditor from '@/plugins/use-sky-editor';
import { downloadFonts, generateFontStyle } from '@/composables/useFont';
import { CloudText } from '@/types/cloud';

function compression(str: string) {
  return str.replace(/\n+/g, '').replace(/\/\*.+?\*\//g, '');
}

// 视情况确定是否需要 normalize.css
const svgCSSTxt =
  compression(normalzeCSS.toString()) +
  compression(cloudImageCSS.toString()) +
  compression(cloudTextCSS.toString()) +
  compression(rendererCSSText);

function toFontCssText() {
  let text = '';
  const textClouds = skyEditor.sky.state.clouds.filter(
    cloud => cloud.type === 'text',
  );
  const fontnames = [
    ...new Set(textClouds.map(cloud => (cloud as CloudText).fontFamily[0])),
  ];
  fontnames.forEach(name => {
    text += generateFontStyle(name, downloadFonts[name]).outerHTML;
  });
  return text;
}

export default function dom2Svg() {
  // const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
  // svg.setAttribute('xmlns', 'http://www.w3.org/2000/svg');
  // svg.setAttribute('width', el.clientWidth);
  // svg.setAttribute('height', el.clientHeight);

  // const style = document.createElement('style');
  // style.innerText = svgCSSTxt;

  // const foreighObject = document.createElementNS(
  //   'http://www.w3.org/2000/svg',
  //   'foreignObject',
  // );
  // foreighObject.setAttribute('x', 0);
  // foreighObject.setAttribute('y', 0);
  // foreighObject.setAttribute('width', '100%');
  // foreighObject.setAttribute('height', '100%');
  // foreighObject.innerHTML = new XMLSerializer().serializeToString(
  //   el.cloneNode(true),
  // );

  // svg.appendChild(style);
  // svg.appendChild(foreighObject);

  // return svg;

  const el = document.querySelector('.sky-renderer') as HTMLElement;
  const html = new XMLSerializer().serializeToString(el.cloneNode(true));

  // prettier-ignore
  return `<svg xmlns='http://www.w3.org/2000/svg' width='${el.clientWidth}' height='${el.clientHeight}'><style>${svgCSSTxt}</style>${toFontCssText()}<foreignObject x='0' y='0' width='100%' height='100%'>${html}</foreignObject></svg>`;
}

export function svg2Blob(svg: string) {
  return new Blob([svg], { type: 'image/svg+xml;charset=utf-8' });
}

export function svg2ImageBlob(svg: string) {
  return new Promise(resolve => {
    const el = document.querySelector('.sky-renderer') as HTMLElement;
    const canvas = document.createElement('canvas');
    canvas.width = el.clientWidth;
    canvas.height = el.clientHeight;
    const ctx = canvas.getContext('2d') as CanvasRenderingContext2D;

    const img = new Image();
    img.onload = () => {
      ctx.drawImage(img, 0, 0);
      canvas.toBlob(blob => {
        resolve(blob);

        img.remove();
        canvas.remove();
      });
    };
    img.src = `data:image/svg+xml;charset=utf-8,${encodeURIComponent(svg)}`;
  });
}

export function downloadBlob(
  blob: Blob,
  { filename = Date.now().toString() } = {},
) {
  if (navigator && navigator.msSaveOrOpenBlob) {
    return navigator.msSaveOrOpenBlob(blob);
  }

  // For other browsers:
  // Create a link pointing to the ObjectURL containing the blob.
  const blobURL = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = blobURL;
  link.download = filename;

  // this is necessary as link.click() does not work on the latest firefox
  link.dispatchEvent(
    new MouseEvent('click', {
      bubbles: true,
      cancelable: true,
      view: window,
    }),
  );

  setTimeout(() => {
    // For Firefox it is necessary to delay revoking the ObjectURL
    URL.revokeObjectURL(blobURL);
    link.remove();
  }, 100);
}
