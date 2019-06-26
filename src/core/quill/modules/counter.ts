import { BaseModule } from '@wth/core/quill/modules/base-module';

export class Counter extends BaseModule {
  container: any;

  constructor(quill, options) {
    super(quill, options);

    this.container = document.querySelector(options.container);
    quill.on('text-change', this.update.bind(this));
    this.update(); // Account for initial contents
  }

  calculate() {
    const text = this.quill.getText();
    return Counter.count(text, this.options.unit);
  }

  update() {
    const length = this.calculate();
    let label = this.options.unit;
    if (length !== 1) {
      label += 's';
    }
    this.container.innerText = length + ' ' + label;
  }

  static count(text, unit = 'word') {
    if (unit === 'word') {
      text = text.trim();
      // Splitting empty text returns a non-empty array
      return text.length > 0 ? text.split(/\s+/).length : 0;
    } else {
      return text.length;
    }
  }
}
