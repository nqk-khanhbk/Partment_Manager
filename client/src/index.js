import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import 'bootstrap/dist/css/bootstrap.min.css';
import {BrowserRouter} from "react-router-dom";
import { Provider } from 'react-redux';
import AllReducer from './Reducer';
import {createStore} from "redux";
const store = createStore(AllReducer);
const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
 <Provider store={store}>
     <BrowserRouter>
      <App />
    </BrowserRouter>
  </Provider>
);



