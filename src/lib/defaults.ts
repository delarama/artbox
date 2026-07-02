import type { OrderState, Upgrades } from "./types";

const defaultUpgrades: Upgrades = {
  digitalPhotos: false,
  cloudStorage: false,
  oneTimeDownload: false,
  usbDrive: false,
};

export const defaultOrderState: OrderState = {
  route: null,
  authMode: "login",
  auth: { name: "", email: "", password: "" },
  qty: 1,
  returnArt: false,
  up: defaultUpgrades,
  speed: "standard",
  diyFormat: "hard",
  promoCode: "ARTKIVE",
  promoApplied: true,
  ship: {
    first: "",
    last: "",
    email: "",
    phone: "",
    street: "",
    city: "",
    prov: "ON",
    postal: "",
  },
  card: { num: "", exp: "", cvc: "" },
  approved: false,
  stageIndex: 1,
  orderNo: "AB-2026-4817",
  photos: [],
};
