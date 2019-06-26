declare var Quill: any;

const BlockEmbed = Quill.import('blots/block/embed');

class IconBlot extends BlockEmbed {
  static create(value: any) {
    const node = super.create();
    node.setAttribute('class', value.class);
    node.setAttribute('id', value.id);
    node.setAttribute('data-id', value['data-id']);
    return node;
  }

  static value(node: any) {
    return {
      class: node.getAttribute('class'),
      id: node.getAttribute('id'),
      'data-id': node.getAttribute('data-id')
    };
  }
}

IconBlot.blotName = 'i';
IconBlot.tagName = 'i';

export default IconBlot;
