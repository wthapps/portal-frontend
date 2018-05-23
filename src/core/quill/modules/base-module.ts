export class BaseModule {
  quill: any;
  options: any;
  constructor(quill, options = {}) {
    this.quill = quill;
    this.options = options;
  }
}

