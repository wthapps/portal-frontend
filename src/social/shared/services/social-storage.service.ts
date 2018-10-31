import { Injectable } from '@angular/core';

import { SoPost } from '@shared/shared/models';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { Observable } from 'rxjs/Observable';


@Injectable()
export class SoStorageService {
  postList$: Observable<SoPost[]>;
  nextLink$: Observable<any>;
  private postList: BehaviorSubject<SoPost[]> = new BehaviorSubject([]);
  private nextLink: BehaviorSubject<any> = new BehaviorSubject({});

  constructor() {
    this.postList$ = this.postList.asObservable();
    this.nextLink$ = this.nextLink.asObservable();
  }

  savePostList(posts: SoPost[]): void {
    this.postList.next(posts);
  }

  appendPosts(posts: SoPost[]): void {
    this.postList.next([...this.postList.getValue(), ...posts]);
  }

  prependPosts(posts: SoPost[]): void {
    this.postList.next([...posts, ...this.postList.getValue()]);
  }

  createPost(post: SoPost) {
    const currPosts = this.postList.getValue();
    const { parent_post } = post;
    //  Update share count if possible
    if (parent_post) {
      for (let i = 0; i < currPosts.length; i++) {
        const p = currPosts[i];
        if (p.uuid === parent_post.uuid) {
          p.shared_count = parent_post.shared_count;
          currPosts[i] = _.cloneDeep(p);
        }
      }
    }

    this.postList.next([post, ...currPosts]);
  }

  updatePost(post: SoPost): void {
    const currPosts = this.postList.getValue().map(p => {
      return (post.uuid === p.uuid) ? post : p;
    });
    this.postList.next(currPosts);
  }

  removePosts(postUuids: string[]): void {
    const currPosts = this.postList.getValue().filter(p => !postUuids.includes(p.uuid));
    this.postList.next(currPosts);
  }

  saveNextLink(nextLink: string) {
    this.nextLink.next(nextLink);
  }
}
