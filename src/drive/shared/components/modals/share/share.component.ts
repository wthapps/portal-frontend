import { Component, OnInit, ViewChild } from '@angular/core';
import { BsModalComponent } from 'ng2-bs3-modal';
import { WModalsShareService } from './share.service';

@Component({
  selector: 'shared-modals-share',
  templateUrl: './share.component.html',
  styleUrls: ['./share.component.scss']
})
export class WModalsShareComponent implements OnInit {
  @ViewChild('modal') modal: BsModalComponent;
  role: any = { name: 'view' };
  roles: any = [];

  updatedUsers: any = [];
  deletedUsers: any = [];
  sharedUsers: any;

  constructor(private shareService: WModalsShareService) {
  }

  ngOnInit() {
    this.sharedUsers = this.deleteMe();
  }

  async getRoles(moduleName: string) {
    const data = await this.shareService.getRoles(moduleName).toPromise();
    this.roles = data.data.sort((a, b) => a.id - b.id);
    this.role = this.roles[0];
  }

  get updating(): boolean {
    return (this.updatedUsers.length + this.deletedUsers.length) > 0;
  }

  deleteMe() {
    return [
      {
        'id': 322,
        'recipient_id': 13,
        'recipient_type': 'User',
        'sharing_id': 227,
        'created_at': '2019-01-18T10:44:24.666Z',
        'updated_at': '2019-01-18T10:44:24.666Z',
        'deleted': false,
        'deleted_at': '2018-05-31T07:11:56.083Z',
        'role_id': 1,
        'user': {
          'id': 13,
          'name': 'An Vo',
          'uuid': 'edf297aa-92ef-4d50-98cb-8c56a662cae7',
          'profile_image': 'https://cdn-apps-test.wthapps.com/users/edf297aa-92ef-4d50-98cb-8c56a662cae7/photos/profile/profile_anvo_1530694435.jpg',
          'cover_image': 'https://cdn-apps-test.wthapps.com/system/thumbnails/user_default.png',
          'email': 'anvo@gmail.com',
          'phone_number': ''
        },
        'role': {
          'id': 1,
          'uuid': '71ff7e78-7b62-405e-a95d-22ed7f55e6ac',
          'name': 'view',
          'display_name': 'Can view',
          'module_name': 'Media',
          'capabilities': {
            'canView': true,
            'canFave': true,
            'canDownload': false,
            'canShare': false,
            'canTag': false,
            'canEdit': false,
            'canDelete': false
          },
          'created_at': '2018-05-31T07:13:15.832Z',
          'updated_at': '2018-09-24T07:45:11.812Z',
          'active': true
        },
        'model': 'Common::SharingRecipient'
      }, {
        'id': 323,
        'recipient_id': 3,
        'recipient_type': 'User',
        'sharing_id': 227,
        'created_at': '2019-01-18T10:44:24.748Z',
        'updated_at': '2019-01-18T10:44:24.748Z',
        'deleted': false,
        'deleted_at': '2018-05-31T07:11:56.083Z',
        'role_id': 1,
        'user': {
          'id': 3,
          'name': 'Teo Tung',
          'uuid': 'e98b208e-a127-4ae0-9a38-caf9f763c6f0',
          'profile_image': 'https://cdn-apps-test.wthapps.com/system/thumbnails/user_default.png',
          'cover_image': 'https://cdn-apps-test.wthapps.com/system/thumbnails/user_default.png',
          'email': 'teotung@yahoo.com',
          'phone_number': ''
        },
        'role': {
          'id': 1,
          'uuid': '71ff7e78-7b62-405e-a95d-22ed7f55e6ac',
          'name': 'view',
          'display_name': 'Can view',
          'module_name': 'Media',
          'capabilities': {
            'canView': true,
            'canFave': true,
            'canDownload': false,
            'canShare': false,
            'canTag': false,
            'canEdit': false,
            'canDelete': false
          },
          'created_at': '2018-05-31T07:13:15.832Z',
          'updated_at': '2018-09-24T07:45:11.812Z',
          'active': true
        },
        'model': 'Common::SharingRecipient'
      }, {
        'id': 324,
        'recipient_id': 61,
        'recipient_type': 'User',
        'sharing_id': 227,
        'created_at': '2019-01-18T10:44:24.796Z',
        'updated_at': '2019-01-18T10:44:24.796Z',
        'deleted': false,
        'deleted_at': '2018-05-31T07:11:56.083Z',
        'role_id': 1,
        'user': {
          'id': 61,
          'name': '180919 edge',
          'uuid': '9ebc2778-315c-409e-a2e4-726c913d6bac',
          'profile_image': 'https://cdn-apps-test.wthapps.com/system/thumbnails/user_default.png',
          'cover_image': 'https://cdn-apps-test.wthapps.com/system/thumbnails/user_default.png',
          'email': 'edge180919@yopmail.com',
          'phone_number': ''
        },
        'role': {
          'id': 1,
          'uuid': '71ff7e78-7b62-405e-a95d-22ed7f55e6ac',
          'name': 'view',
          'display_name': 'Can view',
          'module_name': 'Media',
          'capabilities': {
            'canView': true,
            'canFave': true,
            'canDownload': false,
            'canShare': false,
            'canTag': false,
            'canEdit': false,
            'canDelete': false
          },
          'created_at': '2018-05-31T07:13:15.832Z',
          'updated_at': '2018-09-24T07:45:11.812Z',
          'active': true
        },
        'model': 'Common::SharingRecipient'
      }, {
        'id': 325,
        'recipient_id': 64,
        'recipient_type': 'User',
        'sharing_id': 227,
        'created_at': '2019-01-18T10:44:24.840Z',
        'updated_at': '2019-01-18T10:44:24.840Z',
        'deleted': false,
        'deleted_at': '2018-05-31T07:11:56.083Z',
        'role_id': 1,
        'user': {
          'id': 64,
          'name': '180919 opera',
          'uuid': 'c406daa0-6b68-4d51-8684-2e81923fa41e',
          'profile_image': 'https://cdn-apps-test.wthapps.com/system/thumbnails/user_default.png',
          'cover_image': 'https://cdn-apps-test.wthapps.com/system/thumbnails/user_default.png',
          'email': 'op180919@yopmail.net',
          'phone_number': ''
        },
        'role': {
          'id': 1,
          'uuid': '71ff7e78-7b62-405e-a95d-22ed7f55e6ac',
          'name': 'view',
          'display_name': 'Can view',
          'module_name': 'Media',
          'capabilities': {
            'canView': true,
            'canFave': true,
            'canDownload': false,
            'canShare': false,
            'canTag': false,
            'canEdit': false,
            'canDelete': false
          },
          'created_at': '2018-05-31T07:13:15.832Z',
          'updated_at': '2018-09-24T07:45:11.812Z',
          'active': true
        },
        'model': 'Common::SharingRecipient'
      }, {
        'id': 326,
        'recipient_id': 12,
        'recipient_type': 'User',
        'sharing_id': 227,
        'created_at': '2019-01-18T10:44:24.881Z',
        'updated_at': '2019-01-18T10:44:24.881Z',
        'deleted': false,
        'deleted_at': '2018-05-31T07:11:56.083Z',
        'role_id': 1,
        'user': {
          'id': 12,
          'name': 'Albert Vo',
          'uuid': 'ebf3bf09-858b-43df-8153-8dd4689db0a5',
          'profile_image': 'https://cdn-apps-test.wthapps.com/users/ebf3bf09-858b-43df-8153-8dd4689db0a5/photos/profile/profile_albertvo_1530785540.jpg',
          'cover_image': 'https://cdn-apps-test.wthapps.com/system/thumbnails/user_default.png',
          'email': 'albert@wthapps.com',
          'phone_number': ''
        },
        'role': {
          'id': 1,
          'uuid': '71ff7e78-7b62-405e-a95d-22ed7f55e6ac',
          'name': 'view',
          'display_name': 'Can view',
          'module_name': 'Media',
          'capabilities': {
            'canView': true,
            'canFave': true,
            'canDownload': false,
            'canShare': false,
            'canTag': false,
            'canEdit': false,
            'canDelete': false
          },
          'created_at': '2018-05-31T07:13:15.832Z',
          'updated_at': '2018-09-24T07:45:11.812Z',
          'active': true
        },
        'model': 'Common::SharingRecipient'
      }, {
        'id': 327,
        'recipient_id': 51,
        'recipient_type': 'User',
        'sharing_id': 227,
        'created_at': '2019-01-18T10:44:24.924Z',
        'updated_at': '2019-01-18T10:44:24.924Z',
        'deleted': false,
        'deleted_at': '2018-05-31T07:11:56.083Z',
        'role_id': 1,
        'user': {
          'id': 51,
          'name': 'Subscription & Billing Administration',
          'uuid': '8e208ba8-3227-40e3-b8f0-1c18fc277516',
          'profile_image': 'https://cdn-apps-test.wthapps.com/users/8e208ba8-3227-40e3-b8f0-1c18fc277516/photos/profile/profile_nghiatran_1542958923.jpg',
          'cover_image': 'https://cdn-apps-test.wthapps.com/system/thumbnails/user_default.png',
          'email': 'trungnghia112@yahoo.com',
          'phone_number': ''
        },
        'role': {
          'id': 1,
          'uuid': '71ff7e78-7b62-405e-a95d-22ed7f55e6ac',
          'name': 'view',
          'display_name': 'Can view',
          'module_name': 'Media',
          'capabilities': {
            'canView': true,
            'canFave': true,
            'canDownload': false,
            'canShare': false,
            'canTag': false,
            'canEdit': false,
            'canDelete': false
          },
          'created_at': '2018-05-31T07:13:15.832Z',
          'updated_at': '2018-09-24T07:45:11.812Z',
          'active': true
        },
        'model': 'Common::SharingRecipient'
      }, {
        'id': 328,
        'recipient_id': 111,
        'recipient_type': 'User',
        'sharing_id': 227,
        'created_at': '2019-01-18T10:44:24.964Z',
        'updated_at': '2019-01-18T10:44:24.964Z',
        'deleted': false,
        'deleted_at': '2018-05-31T07:11:56.083Z',
        'role_id': 1,
        'user': {
          'id': 111,
          'name': '181101 safari Adolph Blaine Charles David Earl Frederick Gerald Hubert Irvin John Kenneth Lloyd Martin Nero Oliver Paul Quincy Randolph Sherman Thomas Uncas Victor William Xerxes Yancy Wolfeschlegelsteinhausenbergerdorff, Senior',
          'uuid': '6ce144aa-2874-42cb-a261-3b59b0b764e4',
          'profile_image': 'https://cdn-apps-test.wthapps.com/system/thumbnails/user_default.png',
          'cover_image': 'https://cdn-apps-test.wthapps.com/system/thumbnails/user_default.png',
          'email': 'sa181101@yopmail.com',
          'phone_number': ''
        },
        'role': {
          'id': 1,
          'uuid': '71ff7e78-7b62-405e-a95d-22ed7f55e6ac',
          'name': 'view',
          'display_name': 'Can view',
          'module_name': 'Media',
          'capabilities': {
            'canView': true,
            'canFave': true,
            'canDownload': false,
            'canShare': false,
            'canTag': false,
            'canEdit': false,
            'canDelete': false
          },
          'created_at': '2018-05-31T07:13:15.832Z',
          'updated_at': '2018-09-24T07:45:11.812Z',
          'active': true
        },
        'model': 'Common::SharingRecipient'
      }, {
        'id': 329,
        'recipient_id': 44,
        'recipient_type': 'User',
        'sharing_id': 227,
        'created_at': '2019-01-18T10:44:25.005Z',
        'updated_at': '2019-01-18T10:44:25.005Z',
        'deleted': false,
        'deleted_at': '2018-05-31T07:11:56.083Z',
        'role_id': 1,
        'user': {
          'id': 44,
          'name': 'yen bui',
          'uuid': '4aef1777-f303-4365-a4f4-353aabdf6424',
          'profile_image': 'https://cdn-apps-test.wthapps.com/users/4aef1777-f303-4365-a4f4-353aabdf6424/photos/profile/profile_yenbui_1538713592.jpg',
          'cover_image': 'https://cdn-apps-test.wthapps.com/system/thumbnails/user_default.png',
          'email': 'yenbui0112@gmail.com',
          'phone_number': ''
        },
        'role': {
          'id': 1,
          'uuid': '71ff7e78-7b62-405e-a95d-22ed7f55e6ac',
          'name': 'view',
          'display_name': 'Can view',
          'module_name': 'Media',
          'capabilities': {
            'canView': true,
            'canFave': true,
            'canDownload': false,
            'canShare': false,
            'canTag': false,
            'canEdit': false,
            'canDelete': false
          },
          'created_at': '2018-05-31T07:13:15.832Z',
          'updated_at': '2018-09-24T07:45:11.812Z',
          'active': true
        },
        'model': 'Common::SharingRecipient'
      }, {
        'id': 330,
        'recipient_id': 79,
        'recipient_type': 'User',
        'sharing_id': 227,
        'created_at': '2019-01-18T10:44:25.047Z',
        'updated_at': '2019-01-18T10:44:25.047Z',
        'deleted': false,
        'deleted_at': '2018-05-31T07:11:56.083Z',
        'role_id': 1,
        'user': {
          'id': 79,
          'name': 'Chrome mobile 181002',
          'uuid': '30909d17-fdf5-48f1-b1c5-6f1417ee5474',
          'profile_image': 'https://cdn-apps-test.wthapps.com/users/30909d17-fdf5-48f1-b1c5-6f1417ee5474/photos/profile/profile_chrome mobile181002_1538534830.jpg',
          'cover_image': 'https://cdn-apps-test.wthapps.com/system/thumbnails/user_default.png',
          'email': 'chm181002@yopmail.com',
          'phone_number': '906868601'
        },
        'role': {
          'id': 1,
          'uuid': '71ff7e78-7b62-405e-a95d-22ed7f55e6ac',
          'name': 'view',
          'display_name': 'Can view',
          'module_name': 'Media',
          'capabilities': {
            'canView': true,
            'canFave': true,
            'canDownload': false,
            'canShare': false,
            'canTag': false,
            'canEdit': false,
            'canDelete': false
          },
          'created_at': '2018-05-31T07:13:15.832Z',
          'updated_at': '2018-09-24T07:45:11.812Z',
          'active': true
        },
        'model': 'Common::SharingRecipient'
      }, {
        'id': 331,
        'recipient_id': 11,
        'recipient_type': 'User',
        'sharing_id': 227,
        'created_at': '2019-01-18T10:44:25.096Z',
        'updated_at': '2019-01-18T10:44:25.096Z',
        'deleted': false,
        'deleted_at': '2018-05-31T07:11:56.083Z',
        'role_id': 1,
        'user': {
          'id': 11,
          'name': 'Mobile Chromeee',
          'uuid': 'a6af6629-bc9b-4faf-9e96-240e270b45b9',
          'profile_image': 'https://cdn-apps-test.wthapps.com/users/a6af6629-bc9b-4faf-9e96-240e270b45b9/photos/profile/profile_mobilechrome_1531811823.jpg',
          'cover_image': 'https://cdn-apps-test.wthapps.com/system/thumbnails/user_default.png',
          'email': 'mobile_chrome@yopmail.com',
          'phone_number': ''
        },
        'role': {
          'id': 1,
          'uuid': '71ff7e78-7b62-405e-a95d-22ed7f55e6ac',
          'name': 'view',
          'display_name': 'Can view',
          'module_name': 'Media',
          'capabilities': {
            'canView': true,
            'canFave': true,
            'canDownload': false,
            'canShare': false,
            'canTag': false,
            'canEdit': false,
            'canDelete': false
          },
          'created_at': '2018-05-31T07:13:15.832Z',
          'updated_at': '2018-09-24T07:45:11.812Z',
          'active': true
        },
        'model': 'Common::SharingRecipient'
      }, {
        'id': 332,
        'recipient_id': 7,
        'recipient_type': 'User',
        'sharing_id': 227,
        'created_at': '2019-01-18T10:44:25.138Z',
        'updated_at': '2019-01-18T10:44:25.138Z',
        'deleted': false,
        'deleted_at': '2018-05-31T07:11:56.083Z',
        'role_id': 1,
        'user': {
          'id': 7,
          'name': 'Teo Firefox',
          'uuid': '11fdd697-7231-49d8-b186-a1636e366451',
          'profile_image': 'https://cdn-apps-test.wthapps.com/system/thumbnails/user_default.png',
          'cover_image': 'https://cdn-apps-test.wthapps.com/system/thumbnails/user_default.png',
          'email': 'teo_firefox@yopmail.com',
          'phone_number': ''
        },
        'role': {
          'id': 1,
          'uuid': '71ff7e78-7b62-405e-a95d-22ed7f55e6ac',
          'name': 'view',
          'display_name': 'Can view',
          'module_name': 'Media',
          'capabilities': {
            'canView': true,
            'canFave': true,
            'canDownload': false,
            'canShare': false,
            'canTag': false,
            'canEdit': false,
            'canDelete': false
          },
          'created_at': '2018-05-31T07:13:15.832Z',
          'updated_at': '2018-09-24T07:45:11.812Z',
          'active': true
        },
        'model': 'Common::SharingRecipient'
      }, {
        'id': 333,
        'recipient_id': 5,
        'recipient_type': 'User',
        'sharing_id': 227,
        'created_at': '2019-01-18T10:44:25.182Z',
        'updated_at': '2019-01-18T10:44:25.182Z',
        'deleted': false,
        'deleted_at': '2018-05-31T07:11:56.083Z',
        'role_id': 1,
        'user': {
          'id': 5,
          'name': 'Teo Khung',
          'uuid': 'a8eda8a4-2d8c-4a8f-a433-c35fc12c2786',
          'profile_image': 'https://cdn-apps-test.wthapps.com/users/a8eda8a4-2d8c-4a8f-a433-c35fc12c2786/photos/profile/profile_teokhung_1530514678.jpg',
          'cover_image': 'https://cdn-apps-test.wthapps.com/system/thumbnails/user_default.png',
          'email': 'teo180702@yopmail.com',
          'phone_number': ' '
        },
        'role': {
          'id': 1,
          'uuid': '71ff7e78-7b62-405e-a95d-22ed7f55e6ac',
          'name': 'view',
          'display_name': 'Can view',
          'module_name': 'Media',
          'capabilities': {
            'canView': true,
            'canFave': true,
            'canDownload': false,
            'canShare': false,
            'canTag': false,
            'canEdit': false,
            'canDelete': false
          },
          'created_at': '2018-05-31T07:13:15.832Z',
          'updated_at': '2018-09-24T07:45:11.812Z',
          'active': true
        },
        'model': 'Common::SharingRecipient'
      }, {
        'id': 334,
        'recipient_id': 82,
        'recipient_type': 'User',
        'sharing_id': 227,
        'created_at': '2019-01-18T10:44:25.227Z',
        'updated_at': '2019-01-18T10:44:25.227Z',
        'deleted': false,
        'deleted_at': '2018-05-31T07:11:56.083Z',
        'role_id': 1,
        'user': {
          'id': 82,
          'name': 'opera 181002',
          'uuid': 'c484da67-c419-46d0-8211-ec2d364fb0b4',
          'profile_image': 'https://cdn-apps-test.wthapps.com/system/thumbnails/user_default.png',
          'cover_image': 'https://cdn-apps-test.wthapps.com/system/thumbnails/user_default.png',
          'email': 'op181002@yopmail.com',
          'phone_number': ''
        },
        'role': {
          'id': 1,
          'uuid': '71ff7e78-7b62-405e-a95d-22ed7f55e6ac',
          'name': 'view',
          'display_name': 'Can view',
          'module_name': 'Media',
          'capabilities': {
            'canView': true,
            'canFave': true,
            'canDownload': false,
            'canShare': false,
            'canTag': false,
            'canEdit': false,
            'canDelete': false
          },
          'created_at': '2018-05-31T07:13:15.832Z',
          'updated_at': '2018-09-24T07:45:11.812Z',
          'active': true
        },
        'model': 'Common::SharingRecipient'
      }, {
        'id': 335,
        'recipient_id': 8,
        'recipient_type': 'User',
        'sharing_id': 227,
        'created_at': '2019-01-18T10:44:25.270Z',
        'updated_at': '2019-01-18T10:44:25.270Z',
        'deleted': false,
        'deleted_at': '2018-05-31T07:11:56.083Z',
        'role_id': 1,
        'user': {
          'id': 8,
          'name': 'teo chrome',
          'uuid': 'fb56d8ed-6147-493f-ba5b-cd33faee1b1d',
          'profile_image': 'https://cdn-apps-test.wthapps.com/system/thumbnails/user_default.png',
          'cover_image': 'https://cdn-apps-test.wthapps.com/system/thumbnails/user_default.png',
          'email': 'teo_chrome@yopmail.com',
          'phone_number': ''
        },
        'role': {
          'id': 1,
          'uuid': '71ff7e78-7b62-405e-a95d-22ed7f55e6ac',
          'name': 'view',
          'display_name': 'Can view',
          'module_name': 'Media',
          'capabilities': {
            'canView': true,
            'canFave': true,
            'canDownload': false,
            'canShare': false,
            'canTag': false,
            'canEdit': false,
            'canDelete': false
          },
          'created_at': '2018-05-31T07:13:15.832Z',
          'updated_at': '2018-09-24T07:45:11.812Z',
          'active': true
        },
        'model': 'Common::SharingRecipient'
      }, {
        'id': 336,
        'recipient_id': 9,
        'recipient_type': 'User',
        'sharing_id': 227,
        'created_at': '2019-01-18T10:44:25.304Z',
        'updated_at': '2019-01-18T10:44:25.304Z',
        'deleted': false,
        'deleted_at': '2018-05-31T07:11:56.083Z',
        'role_id': 1,
        'user': {
          'id': 9,
          'name': 'teo edge',
          'uuid': '97867592-dcb1-4436-a4af-172b5724e35e',
          'profile_image': 'https://cdn-apps-test.wthapps.com/users/97867592-dcb1-4436-a4af-172b5724e35e/photos/profile/profile_teoedge_1530520672.jpg',
          'cover_image': 'https://cdn-apps-test.wthapps.com/system/thumbnails/user_default.png',
          'email': 'teo_edge@yopmail.com',
          'phone_number': ''
        },
        'role': {
          'id': 1,
          'uuid': '71ff7e78-7b62-405e-a95d-22ed7f55e6ac',
          'name': 'view',
          'display_name': 'Can view',
          'module_name': 'Media',
          'capabilities': {
            'canView': true,
            'canFave': true,
            'canDownload': false,
            'canShare': false,
            'canTag': false,
            'canEdit': false,
            'canDelete': false
          },
          'created_at': '2018-05-31T07:13:15.832Z',
          'updated_at': '2018-09-24T07:45:11.812Z',
          'active': true
        },
        'model': 'Common::SharingRecipient'
      }, {
        'id': 337,
        'recipient_id': 18,
        'recipient_type': 'User',
        'sharing_id': 227,
        'created_at': '2019-01-18T10:44:25.341Z',
        'updated_at': '2019-01-18T10:44:25.341Z',
        'deleted': false,
        'deleted_at': '2018-05-31T07:11:56.083Z',
        'role_id': 1,
        'user': {
          'id': 18,
          'name': 'teo edge 180709',
          'uuid': '4acbe845-d05c-4237-9230-0a6b1795cfd3',
          'profile_image': 'https://cdn-apps-test.wthapps.com/system/thumbnails/user_default.png',
          'cover_image': 'https://cdn-apps-test.wthapps.com/system/thumbnails/user_default.png',
          'email': 'teo_edge_180709@yopmail.com',
          'phone_number': '909999333'
        },
        'role': {
          'id': 1,
          'uuid': '71ff7e78-7b62-405e-a95d-22ed7f55e6ac',
          'name': 'view',
          'display_name': 'Can view',
          'module_name': 'Media',
          'capabilities': {
            'canView': true,
            'canFave': true,
            'canDownload': false,
            'canShare': false,
            'canTag': false,
            'canEdit': false,
            'canDelete': false
          },
          'created_at': '2018-05-31T07:13:15.832Z',
          'updated_at': '2018-09-24T07:45:11.812Z',
          'active': true
        },
        'model': 'Common::SharingRecipient'
      }, {
        'id': 338,
        'recipient_id': 17,
        'recipient_type': 'User',
        'sharing_id': 227,
        'created_at': '2019-01-18T10:44:25.375Z',
        'updated_at': '2019-01-18T10:44:25.375Z',
        'deleted': false,
        'deleted_at': '2018-05-31T07:11:56.083Z',
        'role_id': 1,
        'user': {
          'id': 17,
          'name': 'teo firefox 180709',
          'uuid': '1f95435f-ecad-4bf6-88ce-cc1598f3cfe6',
          'profile_image': 'https://cdn-apps-test.wthapps.com/system/thumbnails/user_default.png',
          'cover_image': 'https://cdn-apps-test.wthapps.com/system/thumbnails/user_default.png',
          'email': 'teo_firefox_180709@yopmail.com',
          'phone_number': ''
        },
        'role': {
          'id': 1,
          'uuid': '71ff7e78-7b62-405e-a95d-22ed7f55e6ac',
          'name': 'view',
          'display_name': 'Can view',
          'module_name': 'Media',
          'capabilities': {
            'canView': true,
            'canFave': true,
            'canDownload': false,
            'canShare': false,
            'canTag': false,
            'canEdit': false,
            'canDelete': false
          },
          'created_at': '2018-05-31T07:13:15.832Z',
          'updated_at': '2018-09-24T07:45:11.812Z',
          'active': true
        },
        'model': 'Common::SharingRecipient'
      }, {
        'id': 339,
        'recipient_id': 4,
        'recipient_type': 'User',
        'sharing_id': 227,
        'created_at': '2019-01-18T10:44:25.416Z',
        'updated_at': '2019-01-18T10:44:25.416Z',
        'deleted': false,
        'deleted_at': '2018-05-31T07:11:56.083Z',
        'role_id': 1,
        'user': {
          'id': 4,
          'name': 'teo tung',
          'uuid': 'd981aacc-31cc-4c60-acec-17fabfc80edd',
          'profile_image': 'https://cdn-apps-test.wthapps.com/system/thumbnails/user_default.png',
          'cover_image': 'https://cdn-apps-test.wthapps.com/system/thumbnails/user_default.png',
          'email': 'teotung2@yahoo.com',
          'phone_number': ''
        },
        'role': {
          'id': 1,
          'uuid': '71ff7e78-7b62-405e-a95d-22ed7f55e6ac',
          'name': 'view',
          'display_name': 'Can view',
          'module_name': 'Media',
          'capabilities': {
            'canView': true,
            'canFave': true,
            'canDownload': false,
            'canShare': false,
            'canTag': false,
            'canEdit': false,
            'canDelete': false
          },
          'created_at': '2018-05-31T07:13:15.832Z',
          'updated_at': '2018-09-24T07:45:11.812Z',
          'active': true
        },
        'model': 'Common::SharingRecipient'
      }, {
        'id': 340,
        'recipient_id': 71,
        'recipient_type': 'User',
        'sharing_id': 227,
        'created_at': '2019-01-18T10:44:25.456Z',
        'updated_at': '2019-01-18T10:44:25.456Z',
        'deleted': false,
        'deleted_at': '2018-05-31T07:11:56.083Z',
        'role_id': 1,
        'user': {
          'id': 71,
          'name': 'thinh huynh firefox',
          'uuid': '1a7d2fa0-3d2f-48bc-81e5-f38fbf75078c',
          'profile_image': 'https://cdn-apps-test.wthapps.com/system/thumbnails/user_default.png',
          'cover_image': 'https://cdn-apps-test.wthapps.com/system/thumbnails/user_default.png',
          'email': 'thinhhdfirefox@yahoo.com',
          'phone_number': ''
        },
        'role': {
          'id': 1,
          'uuid': '71ff7e78-7b62-405e-a95d-22ed7f55e6ac',
          'name': 'view',
          'display_name': 'Can view',
          'module_name': 'Media',
          'capabilities': {
            'canView': true,
            'canFave': true,
            'canDownload': false,
            'canShare': false,
            'canTag': false,
            'canEdit': false,
            'canDelete': false
          },
          'created_at': '2018-05-31T07:13:15.832Z',
          'updated_at': '2018-09-24T07:45:11.812Z',
          'active': true
        },
        'model': 'Common::SharingRecipient'
      }, {
        'id': 341,
        'recipient_id': 70,
        'recipient_type': 'User',
        'sharing_id': 227,
        'created_at': '2019-01-18T10:44:25.492Z',
        'updated_at': '2019-01-18T10:44:25.492Z',
        'deleted': false,
        'deleted_at': '2018-05-31T07:11:56.083Z',
        'role_id': 1,
        'user': {
          'id': 70,
          'name': 'thinh huynh safari',
          'uuid': '1f5e3182-71f5-42dd-a172-a78213c1bbf1',
          'profile_image': 'https://cdn-apps-test.wthapps.com/system/thumbnails/user_default.png',
          'cover_image': 'https://cdn-apps-test.wthapps.com/system/thumbnails/user_default.png',
          'email': 'thinhhdsafari@yahoo.com',
          'phone_number': ''
        },
        'role': {
          'id': 1,
          'uuid': '71ff7e78-7b62-405e-a95d-22ed7f55e6ac',
          'name': 'view',
          'display_name': 'Can view',
          'module_name': 'Media',
          'capabilities': {
            'canView': true,
            'canFave': true,
            'canDownload': false,
            'canShare': false,
            'canTag': false,
            'canEdit': false,
            'canDelete': false
          },
          'created_at': '2018-05-31T07:13:15.832Z',
          'updated_at': '2018-09-24T07:45:11.812Z',
          'active': true
        },
        'model': 'Common::SharingRecipient'
      }, {
        'id': 342,
        'recipient_id': 72,
        'recipient_type': 'User',
        'sharing_id': 227,
        'created_at': '2019-01-18T10:44:25.568Z',
        'updated_at': '2019-01-18T10:44:25.568Z',
        'deleted': false,
        'deleted_at': '2018-05-31T07:11:56.083Z',
        'role_id': 1,
        'user': {
          'id': 72,
          'name': 'thinhhdsub',
          'uuid': 'cd3c7f84-ac48-4b5d-86f0-9aed49df868e',
          'profile_image': 'https://cdn-apps-test.wthapps.com/system/thumbnails/user_default.png',
          'cover_image': 'https://cdn-apps-test.wthapps.com/system/thumbnails/user_default.png',
          'email': 'thinhhdfirefoxsub@yahoo.com',
          'phone_number': ''
        },
        'role': {
          'id': 1,
          'uuid': '71ff7e78-7b62-405e-a95d-22ed7f55e6ac',
          'name': 'view',
          'display_name': 'Can view',
          'module_name': 'Media',
          'capabilities': {
            'canView': true,
            'canFave': true,
            'canDownload': false,
            'canShare': false,
            'canTag': false,
            'canEdit': false,
            'canDelete': false
          },
          'created_at': '2018-05-31T07:13:15.832Z',
          'updated_at': '2018-09-24T07:45:11.812Z',
          'active': true
        },
        'model': 'Common::SharingRecipient'
      }, {
        'id': 343,
        'recipient_id': 19,
        'recipient_type': 'User',
        'sharing_id': 227,
        'created_at': '2019-01-18T10:44:25.603Z',
        'updated_at': '2019-01-18T10:44:25.603Z',
        'deleted': false,
        'deleted_at': '2018-05-31T07:11:56.083Z',
        'role_id': 1,
        'user': {
          'id': 19,
          'name': 'ty chrome 180710',
          'uuid': 'c98cf6d3-fec3-4201-8c5c-57ab9a5ffd20',
          'profile_image': 'https://cdn-apps-test.wthapps.com/users/c98cf6d3-fec3-4201-8c5c-57ab9a5ffd20/photos/simpson_(1).gif',
          'cover_image': 'https://cdn-apps-test.wthapps.com/system/thumbnails/user_default.png',
          'email': 'ty_chrome_180710@yopmail.com',
          'phone_number': ''
        },
        'role': {
          'id': 1,
          'uuid': '71ff7e78-7b62-405e-a95d-22ed7f55e6ac',
          'name': 'view',
          'display_name': 'Can view',
          'module_name': 'Media',
          'capabilities': {
            'canView': true,
            'canFave': true,
            'canDownload': false,
            'canShare': false,
            'canTag': false,
            'canEdit': false,
            'canDelete': false
          },
          'created_at': '2018-05-31T07:13:15.832Z',
          'updated_at': '2018-09-24T07:45:11.812Z',
          'active': true
        },
        'model': 'Common::SharingRecipient'
      }, {
        'id': 344,
        'recipient_id': 14,
        'recipient_type': 'User',
        'sharing_id': 227,
        'created_at': '2019-01-18T10:44:25.636Z',
        'updated_at': '2019-01-18T10:44:25.636Z',
        'deleted': false,
        'deleted_at': '2018-05-31T07:11:56.083Z',
        'role_id': 1,
        'user': {
          'id': 14,
          'name': 'ty firefox',
          'uuid': '89236a2d-791b-41b3-8d99-4ae30c701801',
          'profile_image': 'https://cdn-apps-test.wthapps.com/system/thumbnails/user_default.png',
          'cover_image': 'https://cdn-apps-test.wthapps.com/system/thumbnails/user_default.png',
          'email': 'ty_firefox@yopmail.com',
          'phone_number': ''
        },
        'role': {
          'id': 1,
          'uuid': '71ff7e78-7b62-405e-a95d-22ed7f55e6ac',
          'name': 'view',
          'display_name': 'Can view',
          'module_name': 'Media',
          'capabilities': {
            'canView': true,
            'canFave': true,
            'canDownload': false,
            'canShare': false,
            'canTag': false,
            'canEdit': false,
            'canDelete': false
          },
          'created_at': '2018-05-31T07:13:15.832Z',
          'updated_at': '2018-09-24T07:45:11.812Z',
          'active': true
        },
        'model': 'Common::SharingRecipient'
      }, {
        'id': 345,
        'recipient_id': 16,
        'recipient_type': 'User',
        'sharing_id': 227,
        'created_at': '2019-01-18T10:44:25.672Z',
        'updated_at': '2019-01-18T10:44:25.672Z',
        'deleted': false,
        'deleted_at': '2018-05-31T07:11:56.083Z',
        'role_id': 1,
        'user': {
          'id': 16,
          'name': 'ty_chrome 060718',
          'uuid': 'f010df52-736d-470e-bf8c-4d22e8a0cc5e',
          'profile_image': 'https://cdn-apps-test.wthapps.com/system/thumbnails/user_default.png',
          'cover_image': 'https://cdn-apps-test.wthapps.com/system/thumbnails/user_default.png',
          'email': 'ty_chrome_060718@yopmail.com',
          'phone_number': ''
        },
        'role': {
          'id': 1,
          'uuid': '71ff7e78-7b62-405e-a95d-22ed7f55e6ac',
          'name': 'view',
          'display_name': 'Can view',
          'module_name': 'Media',
          'capabilities': {
            'canView': true,
            'canFave': true,
            'canDownload': false,
            'canShare': false,
            'canTag': false,
            'canEdit': false,
            'canDelete': false
          },
          'created_at': '2018-05-31T07:13:15.832Z',
          'updated_at': '2018-09-24T07:45:11.812Z',
          'active': true
        },
        'model': 'Common::SharingRecipient'
      }
    ];
  }
}
