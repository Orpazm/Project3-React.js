import React, { useState } from 'react'
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';
import { useSelector } from 'react-redux'
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import IconButton from '@material-ui/core/IconButton';
import MenuIcon from '@material-ui/icons/Menu';
import { makeStyles } from '@material-ui/core/styles';
import ExitToAppIcon from '@material-ui/icons/ExitToApp';
import Tooltip from '@material-ui/core/Tooltip';
import HomeIcon from '@material-ui/icons/Home';
import AssessmentIcon from '@material-ui/icons/Assessment';
import { MuiPickersUtilsProvider } from '@material-ui/pickers';
import DateFnsUtils from '@date-io/date-fns';
import { DatePicker } from '@material-ui/pickers';

const useStyles = makeStyles((theme) => ({
  root: {
    flexGrow: 1,
  },
  menuButton: {
    marginRight: theme.spacing(2),
  },
  title: {
    flexGrow: 1,  
  },
  add: {
      flexGrow: 1,
    },
}));

export default function Form({history}) {

    const [description, setDescription] = useState("")
    const [destination, setDestination] = useState("")
    const [from_date, setFrom_date] = React.useState(new Date())
    const [to_date, setTo_date] = React.useState()
    const [price, setPrice] = useState("")
    const [img, setImg] = useState("")
    const userInfo = useSelector(state => state.checkUserReducer)
    const classes = useStyles();
    const [isClicked, setIsClicked] = useState(false)
    const [error, setError] = useState("")
    const [errDate, setErrDate] = useState("")

    //setting from_date and to_date to the date selected because to_date has to be set with min value of from_date
    const handleFromDateChange = (date) => {
      setFrom_date(date);
      setTo_date(date)
    };

    //setting to_date to the date selected 
    const handleToDateChange = (date) => {
      setTo_date(date);
    };

  //cheking if the submit btn is clicked to show a msg when adding a vacation
  if(isClicked){
    setTimeout(() => {
      setIsClicked(!isClicked)
    }, 2000);
  }

  if(!userInfo.status){   
    if(!localStorage.token){
      history.push('/login')
      }
    return <div> Loading.... </div>
  }
    
    return (
      <div className={classes.root} id="fdiv" color="rgba(46, 161, 255, 0.897)">
      <AppBar position="static" id="toolbar" style={{ background: '#2c91e4e5' }}>
        <Toolbar id="toolbar" >
          <IconButton edge="start" color="inherit" aria-label="menu" className={classes.menuButton}>
            <MenuIcon />
          </IconButton>
          <Typography variant="h5" id= "greetings" className={classes.title}>
             Hello {userInfo.status.username}
          </Typography>
          <Tooltip title="Reports">
            <AssessmentIcon color="inherit" id="reportsbtn" onClick={()=> window.location.href="/reports"}>
            </AssessmentIcon> 
          </Tooltip>
          <Tooltip title="Home">
            <HomeIcon id="homeBtn" color="white" className={classes.menuButton} 
             onClick={()=> window.location.href="/home"}/>
          </Tooltip>
          <Tooltip title="Logout">
            <ExitToAppIcon color="inherit" id="logoutBtn" onClick={()=>{
              localStorage.removeItem("token")
              history.push('/login')
              }}> </ExitToAppIcon> 
          </Tooltip>
        </Toolbar>
      </AppBar>
      <form className="regform" noValidate autoComplete="off">
        <div className="form">
          <h1 id="AddVacTitle"> Add vacations </h1>
          <TextField
            required
            id="filled-basic" 
            label="Description"
            defaultValue=""
            variant="filled"
            onChange={e=>{
                setDescription(e.target.value)}}
          />
          <TextField
            required
            id="filled-basic" 
            label="Destination"
            defaultValue=""
            variant="filled"
            onChange={e=>{
                setDestination(e.target.value)}}
          />
          <MuiPickersUtilsProvider utils={DateFnsUtils}>
           <DatePicker 
            required
            label="From"
            format="dd/MM/yyyy"
            disableToolbar
            disablePast
            margin="normal"
            id="date-picker-inline"
            value={from_date}
            onChange={handleFromDateChange}
            KeyboardButtonProps={{
              'aria-label': 'change date',
            }}
            maxDate= {to_date}
            />
           <DatePicker 
            required
            label="To"
            format="dd/MM/yyyy"
            disableToolbar
            margin="normal"
            id="date-picker-inline"
            value={to_date}
            onChange={handleToDateChange}
            KeyboardButtonProps={{
              'aria-label': 'change date',
            }}
            minDate= {from_date}
            />
          </MuiPickersUtilsProvider>
          <TextField
            required
            id="filled-basic" 
            label="Price"
            defaultValue=""
            variant="filled"
            onChange={e=>{
                setPrice(e.target.value)}}
          />
          <TextField
            required
            id="filled-basic"  
            label="Img"
            defaultValue=""
            variant="filled"
            onChange={e=>{
                setImg(e.target.value)}}
          />
          <Button id="submitbtn" variant="contained" onClick={async ()=>{
              try {
                  const res = await fetch('http://localhost:1000/vacations/admin', {
                      method:"post",
                      headers:{"content-type":"application/json",
                               "authorization":localStorage.token},
                      body: JSON.stringify({description, destination, from_date, to_date, price, img})
                  })
                  if(!description || !destination || !from_date || !price || !img ){
                    setErrDate("")
                    setError("error")
                  }else if(to_date == undefined){
                    setError("")
                    setErrDate("errDate")
                  }else{
                    setError("")
                    setErrDate("")
                    setIsClicked(!isClicked)
                  }       
              } catch (err) {
                  console.log(err)
              }
            }}>
            Submit
          </Button> 
         {isClicked? <div id="divAdded"> <h3 id="vacAdded"> Vacation added successfully</h3> </div>   : <h1></h1>  }
         {error!== ""? <div id="divError"> <h3 id="vacAdded"> You must fill in all fields in order to add vacations</h3> </div>   : <h1></h1>  }
         {errDate!== ""? <div id="divError"> <h3 id="vacAdded"> Please pick a "To" date </h3> </div>   : <h1></h1>  }
        </div>    
      </form> 
    </div>   
    )
}

