// Client code
export class Conversations {
  data: any = [];
  meta: any = {};
  /**
   *
   */
  constructor(res: any = {}) {
    this.data = res.data || [];
    this.meta = res.meta || {};
  }

  getAllNotifications() {
    return this.data.reduce((acc, curr) => {
      acc += curr.notification_count;
      return acc;
    }, 0);
  }

  markAllAsRead() {
    this.data = this.data.map(d => {
      d.notification_count = 0;
      return d;
    });
  }

  markAsRead(groupId: any) {
    this.data = this.data.map(d => {
      if (d.group_id == groupId) {
        d.notification_count = 0;
      }
      return d;
    });
  }

  update(conversation: any) {
    this.data = this.data.map(d => {
      if (d.id == conversation.id) {
        conversation;
      }
      return d;
    });
  }

  moveToFirst(sc: any) {
    this.data = this.data.filter(c => {
      return c.group_id !== sc.group_id;
    });
    this.data = [sc, ...this.data];
  }

  moveToFirstByGroupId(group_id: any) {
    const sc = this.data.find(c => {
      return c.group_id == group_id;
    });
    if (sc) {
      this.moveToFirst(sc);
    }
  }
}
