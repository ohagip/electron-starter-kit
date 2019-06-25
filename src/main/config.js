import Store from 'electron-store';

export default new Store({
  name: 'config',
  defaults: {
    windowBounds: {
      width: 800,
      height: 600,
    }
  }
});