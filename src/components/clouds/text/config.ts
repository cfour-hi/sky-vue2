// import { Cloud } from '@packages/sky/editor/plugins/cloud';
import { skyEditor } from '@/plugins/use-sky-editor';
import { CLOUD_TYPE } from '@/constants';

export interface TextItem {
  children: { text: string; fontWeight?: number; color?: number[] }[];
}

export interface CloudTextPrivate {
  fontFamily: string[];
  fontSize: number;
  textAlign: string;
  color: string;
  textDecoration: string;
  writingMode: string;
  fontWeight: string | number;
  fontStyle: string;
  lineHeight: number;
  shadows: Record<string, unknown>[];
  strokes: Record<string, unknown>[];
  text: string;
  texts: TextItem[];
  type: string;
  letterSpacing: number;
  [propsName: string]: unknown;
}

export const addTextCloud = (props = {}) => {
  const { scale } = skyEditor.sky.state;
  const textCloud: CloudTextPrivate = {
    fontFamily: ['SourceHanSansSC-Regular'],
    fontSize: 60,
    textAlign: 'left',
    color: `#000000ff`,
    textDecoration: 'none',
    writingMode: '',
    fontWeight: 400,
    fontStyle: 'normal',
    lineHeight: 1,
    letterSpacing: 0,
    shadows: [],
    strokes: [],
    text: '点击编辑文字',
    texts: [
      {
        children: [{ text: '点击编辑文字' }],
      },
    ],
    // texts: [{ text: '点击编辑文字' }],
    type: CLOUD_TYPE.text,
    width: 360 * scale,
    height: 60 * scale,
    ...props,
  };

  skyEditor.sky.cloud.push(skyEditor.sky.cloud.create(textCloud));
};
