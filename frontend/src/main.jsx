import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.jsx';
import {
  createBrowserRouter,
  createRoutesFromElements,
  Route,
  RouterProvider,
} from 'react-router-dom';
import './index.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import store from './store';
import { Provider } from 'react-redux';
import HomeScreen from './pages/HomeScreen';
import LoginScreen from './pages/LoginScreen.jsx';
import RegisterScreen from './pages/RegisterScreen.jsx';
// import ProfileScreen from './pages/ProfileScreen.jsx';
import ForgotPasswordScreen from './pages/ForgotPasswordScreen.jsx'
// import PrivateRoute from './components/PrivateRoute.jsx';

const router = createBrowserRouter(
  createRoutesFromElements(
    <Route path='/' element={<App />}>
      <Route index={true} path='/' element={<HomeScreen />} />
      <Route path='/login' element={<LoginScreen />} />
      <Route path='/signup' element={<RegisterScreen />} />
      <Route path='/forgotPassword' element={<ForgotPasswordScreen />} />
      {/* <Route path='' element={<PrivateRoute />}>
        <Route path='/profile/admin' element={<AdminScreen />} />
      </Route> */}
    </Route>
  )
);

ReactDOM.createRoot(document.getElementById('root')).render(
  <Provider store={store}>
    <React.StrictMode>
      <RouterProvider router={router} />
    </React.StrictMode>
  </Provider>
);