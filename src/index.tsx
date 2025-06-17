import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import reportWebVitals from './reportWebVitals';
import { BrowserRouter } from 'react-router-dom';
import { Provider } from 'react-redux';
import store from './store/store';
import { PersistGate } from 'redux-persist/integration/react';
import { persistStore } from 'redux-persist';
import 'antd/dist/antd.less';
import { GlobalStyle } from './assets/style/GlobalStyle';
import './assets/font/font.css';

let persistor = persistStore(store);

const root = ReactDOM.createRoot(document.getElementById('root') as HTMLElement);
root.render(
    <Provider store={store}>
        <PersistGate loading={null} persistor={persistor}>
            <BrowserRouter>
                <GlobalStyle />
                <App />
            </BrowserRouter>
        </PersistGate>
    </Provider>,
);

reportWebVitals();
