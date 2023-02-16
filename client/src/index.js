import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import { UserContextProvider } from './features/UserContext';
import { NavContextProvider } from "./features/NavContext";
import { GroupModalContextProvider } from './features/GroupModalContext';
import { FriendsContextProvider } from "./features/FriendsContext";
import { SocketContextProvider } from './features/SocketContext';

const root = ReactDOM.createRoot(document.getElementById('root'));

root.render(
  <NavContextProvider>
    <UserContextProvider>
      <GroupModalContextProvider>
        <FriendsContextProvider>
          <SocketContextProvider>
            <React.StrictMode>
              <App />
            </React.StrictMode>
          </SocketContextProvider>
        </FriendsContextProvider>
      </GroupModalContextProvider>
    </UserContextProvider>
  </NavContextProvider>

);
