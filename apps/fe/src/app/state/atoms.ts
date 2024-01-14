import { atom, selector } from "recoil";

export const userState = atom({
    key: 'userState',
    default: {}, 
});

export const socketState = atom({
  key: 'socketState', 
  default: {}, 
});

export const socketCurrState = selector({
  key: 'socketCurrState', 
  get: ({get}) => {
    const text = get(socketState);
    return text
  },
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