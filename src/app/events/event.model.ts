import firebase from 'firebase/app';

export interface OsEvent {
  name: string;
  shortName?: string;
  id?: string;
  photoUrl?: string;
  description?: string;
  date?: firebase.firestore.Timestamp;
  hour?: string;
  linkText: string;
  link: string;
  // start?: Date;
  // minutes?: number;

}
