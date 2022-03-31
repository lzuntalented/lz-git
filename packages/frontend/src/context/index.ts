import React from 'react';

export interface UserInfo {
  account: string;
  name?: string;
  avatar?: string;
}

const context = React.createContext({
  userInfo: {} as UserInfo,
});

export const GlobalProvider = context.Provider;
export const useContext = () => React.useContext(context);
