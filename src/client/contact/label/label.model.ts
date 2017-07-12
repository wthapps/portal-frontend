export class Label {
  id: number;
  uuid: string;
  name: string;
  system: boolean;
  created_by: any;
  updated_by: any;
  user_id?: number;
  user?: any;
  contact_count?: number;

  convertToMenuItem(): any {
    console.log('this object', this);
    return {
      testing: 'abcdeeee'
      // id: this.id,
      // name: this.name,
      // icon: 'all contact' ? 'fa-address-book-o'
      //       : this.name == 'favourite' ? 'fa fa-star'
      //         : this.name == 'labels' ? 'fa fa-tags'
      //           : this.name == 'blacklist' ? 'fa fa-ban'
      //             : this.name == 'social' ? 'fa fa-globe'
      //               : this.name == 'chat' ? 'fa fa-comments-o'
      //                 :'fa fa-folder-o visibility-hidden',
      // hasMenu: true,
      // link: '/list'
    };
  }
}
