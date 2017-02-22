import { Config } from './env.config';
export let ApiConfig = {
  url: Config.API + '/',

  actionCable: {
    notificationChannel: 'NotificationChannel',
    chatChannel: 'ChatChannel'
  },

  paramName: {
    back_url: 'back_url',
    page: 'page',
    per_page: 'per_page',
    user_id: 'user_id',
    post_id: 'post_id'
  },

  objects: {
    apps: '/apps',
    post: '/posts',
    communities: '/communities',
    members: '/members',
    photos: '/photos',
    albums: '/albums',
    notifications: '/notifications',
    friends: '/friends'
  }
};



