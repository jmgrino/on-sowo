import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { from } from 'rxjs';
import { map, switchMap } from 'rxjs/operators';
import { Partnership } from './partnership.model';

@Injectable({
  providedIn: 'root'
})
export class PartnershipsService {

  constructor(
    private afs: AngularFirestore,
  ) { }

  fetchPartnerships() {
    return this.afs.collection<Partnership>('partnerships').snapshotChanges().pipe(
      map( snaps => {
        return snaps.map( snap => {
          return { id: snap.payload.doc.id, ...snap.payload.doc.data() };
        });
      }),
      switchMap( () => {
        return this.afs.collection<Partnership>('partnerships').get()
        .pipe(
          map( snap => {
            return snap.docs.map((doc) => {
              return { id: doc.id, ...doc.data() } as Partnership;
            });
          })
        );
      })
    );
  }

  addPartnership(partnership: Partial<Partnership>) {
    return from(this.afs.collection('partnerships').add(partnership));
  }

  fetchPartnership(id: string) {
    return this.afs.doc<Partnership>(`partnerships/${id}`).valueChanges().pipe(
      map(  values => {
        return { id, ...values} as Partnership;
      })
    );
  }

  savePartnership(id: string, changes: Partial<Partnership>) {
    return from(this.afs.doc(`partnerships/${id}`).update(changes));
  }

  deletePartnership(id: string) {
    return from(this.afs.doc(`partnerships/${id}`).delete());
  }



}
