export const MediaListMixin = (superclass) => class extends superclass {
  foo() {
    console.log('foo from MediaListMixin');
  }
};
