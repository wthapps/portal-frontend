import { Config } from './env.config';
export class ConstantsBase {
  baseUrls: any = {
    apiUrl: Config.API + '/',
    domain: Config.DOMAIN,
    app: Config.SUB_DOMAIN.APP,
    myAccount: Config.SUB_DOMAIN.MYACCOUNT,
    media: Config.SUB_DOMAIN.MEDIA,
    social: Config.SUB_DOMAIN.SOCIAL,
    chat: Config.SUB_DOMAIN.CHAT,
    contact: Config.SUB_DOMAIN.CONTACT,
    note: Config.SUB_DOMAIN.NOTE,
    cdn: Config.CDN
  };
  cdn: any = Config.CDN;
  currentVersion = '2018 WTHApps - v1.10.0';
  useDefaultPage: any = true;
  flagsRelease: any = false;

  cookieOptionsArgs: any = {
    path: '/',
    domain: Config.DOMAIN
  };

  cookieKeys: any = {
    chatSupportId: 'wthapps-cs-id',
    chatSupportCurrentWindow: 'wthapps-cs-cw',
    clientToken: 'wthapps-ct',
    profile: this.getKeyByEnv('profile'),
    loggedIn: this.getKeyByEnv('logged_in'),
    jwt: this.getKeyByEnv('jwt'),
    payment: 'wthapps-pm'
  };
  operations: any = {
    update: 'update',
    edit: 'edit',
    delete: 'delete',
    create: 'create',
    continue: 'continue'
  };
  params: any = {
    next: 'next'
  };
  string: any = {
    next: 'next'
  };
  HttpStatusCode: any = {
    OK: 200,
    NotFound: 404,
    InternalServerError: 200,
    Created: 201,
    Conflict: 409,
    NotAcceptable: 406,
    ExpectationFailed: 417,
    PaymentRequired: 402
  };
  errorMessage: any = {
    default: 'Internal Server Error'
  };
  patterns: any = {
    slash: '/',
    space: '%20'
  };
  img: any = {
    app: '/assets/images/apps/default.png',
    avatar: '/assets/images/avatar/default.png',
    logo: '/assets/images/logo.png',
    logoWhite: '/assets/images/logo-white.png',
    logoZone: '/assets/images/logo-zone.png',
    logoZoneWhite: '/assets/images/logo-zone-white.png',
    default: '/assets/images/thumbnail/image_default.png'
  };
  windows: any = {
    scrollBarWidth: () => {
      // Create the measurement node
      const scrollDiv = document.createElement('div');
      scrollDiv.className = 'scrollbar-measure';
      document.body.appendChild(scrollDiv);

      // Get the scrollbar width
      const scrollbarWidth = scrollDiv.offsetWidth - scrollDiv.clientWidth;
      // console.warn(scrollbarWidth); // Mac:  15

      // Delete the DIV
      document.body.removeChild(scrollDiv);
      return scrollbarWidth;
    }
  };

  noteMenuItems: any = [
    {
      name: 'My Notes',
      value: 'My notes',
      link: '/my-note',
      icon: 'icon-zone-note'
    },
    { name: 'Settings', value: 'settings', icon: 'fa fa-cog' },
    { name: 'Recent', value: 'recent', link: '/recent', icon: 'fa fa-clock-o' },
    {
      name: 'Favourite',
      value: 'favourite',
      link: '/favourite',
      icon: 'fa fa-star'
    },
    {
      name: 'Shared With Me',
      value: 'shared with me',
      link: '/shared-with-me',
      icon: 'fw fw-shared-with-me'
    },
    {
      name: 'Shared By Me',
      value: 'shared by me',
      link: '/shared-by-me',
      icon: 'fa fa-share-alt'
    },
    { name: 'Trash', value: 'Trash', link: '/trash', icon: 'fa fa-trash-o' }
  ];
  notePageType: any = {
    MY_NOTE: 'MY_NOTE',
    TRASH: 'NOTE_TRASH',
    SHARED_WITH_ME: 'SHARED_WITH_ME',
    MY_SHARINGS: 'MY_SHARINGS'
  };

  contactMenuItems: any = [
    {
      name: 'My Contacts',
      value: 'all contacts',
      link: '/list',
      icon: 'fa fa-address-book-o',
      hasMenu: false
    },
    { name: '', value: '', link: '', icon: '' },
    {
      name: 'Labels',
      value: 'labels',
      link: '/list/labels',
      icon: 'fa fa-tags'
    },
    {
      name: 'Favourites (2)',
      value: 'favourites',
      link: '/list/favourites',
      icon: 'fa fa-star'
    },
    {
      name: 'Social (5)',
      value: 'social',
      link: '/list/social',
      icon: 'fa fa-globe'
    },
    {
      name: 'Chat (2)',
      value: 'chat',
      link: '/list/chat',
      icon: 'fa fa-comments-o'
    },
    {
      name: 'Custom label 01 (1)',
      value: '',
      link: '/list/custom-label-01',
      icon: 'fa fa-folder-o visibility-hidden'
    },
    {
      name: 'Custom label 01 (2)',
      value: '',
      link: '/list/custom-label-02',
      icon: 'fa fa-folder-o visibility-hidden'
    },
    {
      name: 'Blacklist',
      value: 'blacklist',
      link: '/list/blacklist',
      icon: 'fa fa-ban'
    },
    {
      name: 'New label',
      value: 'new label',
      link: '#',
      icon: 'fa fa-plus',
      action: 'contact:label:create'
    }
  ];

  contactEvents: any = {
    common: 'contactCommonEvent',
    actionsToolbar: 'contactActionsToolbarEvent',
    googleImport: 'contactGoogleImportEvent'
  };

  chatMenuItems: any = [
    // {name: 'Conversations', link: '/conversations', icon: 'fa fa-comments-o'},
    { name: 'Contacts', link: '/contacts', icon: 'fa fa-address-book-o' },
    { name: 'Settings', link: '/setting', icon: 'fa fa-cog' }
  ];

  pictureMenuItems: any = [
    { name: 'Photos', link: '/photos', icon: 'fa fa-photo' },
    { name: 'Albums', link: '/albums', icon: 'wthico-album' },
    // { name: 'Videos', link: '/videos', icon: 'fa fa-video-camera' },
    // { name: 'Playlists', link: '/playlists', icon: 'fa fa-file-video-o' },

    { name: 'Favorites', link: '/favorites/photos', icon: 'fa fa-star' },
    {
      name: 'Shared with me',
      link: '/shared-with-me',
      icon: 'fw fw-shared-with-me'
    },
    { name: 'Shared by me', link: '/shared-by-me', icon: 'fa fa-share-alt' },
    { name: 'Search', link: '/search', icon: 'fa fa-search' },
    { name: 'Trash', link: '/trash', icon: 'fa fa-trash' }
  ];

  socialMenuItems: any = [
    { name: 'Home', link: '/home', icon: 'fa fa-home' },
    { name: 'Communities', link: '/communities', icon: 'fa fa-users' },
    { name: 'Notifications', link: '/notifications', icon: 'fa fa-bell-o' },
    { name: 'Friends', link: '/friends', icon: 'fa fa-user-plus' },
    { name: 'News', link: '/news', icon: 'fa fa-newspaper-o' },
    { name: 'My Page', link: '/profile', icon: 'fa fa-user-circle' }
  ];

  pictureMenuActions: any = {
    preview: true,
    share: true,
    addFavourite: true,
    tag: true,
    delete: true,
    other: true
  };

  mediaSliderViewNumber: any = {
    min: 4,
    default: 8,
    max: 12
  };

  user: any = {
    minPassword: 8
  };

  urls: any = {
    default: `${Config.SUB_DOMAIN.MYACCOUNT}/dashboard`,
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
    zoneSoConnections: 'zone/social_network/connections',
    zoneSoReportList: 'zone/social_network/report_list',
    zoneSoShortcuts: 'zone/social_network/shortcuts',
    zoneSoProfile: 'zone/social_network/profile',
    zoneSoPhotos: 'zone/social_network/photos',
    soFriendUrl: 'zone/social_network/friends',
    zonePhotos: 'media/photos',
    posts: 'posts',
    profile: 'profile',
    album: 'album',
    photo: 'photo',
    chatConversation: 'conversations',
    contacts: 'contact/wcontacts'
  };
  sex: any = ['', 'Male', 'Female', 'Other'];
  communityRole: any = {
    admin: [1, 'Admin'],
    member: [2, 'Member']
  };
  notificationType: any = {
    connection: 1,
    update: 2
  };
  seenStatus: any = {
    new: 'new',
    seen: 'seen',
    seen_and_took_action: 'seen_and_took_action'
  };
  soPostPrivacy: any = {
    public: { css: 'fa fa-globe', text: 'Public', data: 'public' },
    personal: { css: 'fa fa-lock', text: 'personal', data: 'personal' },
    private: { css: 'fa fa-lock', text: 'private', data: 'private' },
    friends: { css: 'fa fa-users', text: 'Friends', data: 'friends' },
    customFriend: {
      css: 'fa fa-user-times',
      text: 'Custom Friends',
      data: 'custom_friend'
    },
    customCommunity: {
      css: 'fa fa-group',
      text: 'Custom Community',
      data: 'custom_community'
    },
    unknown: { css: '', text: '', data: '' }
  };
  soPostListType: any = {
    userOnly: 'user_only',
    strangeUser: 'strange_user',
    friend: 'friend',
    community: 'community',
    userAndFriend: 'user_and_friend',
    randomUser: 'random_user',
    public: 'public'
  };
  soCommunityPrivacy: any = {
    open: { name: 'open' },
    close: { name: 'close' }
  };
  soCommunityReportEntity: any = {
    user: 1,
    community: 2
  };
  soCommunityUserStatus: any = {
    member: 1,
    joinRequestSent: 2,
    stranger: 3
  };

  friendStatus: any = {
    pending: 1,
    accepted: 2,
    rejected: 3,
    unfriend: 4,
    blocked: 5,
    stranger: 99
  };

  contactConnectStatus: any = {
    1: 'Not Connected',
    2: 'Request Sent',
    3: 'Connected',
    4: 'Rejected'
  };

  soPostLimit: any = 10;
  soCommentLimit: any = 20;

  searchDebounceTime: any = 250;

  search: any = {
    config: {
      globalActive: true,
      photoActive: true,
      socialActive: true,
      chatActive: true,
      contactActive: true
    }
  };

  mediaListDetailTypeMapping: any = {
    photos: 'photo',
    albums: 'album',
    favorites: 'mix',
    'shared-with-me': 'mix'
  };
  mediaPageType: any = {
    photos: 'photos',
    search: 'search',
    sharedWithMe: 'shared-with-me',
    favorites: 'favorites',
    albums: 'albums',
    album_detail: 'album_detail'
  };

  emailType: any = [
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
    }
  ];
  phoneType: any = [
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
    }
  ];
  addressType: any = [
    {
      category: 'home',
      name: 'Home'
    },
    {
      category: 'work',
      name: 'Work'
    },
    {
      category: 'other',
      name: 'Other'
    }
  ];
  mediaType: any = [
    {
      category: 'facebook',
      name: 'Facebook'
    },
    {
      category: 'google_plus',
      name: 'Google Plus'
    },
    {
      category: 'twitter',
      name: 'Twitter'
    },
    {
      category: 'linkedin',
      name: 'LinkedIn'
    },
    {
      category: 'other',
      name: 'Other'
    },
  ];
  phoneCategories: any = [
    { value: 'mobile', text: 'Mobile' },
    { value: 'home', text: 'Home' },
    { value: 'work', text: 'Work' },
    { value: 'main', text: 'Main' },
    { value: 'fax', text: 'Fax' },
    { value: 'other', text: 'Other' }
  ];
  emailCategories: any = [
    { value: 'work', text: 'Work' },
    { value: 'home', text: 'Home' },
    { value: 'other', text: 'Other' }
  ];
  addressCategories: any = [
    { value: 'work', text: 'Work' },
    { value: 'home', text: 'Home' },
    { value: 'other', text: 'Other' }
  ];
  mediaCategories: any = [
    { value: 'wthapps', text: 'WTHApps' },
    { value: 'facebook', text: 'Facebook' },
    { value: 'googleplus', text: 'Google Plus' },
    { value: 'twitter', text: 'Twitter' },
    { value: 'other', text: 'Other' }
  ];

  tooltip: any = {
    add: 'Add',
    addLabel: 'Add label',
    addPeople: 'Add people',
    addMembers: 'Add Members',
    sendRequest: 'Send request',
    findContacts: 'Find Contacts',
    addPhoto: 'Add photo',
    addPhotos: 'Add photos',
    addVideos: 'Add videos',
    addItems: 'Add items',
    addMorePhotos: 'Add more photos',
    addTag: 'Add Tag',
    addToAlbum: 'Add to album',
    addToBlacklist: 'Add to blacklist',
    addToFavorites: 'Add to favorites',
    addAttachments: 'Add attachments',
    attachments: 'Attachments',
    back: 'Back',
    cancelUploading: 'Cancel uploading',
    changeView: 'Change view',
    collapse: 'Collapse',
    close: 'Close',
    create: 'Create',
    crop: 'Crop',
    delete: 'Delete',
    deleteMessage: 'Delete this message',
    download: 'Download',
    downloadPhoto: 'Download photo',
    edit: 'Edit',
    emoticons: 'Emoticons',
    favourite: 'Favourite',
    goToChat: 'Go to chat',
    goToSocial: 'Go to social',
    gridView: 'Grid view',
    hide: 'Hide',
    info: 'Info',
    information: 'Information',
    listView: 'List view',
    markAsRead: 'Mark as read',
    markAsUnread: 'Mark as unread',
    mergeContacts: 'Merge duplicate contacts',
    moreAction: 'More action',
    more: 'More',
    new: 'New',
    next: 'Next',
    enable_notification: 'Enable notification',
    disable_notification: 'Disable notification',
    notification: 'Notification',
    notifications: 'Notifications',
    chat: 'Chat',
    inviteToWTHApps: 'Invite to WTHApps',
    preview: 'Preview',
    previous: 'Previous',
    rangeSliderView: 'Range slider view',
    remove: 'Remove',
    removeFromBlacklist: 'Remove from blacklist',
    removeFromFavourites: 'Remove from favorites',
    removeThisPhoto: 'Remove this photo',
    reverseSortDirection: 'Reverse sort direction',
    search: 'Search',
    searchOptions: 'Search options',
    send: 'Send',
    sendFile: 'Send file',
    sendFileAndMedia: 'Send file and media',
    sendMedia: 'Send media',
    setting: 'Setting',
    settings: 'Settings',
    share: 'Share',
    show: 'Show',
    showActions: 'Show actions',
    showPassword: 'Show password',
    tag: 'Tag',
    tags: 'Tags',
    reset: 'Reset',
    resetZoom: 'Reset zoom',
    rotateLeft: 'Rotate left',
    rotateRight: 'Rotate right',
    update: 'Update',
    viewDetail: 'View detail',
    viewInfo: 'View info',
    wthApps: 'WTHApps',
    zoom: 'Zoom',
    zoomIn: 'Zoom in',
    zoomOut: 'Zoom out',
    restore: 'Restore',
    permanentDelete: 'Permanent Delete',
    removeFromSharing: 'Remove from sharing',
    removeFromAlbum: 'Remove from Album',
    previewSharing: 'Preview sharing',
    deleteSharing: 'Delete Sharing',
    doubleClickToEdit: 'Double click to edit',
    addToSharing: 'Add to sharing',
    addToContacts: 'Add to contacts',
    wthContacts: 'Public contact information of other users from WTH!Apps.'
  };

  confirmDialog: any = {
    label: {
      accept: 'DONE',
      reject: 'CANCEL'
    }
  };

  modal: any = {
    edit: 'edit',
    add: 'add'
  };

  moduleMap: any = {
    social: '1',
    chat: '2',
    media: '3',
    portal: '4',
    contact: '5',
    note: '6',
    myAccount: '7'
  };

  private getKeyByEnv(key: string): string {
    return (((Config.ENV !== 'STAG') && (Config.ENV !== 'TEST')) ? key : `${key}_${Config.ENV.toLowerCase()}`);
  }
}
const Constants = new ConstantsBase();
export { Constants };

export let PhotoAction = {
  update: 'update',
  delete: 'delete'
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

export const MODEL_TYPE = {
  photo: 'Media::Photo',
  video: 'Media::Video'
};
