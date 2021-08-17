import { Cloud } from '@packages/sky/editor/plugins/cloud';

export interface CloudText extends Cloud {
  fontFamily: string[];
  fontSize: number;
  textAlign: string;
  color: number[];
  textDecoration: string;
  writingMode: string;
  fontWeight: string;
  fontStyle: string;
}
