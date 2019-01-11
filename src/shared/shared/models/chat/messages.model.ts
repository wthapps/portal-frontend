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
      if (acc.length == 0 || acc[acc.length - 1].user_id !== curr.user_id) {
        curr.showInfo = true;
      }
      acc.push(curr);
      return acc;
    }, []);
  }
}
