import { Config } from './env.config';

let getBarwidth = function () {
  // Create the measurement node
  let scrollDiv = document.createElement('div');
  scrollDiv.className = 'scrollbar-measure';
  document.body.appendChild(scrollDiv);

  // Get the scrollbar width
  let scrollbarWidth = scrollDiv.offsetWidth - scrollDiv.clientWidth;
  //console.warn(scrollbarWidth); // Mac:  15

  // Delete the DIV
  document.body.removeChild(scrollDiv);
  return scrollbarWidth;
};

export let Constants = {
  baseUrls: {
    apiBaseService: Config.PROTOCOL + '://' + Config.API + '/',
    domain: Config.DOMAIN,
    app: Config.PROTOCOL + '://' + Config.DOMAIN,
    myAccount: Config.SUB_DOMAIN.FE_MYACCOUNT,
    zone: Config.PROTOCOL + '://zone.' + Config.DOMAIN
  },
  operations: {
    update: 'update',
    edit: 'edit',
    delete: 'delete',
    create: 'create',
    continue: 'continue'
  },
  params: {
    next: 'next'
  },
  string: {
    next: 'next'
  },
  HttpStatusCode: {
    OK: 200,
    NotFound: 404,
    InternalServerError: 200,
    Created: 201,
    Conflict: 409,
    ExpectationFailed: 417,
    PaymentRequired: 402
  },
  errorMessage: {
    default: 'Internal Server Error'
  },
  patterns: {
    slash: '/',
    space: '%20'
  },
  img: {
    app: '/assets/images/apps/default.png',
    avatar: '/assets/images/avatar/default.png',
    logo: '/assets/images/logo.png',
    logoWhite: '/assets/images/logo-white.png',
    logoZone: '/assets/images/logo-zone.png',
    logoZoneWhite: '/assets/images/logo-zone-white.png',
  },
  windows: {
    scrollBarWidth: getBarwidth()
  },

  chatMenuItems: [
    {name: 'Conversation', link: '/chat/conversation/dashboard'},
    {name: 'Contact', link: '/chat/contact'},
    {name: 'History', link: '/chat/history'},
    {name: 'Settings', link: '/chat/setting'}
  ],

  pictureMenuItems: [
    {name: 'Photos', link: '/photo'},
    {name: 'Albums', link: '/album'},
    {name: 'Favourites', link: '/favourites'},
    {name: 'Shared with me', link: '/sharedWithMe'}
  ],

  socialMenuItems: [
    {name: 'Home', link: '/home'},
    {name: 'Communities', link: '/communities'},
    {name: 'Notifications', link: '/notifications'},
    {name: 'Members', link: '/members'},
    {name: 'My Page', link: '/profile'},
    {name: 'Settings', link: '/setting'},
  ],

  pictureMenuActions: {
    preview: true,
    share: true,
    addFavourite: true,
    tag: true,
    delete: true,
    other: true,
  },
  urls: {
    zoneSoPosts: 'zone/social_network/posts',
    zoneSoComments: 'zone/social_network/comments',
    zoneSoMyPosts: 'zone/social_network/my_posts',
    zoneSoUserPosts: 'zone/social_network/user_posts',
    zoneSoReactions: 'zone/social_network/reactions',
    zoneSoPostSettings: 'zone/social_network/post_settings',
  },
  sex: ['', 'Male', 'Female', 'Other'],
  communityRole: {
    admin: [1, 'Admin'],
    member: [2, 'Member']
  },
  notificationSetting: {
    limit: 10
  },
  seenStatus: {
    new: 'new',
    seen: 'seen',
    seen_and_took_action: 'seen_and_took_action'
  }
};

export let MediaType = {
  photo: 'photo',
  album: 'album',
  albumDetail: 'albumDetail',
  video: 'video',
  playlist: 'playlist',
  favourites: 'favourites',
  sharedWithMe: 'sharedWithMe'
};


