export class Messages {
  data: any = [];
  meta: any = {};
  /**
   *
   */
  constructor(res: any = {}) {
    this.data = res.data || [];
    this.meta = res.meta || {};
  }

  addShowInfoAttribute() {
    this.data = this.data.reduce((acc, curr) => {
      if (curr.status == 'pending') {
        acc.push(curr);
        return acc;
      }
      // show time each message
      if (
        acc.length == 0 ||
        acc[acc.length - 1].user_id !== curr.user_id ||
        acc[acc.length - 1].message_type !== 'text'
      ) {
        curr.showInfo = true;
      } else {
        curr.showInfo = false;
      }
      // show date
      if (
        acc.length == 0 ||
        new Date(acc[acc.length - 1].created_at).getDate() !==
          new Date(curr.created_at).getDate()
      ) {
        curr.showDate = true;
      } else {
        curr.showDate = false;
      }
      acc.push(curr);
      return acc;
    }, []);
  }
}
