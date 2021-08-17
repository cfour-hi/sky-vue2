import { CloudText } from './type';

export const toProxyCloud = (clouds: CloudText[]) => {
  const [cloud0] = clouds;
  if (clouds.length === 1) return cloud0;

  const proxyCloud = { ...cloud0 };
  const isSameValue = (key: string) =>
    clouds.map(cloud => cloud[key] === cloud0[key]);

  if (isSameValue('fontWeight')) proxyCloud.fontWeight = cloud0.fontWeight;
  if (isSameValue('fontStyle')) proxyCloud.fontStyle = cloud0.fontStyle;

  return new Proxy(proxyCloud, {
    get(target, key) {
      return Reflect.get(target, key);
    },

    set(target, key, value) {
      if (key === 'fontWeight') {
        clouds.forEach(cloud => {
          cloud[key] = value;
        });
      }
      return Reflect.set(target, key, value);
    },
  });
};
