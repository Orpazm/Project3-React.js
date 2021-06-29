import React, { useState } from 'react'
import TextField from '@material-ui/core/TextField';
import { Link } from 'react-router-dom';
import Button from '@material-ui/core/Button';
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
    margin: theme.spacing(0),
  },
  withoutLabel: {
    marginTop: theme.spacing(1),
  },
  textField: {
    width: '25ch',
  },
}));

export default function Register({history}) {
    const [first_name, setFirstname] = useState("")
    const [last_name, setLastname] = useState("")
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

    return (
        <form className="logform" noValidate autoComplete="off">
         <div className="divform">
          <h1 id="reg"> Welcome to Vickey </h1>
          <h2 id="login2">a whole world of exotic places!</h2>
          <TextField
            required
            className={clsx(classes.margin, classes.textField)}
            id="outlined-required"
            label="First Name"
            defaultValue=""
            variant="outlined"
            onChange={e=>{
                setFirstname(e.target.value)}}
          />
          <TextField
            required
            className={clsx(classes.margin, classes.textField)}
            id="outlined-required"
            label="Last Name"
            defaultValue=""
            variant="outlined"
            onChange={e=>{
                setLastname(e.target.value)}}
          />
          <TextField
            required
            className={clsx(classes.margin, classes.textField)}
            id="outlined-required"
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
                  const res = await fetch(`http://localhost:1000/auth/register`, {
                      method:"post",
                       headers:{"content-type":"application/json"},
                       body: JSON.stringify({first_name, last_name, username, password})
                  })
                  const data = await res.json()
                  if(data.id){
                      setError("")
                      history.push('/login')
                  }else{
                    setError("missing some info")
                  }
              } catch (err) {
                  console.log(err)  
              }
           }}>
            Register
          </Button>
         {error == "missing some info" && <h3 id="errmsg"> Missing some info: please fill in all fields to register </h3>}
         <p id="login2">already have an account? <Link to={"/login"}>Login</Link></p>
        </div>
      </form>
    )
}
