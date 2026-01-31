import { createRoot } from 'react-dom/client'
import './index.css'
import Router from './router/Router.jsx'
import { store } from './store/store.js'
import { Provider } from 'react-redux'
import { ToastContainer } from 'react-toastify'
import "./i18n";

createRoot(document.getElementById('root')).render(
    <Provider store={store}>
        <ToastContainer style={{ zIndex: 99999 }} />
        <Router />
    </Provider>
)
// usign the order queires you've created and this one I need you to create a orders page on adminpanerl