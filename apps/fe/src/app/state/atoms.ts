import { atom, selector } from "recoil";

export const userState = atom({
    key: 'userState',
    default: {}, 
});


export const sessionState = atom({
  key: 'seshstate',
  default: {}
})

export const userSessionState = selector({
  key: 'userSeshState',
  get: ({get}) => {
    const text = get(sessionState);
    return text;
  },
});

export const userAppState = selector({
    key: 'userAppState',
    get: ({get}) => {
      const text = get(userState);
      return text;
    },
});