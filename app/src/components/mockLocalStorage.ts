// storage.ts
const storage = (typeof window !== 'undefined')
  ? window.localStorage
  : {
      getItem: () => null,
      setItem: () => {},
      removeItem: () => {},
      clear: () => {}
    };

export default storage;

  