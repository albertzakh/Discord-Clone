import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import { UserContextProvider } from './context/UserContext';
import { NavContextProvider } from "./context/NavContext";
import { ModalContextProvider } from './context/ModalContext';
import { FriendsContextProvider } from "./context/FriendsContext";
import { SocketContextProvider } from './context/SocketContext';

const root = ReactDOM.createRoot(document.getElementById('root'));

root.render(
  <NavContextProvider>
    <UserContextProvider>
      <ModalContextProvider>
        <FriendsContextProvider>
          <SocketContextProvider>
            <React.StrictMode>
              <App />
            </React.StrictMode>
          </SocketContextProvider>
        </FriendsContextProvider>
      </ModalContextProvider>
    </UserContextProvider>
  </NavContextProvider>

);
