const throttleDelay = 16;

export default function useThrottle<T extends (...args: any[]) => void>(
  toRun: T,
) {
  return throttle((...args: Parameters<T>) => {
    toRun(...args);
  }, throttleDelay);
}

const throttle = (func: Function, limit: number) => {
  let lastFunc: number;
  let lastRan: number;
  return function (this: any, ...args: any[]) {
    if (!lastRan) {
      func.apply(this, args);
      lastRan = Date.now();
    } else {
      clearTimeout(lastFunc);
      lastFunc = window.setTimeout(
        () => {
          if (Date.now() - lastRan >= limit) {
            func.apply(this, args);
            lastRan = Date.now();
          }
        },
        limit - (Date.now() - lastRan),
      );
    }
  };
};
