export interface User {
  uid: string;
  email: string;
  photoUrl?: string;
  displayName?: string;
  familyName?: string;
  isAdmin?: boolean;
  isActive?: boolean;
  isPremium?: boolean;
  onlyAdmin?: boolean;
  pendingInfo?: boolean;
  sendToCA?: boolean,
  jobDescription?: string;
  jobAdditionalDesc?: string;
  areas?: string[];
  web?: string;
  country?: string;
  state?: string;
  city?: string;
  socialLinks?: SocialLink;
  curiosities?: Curiosity[];
}

export interface SocialLink {
  [key: string]: string;
}

export interface Curiosity {
  [key: string]: number | string;
}
