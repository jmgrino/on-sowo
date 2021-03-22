export interface User {
  uid: string;
  email: string;
  photoUrl?: string;
  displayName?: string;
  familyName?: string;
  isAdmin?: boolean;
  isValidated?: boolean;
  jobDescription?: string;
  jobAdditionalDesc?: string;
  areas?: string[];
  web?: string;
  country?: string;
  city?: string;
  // company?: string;
  // descEmpresa?: string;
  socialLinks?: SocialLink;
  // queNecesito?: string;
  // queOfrezco?: string;
  // unreadMsgs?: number;
  // printName?: string;
  curiosities?: Curiosity[];
}

export interface SocialLink {
  [key: string]: string;
}

// export interface Area {
//   [key: string] : string;
// }

export interface Curiosity {
  [key: string]: number | string;
}
