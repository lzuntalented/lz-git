import React from 'react';
import { useContext } from '../../context';

interface AuthProps {
  children: React.ReactElement
}

export default function Auth({ children }: AuthProps) {
  const { userInfo } = useContext();
  return (
    userInfo.account ? children : <div />
  );
}
