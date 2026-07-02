export type Route = "mail" | "diy" | null;
export type AuthMode = "login" | "signup";
export type Speed = "standard" | "rush" | "superRush";
export type DiyFormat = "soft" | "hard" | "xl";
export type AppTab = "track" | "book" | "account";

export type Upgrades = {
  digitalPhotos: boolean;
  cloudStorage: boolean;
  oneTimeDownload: boolean;
  usbDrive: boolean;
};

export type ShipInfo = {
  first: string;
  last: string;
  email: string;
  phone: string;
  street: string;
  city: string;
  prov: string;
  postal: string;
};

export type CardInfo = {
  num: string;
  exp: string;
  cvc: string;
};

export type AuthInfo = {
  name: string;
  email: string;
  password: string;
};

export type Photo = {
  id: string;
  url: string;
  name: string;
};

export type OrderState = {
  orderId?: string;
  route: Route;
  authMode: AuthMode;
  auth: AuthInfo;
  qty: number;
  returnArt: boolean;
  up: Upgrades;
  speed: Speed;
  diyFormat: DiyFormat;
  promoCode: string;
  promoApplied: boolean;
  ship: ShipInfo;
  card: CardInfo;
  approved: boolean;
  stageIndex: number;
  orderNo: string;
  photos: Photo[];
};
