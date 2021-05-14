import firebase from 'firebase/app';

export interface OsEvent {
  name: string;
  id?: string;
  photoUrl?: string;
  description?: string;
  date?: firebase.firestore.Timestamp;
  hour?: string;
  // start?: Date;
  // minutes?: number;

}
