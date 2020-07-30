import React, { Fragment, useEffect } from 'react';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import './App.css';
import Signup from './components/auth/Signup'
import Login from './components/auth/Login'
import PrivateRoute from './components/routes/PrivateRoute'
import Home from './components/routes/Home'
import Profile from './components/routes/Profile'
import Search from './components/routes/Search'
import CreateBlog from './components/routes/CreateBlog'
import EditBlog from './components/routes/EditBlog'
import Blog from './components/routes/Blog'

// redux
import { Provider } from 'react-redux'
import store from './store'

import { loadUser } from './actions/auth'
import setAuthToken from './utils/setAuthToken'

function App() {
  useEffect(() => {
    setAuthToken(localStorage.token)
    store.dispatch(loadUser())
  }, [])

  return (
    <Provider store={store}>
      <Router>
        <Fragment>
          <Switch>
            <Route exact path='/' component={Login} />
            <Route exact path='/signup' component={Signup} />
            <PrivateRoute exact path='/home' component={Home} />
            <PrivateRoute exact path='/profile/:username' component={Profile} />
            <PrivateRoute exact path='/search' component={Search} />
            <PrivateRoute exact path='/create/blog' component={CreateBlog} />
            <PrivateRoute exact path='/edit/blog/:id' component={EditBlog} />
            <PrivateRoute exact path='/blog/:name/:id' component={Blog} />
          </Switch>
        </Fragment>
      </Router>
    </Provider>
  );
}

export default App;
