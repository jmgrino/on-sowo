import { AngularFirestore } from '@angular/fire/firestore';
import { Injectable } from '@angular/core';
import { Course } from './course.model';
import { from } from 'rxjs';
import { map, switchMap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class CoursesService {

  constructor(
    private afs: AngularFirestore,
  ) { }

  fetchCourses() {
    return this.afs.collection<Course>('courses').snapshotChanges().pipe(
      map( snaps => {
        return snaps.map( snap => {
          return { id: snap.payload.doc.id, ...snap.payload.doc.data() }
        });
      }),
      switchMap( () => {
        return this.afs.collection<Course>('courses').get()
        .pipe(
          map( snap => {
            return snap.docs.map((doc) => {
              return { id: doc.id, ...doc.data() } as Course
            })
          })
        )
      })
    );
  }

  addCourse(course: Partial<Course>) {
    return from(this.afs.collection('courses').add(course));
  }

  fetchCourse(id: string) {
    return this.afs.doc<Course>(`courses/${id}`).valueChanges().pipe(
      map(  values => {
        return { id, ...values} as Course;
      })
    );
  }

  saveCourse(id: string, changes: Partial<Course>) {
    return from(this.afs.doc(`courses/${id}`).update(changes));
  }

}
