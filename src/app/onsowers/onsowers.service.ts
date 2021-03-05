import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { User } from '../auth/user.model';

@Injectable({
  providedIn: 'root'
})
export class OnsowersService {

  constructor(
    private afs: AngularFirestore,
  ) { }

  fetchOnsowers() {
    return this.afs.collection<User>('users', ref => ref.orderBy('displayName')).valueChanges();
  }
}
