import React, { useEffect } from "react";
import Login from "./components/Login";
import Register from "./components/Register";
import Home from "./components/Home";
import Reports from "./components/Reports";
import Favorites from "./components/Favorites";
import { BrowserRouter as Router, Redirect, Route, Switch } from "react-router-dom";
import Form from "./components/Form";
import { useDispatch } from "react-redux";


export default function App() {

  const dispatch = useDispatch();
  useEffect(() => {
   dispatch({
     type: "CHECK_USER"
   })
  }, [])

  return (
    
    <div>
      <Router>
      <div>
          <Switch>
              <Route  path="/login" component={Login}/>
              <Route  path="/register" component={Register}/>
              <Route  path="/home" component={Home}/>
              <Route  path="/favorites" component={Favorites}/>
              <Route  path="/reports" component={Reports}/>
              <Route  path="/add" component={Form}/>
              <Redirect exact from="/" to="/login" />
          </Switch>
      </div>
    </Router>
    </div>

  )
}



