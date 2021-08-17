import 'css-font-loading-module';
interface PSDClass {
  fromEvent: (event: Event) => Promise<unknown>;
}

declare const PSD: PSDClass;
