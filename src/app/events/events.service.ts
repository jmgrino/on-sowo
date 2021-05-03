import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { from } from 'rxjs';
import { map } from 'rxjs/operators';
import { OsEvent } from './event.model';

@Injectable({
  providedIn: 'root'
})
export class EventsService {

  constructor(
    private afs: AngularFirestore,
  ) { }

  // fetchEvents() {
  //   return this.afs.collection<OsEvent>('events').snapshotChanges().pipe(
  //     map( snaps => {
  //       return snaps.map( snap => {
  //         return { id: snap.payload.doc.id, ...snap.payload.doc.data() };
  //       });
  //     }),
  //     switchMap( () => {
  //       return this.afs.collection<OsEvent>('events').get()
  //       .pipe(
  //         map( snap => {
  //           return snap.docs.map((doc) => {
  //             return { id: doc.id, ...doc.data() } as OsEvent;
  //           });
  //         })
  //       );
  //     })
  //   );
  // }

  addEvent(osEvent: Partial<OsEvent>) {
    return from(this.afs.collection('events').add(osEvent));
  }

  fetchEvent(id: string) {
    return this.afs.doc<OsEvent>(`events/${id}`).valueChanges().pipe(
      map(  values => {
        if (values) {
          return { id, ...values} as OsEvent;
        } else {
          return values;
        }
      })
    );
  }

  saveEvent(id: string, changes: Partial<OsEvent>) {
    return from(this.afs.doc(`events/${id}`).update(changes));
  }

  // deleteEvent(id: string) {
  //   return from(this.afs.doc(`events/${id}`).delete());
  // }


}
