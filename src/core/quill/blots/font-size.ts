declare var Quill: any;
let Font = Quill.import('formats/font');
Font.whitelist = ['gotham', 'georgia', 'helvetica', 'courier-new', 'times-new-roman', 'trebuchet', 'verdana'];

let Size = Quill.import('attributors/style/size');
Size.whitelist = [
  '8px', '10px', '12px', '14px', '18px', '24px', '36px'
];


export { Font, Size };
