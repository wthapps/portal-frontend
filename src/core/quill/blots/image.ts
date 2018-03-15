
declare var Quill: any;

let BlockEmbed = Quill.import('blots/block/embed');

class ImageBlot extends BlockEmbed {
  static create(value: any) {
    let node = super.create();
    node.setAttribute('alt', value.alt);
    node.setAttribute('src', value.url);
    node.setAttribute('id', value.id);
    node.setAttribute('data-id', value['data-id']);
    node.setAttribute('style', value.style);
    return node;
  }

  static value(node: any) {
    return {
      alt: node.getAttribute('alt'),
      url: node.getAttribute('src'),
      id: node.getAttribute('id'),
      'data-id': node.getAttribute('data-id'),
      style: node.getAttribute('style')
    };
  }

}

ImageBlot.blotName = 'image';
ImageBlot.tagName = 'img';

export default ImageBlot;
