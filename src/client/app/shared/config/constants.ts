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
    // apiBaseService: 'http://54.213.41.54:4000/',
    apiBaseService: Config.API
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

  chatMenuItems : [
    { name: 'Conversation', link: '/zone/chat/conversation' },
    { name: 'Contact', link: '/zone/chat/contact' },
    { name: 'History', link: '/zone/chat/history' },
    { name: 'Settings', link: '/zone/chat/setting' }
  ],

  pictureMenuItems : [
    { name: 'Photos', link: '/zone/media/photo' },
    { name: 'Albums', link: '/zone/media/album' },
    { name: 'Favourites', link: '/zone/media/favourites' },
    { name: 'Shared with me', link: '/zone/media/sharedWithMe' } //,
    /*{ name: 'Photos', link: '/zone/picture/photo' },
    { name: 'Albums', link: '/zone/picture/album' },
    // { name: 'Videos', link: '/zone/picture/video' },
    { name: 'Favorites', link: '/zone/picture/favourites' },
    { name: 'Shared with me', link: '/zone/picture/sharedWithMe' },*/
  ],

  socialMenuItems : [
    { name: 'Home', link: '/zone/social/home' },
    { name: 'Communities', link: '/zone/social/communities' },
    { name: 'Notifications', link: '/zone/social/notifications' },
    { name: 'Members', link: '/zone/social/members' },
    { name: 'My Page', link: '/zone/social/profile' },
    { name: 'Settings', link: '/zone/social/setting' },
  ],

  pictureMenuActions : {
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
  sex : ['', 'Male', 'Female', 'Other']
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


