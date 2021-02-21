export interface User {
  uid: string;
  email: string;
  photoUrl?: string;
  displayName?: string;
  familyName?: string;
  isAdmin?: boolean;
  jobDescription?: string;
  jobAdditionalDesc?: string;
  areas?: string[];
  web?: string;
  // company?: string;
  // descEmpresa?: string;
  socialLinks?: SocialLink;
  // queNecesito?: string;
  // queOfrezco?: string;
  // unreadMsgs?: number;
  // printName?: string;
}

export interface SocialLink {
  [key: string] : string;
}

// export interface Area {
//   [key: string] : string;
// }
