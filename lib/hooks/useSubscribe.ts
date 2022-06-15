export const useSubscribe = (eventName: any, callback: () => void) => {
  (window as any).rhEmitter.on(eventName, callback);
};

export const useSubscribeOnce = (eventName: any, callback: () => void) => {
  (window as any).rhEmitter.once(eventName, callback);
};
