import React from 'react'
import VacList from './VacList'
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import IconButton from '@material-ui/core/IconButton';
import MenuIcon from '@material-ui/icons/Menu';
import { makeStyles } from '@material-ui/core/styles';
import { useSelector } from 'react-redux'
import AddCircleIcon from '@material-ui/icons/AddCircle';
import ExitToAppIcon from '@material-ui/icons/ExitToApp';
import Tooltip from '@material-ui/core/Tooltip';
import AssessmentIcon from '@material-ui/icons/Assessment';
import FavoriteIcon from '@material-ui/icons/Favorite';

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

export default function Home({history}) {
    const userInfo = useSelector(state => state.checkUserReducer)
    const classes = useStyles();

    if(!userInfo.status){   
      if(!localStorage.token){
        history.push('/login')
      }
      return <div> Loading.... </div>
    }
     
    return (
        <div className={classes.root} id="homediv" color="rgba(46, 161, 255, 0.897)">
          <AppBar position="static" id="toolbar" style={{ background: '#2c91e4e5' }}>
            <Toolbar id="toolbar" >
              <IconButton edge="start" color="inherit" aria-label="menu" className={classes.menuButton}>
                <MenuIcon />
              </IconButton>
            <Typography variant="h5" id= "greetings" className={classes.title}>
              Hello {userInfo.status.username}
            </Typography> 
          {userInfo.status.role === "admin" && <span>
            <Tooltip title="Reports">
              <AssessmentIcon color="inherit" id="reportsbtn" onClick={()=> window.location.href="/reports"}>
              </AssessmentIcon> 
            </Tooltip>
            <Tooltip title="Add vacation">
              <AddCircleIcon id="addVacBtn" color="white" aria-label="add" size="small" className={classes.menuButton}
                onClick={()=> history.push("/add")}>
              </AddCircleIcon>
            </Tooltip>
           </span>
          }
          {userInfo.status.role === "user" && <span>
            <Tooltip title="Go to favorites">
             <IconButton id="loveBtn" style= {{color:"white"}} aria-label="add to favorites" onClick={
               async ()=> {
                try {
                    history.push('/favorites')
                } catch (err) {
                  console.log(err)
                }
              }
              }>
               <FavoriteIcon id="loveit" />
             </IconButton>
            </Tooltip>
           </span>
          }
          <Tooltip title="Logout">
            <ExitToAppIcon color="inherit" id="logoutBtn" onClick={()=>{
              localStorage.removeItem("token")
              history.push('/login')
              }}> </ExitToAppIcon> 
          </Tooltip>
        </Toolbar>
      </AppBar>
      <VacList/>  
     </div>
    )
}

