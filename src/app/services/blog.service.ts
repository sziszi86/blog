import { Injectable } from '@angular/core';
import { Post } from '../models/post';
import { AngularFirestore } from '@angular/fire/firestore';
import { map } from 'rxjs/operators';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class BlogService {

  constructor(private db: AngularFirestore) { }

  createPost(post: Post) {
    const postData = JSON.parse(JSON.stringify(post));
    return this.db.collection('blogs').add(postData);
  }

  getAllPosts(): Observable<any> {
    const blogs = this.db.collection('blogs', ref => ref.orderBy('createdDate', 'desc')).snapshotChanges().pipe(
      map(actions => {
        return actions.map(
          c => ({
            postId: c.payload.doc.id,
            ... c.payload.doc.data() as {}
      }));
          }));
    return blogs;
  }

  getPostbyId(postId: string) {
    const userDetails = this.db.doc('blogs/' + postId).valueChanges();
    return userDetails;
  }

  updatePost(postId: string, post: Post) {
    const putData = JSON.parse(JSON.stringify(post));
    return this.db.doc('blogs/' + postId).update(putData);
  }

  deletePost(blogID: string) {
    return this.db.doc('blogs/' + blogID).delete();
  }
}
