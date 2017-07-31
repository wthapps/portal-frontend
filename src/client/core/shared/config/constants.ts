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
    apiBaseService: Config.API + '/',
    domain: Config.DOMAIN,
    app: Config.SUB_DOMAIN.APP,
    myAccount: Config.SUB_DOMAIN.MYACCOUNT,
    media: Config.SUB_DOMAIN.MEDIA,
    social: Config.SUB_DOMAIN.SOCIAL,
    chat: Config.SUB_DOMAIN.CHAT,
    contact: Config.SUB_DOMAIN.CONTACT
  },

  flagsRelease: false,

  cookieOptionsArgs: {
    path: '/',
    domain: Config.DOMAIN,
    expires: new Date('2030-07-19')
  },
  cookieKeys: {
    chatSupportId: 'wthapps-cs-id',
    chatSupportMemId: 'wthapps-cs-mem-id',
    chatSupportCurrentWindow: 'wthapps-cs-cw',
    clientToken: 'wthapps-ct',
    profile: 'wthapps-pro',
    payment: 'wthapps-pm'
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

  contactMenuItems: [
    {name: 'All Contact', link: '/list', icon: 'fa fa-address-book-o', hasMenu: false},
    {name: '', link: '', icon: ''},
    {name: 'Labels', link: '/list/labels', icon: 'fa fa-tags'},
    {name: 'Favourites (2)', link: '/list/favourites', icon: 'fa fa-star'},
    {name: 'Social (5)', link: '/list/social', icon: 'fa fa-globe'},
    {name: 'Chat (2)', link: '/list/chat', icon: 'fa fa-comments-o'},
    {name: 'Custom label 01 (1)', link: '/list/custom-label-01', icon: 'fa fa-folder-o visibility-hidden'},
    {name: 'Custom label 01 (2)', link: '/list/custom-label-02', icon: 'fa fa-folder-o visibility-hidden'},
    {name: 'Blacklist', link: '/list/blacklist', icon: 'fa fa-ban'},
    {name: 'New label', link: '#', icon: 'fa fa-plus', action: 'contact:label:create'}
  ],

  chatMenuItems: [
    {name: 'Conversations', link: '/conversations', icon: 'fa fa-comments-o'},
    {name: 'Contacts', link: '/contacts', icon: 'fa fa-address-book-o'},
    {name: '', link: '', icon: ''},
    {name: 'Settings', link: '/setting', icon: 'fa fa-cog'}
  ],

  pictureMenuItems: [
    {name: 'Photos', link: '/photos', icon: 'fa fa-photo'},
    {name: 'Albums', link: '/albums', icon: 'fa fa-file-photo-o'},
    {name: 'Favourites', link: '/favourites', icon: 'fa fa-star'},
    {name: 'Shared with me', link: '/shared-with-me', icon: 'fa fa-share-alt'},
    {name: 'Search', link: '/search', icon: 'fa fa-search'}
  ],

  socialMenuItems: [
    {name: 'Home', link: '/home', icon: 'fa fa-home'},
    {name: 'Communities', link: '/communities', icon: 'fa fa-users'},
    {name: 'Notifications', link: '/notifications', icon: 'fa fa-bell-o'},
    {name: 'Friends', link: '/friends', icon: 'fa fa-user-plus'},
    {name: 'My Page', link: '/profile', icon: 'fa fa-user-circle'},
    {name: '', link: '', icon: ''},
    {name: 'Settings', link: '/settings', icon: 'fa fa-cog'},
    {name: 'Search', link: '/search', icon: 'fa fa-search'}
  ],

  pictureMenuActions: {
    preview: true,
    share: true,
    addFavourite: true,
    tag: true,
    delete: true,
    other: true,
  },

  mediaSliderViewNumber: {
    min: 2,
    default: 8,
    max: 12
  },

  urls: {
    afterLogin: Config.SUB_DOMAIN.SOCIAL,
    zoneSoPosts: 'zone/social_network/posts',
    zoneSoComments: 'zone/social_network/comments',
    zoneSoMyPosts: 'zone/social_network/my_posts',
    zoneSoUserPosts: 'zone/social_network/user_posts',
    zoneSoReactions: 'zone/social_network/reactions',
    zoneSoPostSettings: 'zone/social_network/post_settings',
    communities: 'communities',
    zoneSoCommunities: 'zone/social_network/communities',
    zoneSoUsers: 'zone/social_network/users',
    zoneSoInvitations: 'zone/social_network/invitations',
    zoneSoFavourites: 'zone/social_network/favourites',
    zoneSoNotifications: 'zone/social_network/notifications',
    zoneSoReportList: 'zone/social_network/report_list',
    zoneSoProfile: 'zone/social_network/profile',
    zoneSoPhotos: 'zone/social_network/photos',
    soFriendUrl: 'zone/social_network/friends',
    zonePhotos: 'media/photos',
    posts: 'posts',
    profile: 'profile',
    album: 'album',
    photo: 'photo',
    chatConversation: 'conversations',
    contacts: 'contact/contacts'
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
  },
  soPostPrivacy: {
    public: {css: 'fa fa-globe', text: 'Public', data: 'public'},
    personal: {css: 'fa fa-lock', text: 'personal', data: 'personal'},
    private: {css: 'fa fa-lock', text: 'private', data: 'private'},
    friends: {css: 'fa fa-users', text: 'Friends', data: 'friends'},
    customFriend: {css: 'fa fa-user-times', text: 'Custom Friends', data: 'custom_friend'},
    customCommunity: {css: 'fa fa-group', text: 'Custom Community', data: 'custom_community'},
    unknown: {css: '', text: '', data: ''}
  },
  soPostListType: {
    userOnly: 'user_only',
    strangeUser: 'strange_user',
    friend: 'friend',
    community: 'community',
    userAndFriend: 'user_and_friend',
    randomUser: 'random_user',
    public: 'public'
  },
  soCommunityPrivacy: {
    open: {name: 'open'},
    close: {name: 'close'}
  },
  soCommunityReportEntity: {
    user: 1,
    community: 2
  },
  soCommunityUserStatus: {
    member: 1,
    joinRequestSent: 2,
    stranger: 3
  },

  friendStatus: {
    pending: 1,
    accepted: 2,
    rejected: 3,
    unfriend: 4,
    blocked: 5,
    stranger: 99
  },

  soPostLimit: 10,
  soCommentLimit: 20,

  searchDebounceTime: 250,


  search: {
    config: {
      globalActive: true,
      photoActive: true,
      socialActive: true,
      chatActive: true,
      contactActive: true,
    }
  },

  mediaListDetailTypeMapping: {
    'photos': 'photo',
    'albums': 'album',
    'favorites': 'mix',
    'shared-with-me': 'mix'
  },
  mediaPageType: {
    photos: 'photos',
    search: 'search',
    sharedWithMe: 'shared-with-me',
    favorites: 'favorites',
    albums: 'albums',
    album_detail: 'album_detail'
  },

  emailType: [
    {
      category: 'work',
      name: 'Work'
    },
    {
      category: 'personal',
      name: 'Personal'
    },
    {
      category: 'other',
      name: 'Other'
    },
  ],
  phoneType: [
    {
      category: 'mobile',
      name: 'Mobile'
    },
    {
      category: 'fax',
      name: 'Fax'
    },
    {
      category: 'other',
      name: 'Other'
    },
  ],
  phoneCategories: [
    {value: 'mobile', text: 'Mobile'},
    {value: 'home', text: 'Home'},
    {value: 'work', text: 'Work'},
    {value: 'main', text: 'Main'},
    {value: 'fax', text: 'Fax'},
    {value: 'other', text: 'Other'}
  ],
  emailCategories: [
    {value: 'work', text: 'Work'},
    {value: 'home', text: 'Home'},
    {value: 'other', text: 'Other'}
  ],
  addressCategories: [
    {value: 'work', text: 'Work'},
    {value: 'home', text: 'Home'},
    {value: 'other', text: 'Other'}
  ],
  mediaCategories: [
    {value: 'wthapps', text: 'WTHApps'},
    {value: 'facebook', text: 'Facebook'},
    {value: 'googleplus', text: 'Google Plus'},
    {value: 'twitter', text: 'Twitter'},
    {value: 'other', text: 'Other'}
  ]
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

