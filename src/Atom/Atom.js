import { atom } from "recoil";

export const Auth = atom({
  key: "Auth",
  default: {
    name: null,

    status: false,
  },
});

export const Load = atom({
  key: "Load",
  default: false,
});

export const jsonwebtoken = atom({
  key: "jsonwebtoken",
  default: localStorage.getItem("jwt"),
});
