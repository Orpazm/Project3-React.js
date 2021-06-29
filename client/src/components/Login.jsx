import React, { useState } from 'react'
import TextField from '@material-ui/core/TextField';
import { Link } from 'react-router-dom';
import Button from '@material-ui/core/Button';
import { useDispatch } from "react-redux";
import Visibility from '@material-ui/icons/Visibility';
import VisibilityOff from '@material-ui/icons/VisibilityOff';
import InputAdornment from '@material-ui/core/InputAdornment';
import IconButton from '@material-ui/core/IconButton';
import OutlinedInput from '@material-ui/core/OutlinedInput';
import clsx from 'clsx';
import { makeStyles } from '@material-ui/core/styles';
import InputLabel from '@material-ui/core/InputLabel';
import FormControl from '@material-ui/core/FormControl';

const useStyles = makeStyles((theme) => ({
  root: {
    display: 'flex',
    flexWrap: 'wrap',
  },
  margin: {
    margin: theme.spacing(1),
  },
  withoutLabel: {
    marginTop: theme.spacing(3),
  },
  textField: {
    width: '25ch',
  },
}));

export default function Login({history}) {

    const [username, setUsername] = useState("")
    const [password, setPassword] = useState("")
    const [error, setError] = useState("")
    const classes = useStyles();
    const [values, setValues] = React.useState({
      showPassword: false,
    })
    const handleClickShowPassword = () => {
      setValues({ ...values, showPassword: !values.showPassword });
    }
    const handleMouseDownPassword = (event) => {
      event.preventDefault();
    };
    const dispatch = useDispatch();

    return (
        <form className="logform" noValidate autoComplete="off">
         <div className="divform">
           <h1 id="login"> Welcome to Vickey </h1>
           <h2 id="login2">a whole world of exotic places!</h2>
           <h2 id="login2"> Log in to find your next vacation </h2>
           <TextField 
            required
            id="outlined-required"
            className={clsx(classes.margin, classes.textField)}
            label="Username"
            defaultValue=""
            variant="outlined"
            onChange={e=>{
                setUsername(e.target.value)}}
           />
           <FormControl required className={clsx(classes.margin, classes.textField)} variant="outlined">
            <InputLabel htmlFor="outlined-adornment-password">Password</InputLabel>
             <OutlinedInput
              id="outlined-adornment-password"
              type={values.showPassword ? 'text' : 'password'}
              value={password}
              onChange={e=>{
               setPassword(e.target.value)}}
              onKeyDown={async ()=>{
               try {
                  const res = await fetch('http://localhost:1000/auth/login', {
                      method:"post",
                      headers:{"content-type":"application/json"},
                      body: JSON.stringify({username, password})
                  })
                  const data = await res.json()
                  if(data.token){
                    localStorage.token = data.token
                    history.push('/home')
                  }
                  dispatch({
                   type:"CHECK_USER"
                  })
              }catch (err) {
                  console.log(err)
              }
             }}
              endAdornment={
               <InputAdornment position="end">
                <IconButton
                  aria-label="toggle password visibility"
                  onClick={handleClickShowPassword}
                  onMouseDown={handleMouseDownPassword}
                  edge="end"
                >
                  {values.showPassword ? <Visibility /> : <VisibilityOff />}
                </IconButton>
               </InputAdornment>
              }
              labelWidth={70}
           />
         </FormControl>
         <Button id="regbtn" variant="contained" color="primary" onClick={async ()=>{
              try {
                  const res = await fetch('http://localhost:1000/auth/login', {
                      method:"post",
                      headers:{"content-type":"application/json"},
                      body: JSON.stringify({username, password})
                  })
                  const data = await res.json()
                  if(data.token){
                    localStorage.token = data.token
                    setError("")
                    history.push('/home')
                }else{
                  setError(data.err)
                }
                dispatch({
                  type:"CHECK_USER"
                })
              } catch (err) {
                  console.log(err)
              }
          }}>
           Login
         </Button>
         {error !== "" && <h3 id="errmsg"> {error} </h3>}
         <p id="login2">don't have an account yet? <Link to={"/register"}>Register</Link></p>
        </div>
      </form>
    )
}

