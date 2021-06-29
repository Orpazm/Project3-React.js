import React, {useEffect, useState} from 'react'
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import IconButton from '@material-ui/core/IconButton';
import MenuIcon from '@material-ui/icons/Menu';
import { makeStyles } from '@material-ui/core/styles';
import { useSelector } from 'react-redux'
import ExitToAppIcon from '@material-ui/icons/ExitToApp';
import Tooltip from '@material-ui/core/Tooltip';
import VacItem from './VacItem'
import HomeIcon from '@material-ui/icons/Home';

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

export default function Favorites({history}) {

  const userInfo = useSelector(state => state.checkUserReducer)
  const classes = useStyles();
  const [lovedVacations, setLovedVacations] = useState([])
 
  useEffect(() => {
    const getFavorites = async ()=>{
      try {
        const res = await fetch('http://localhost:1000/vacations/favorites', {
                         method:"get",
                         headers:{"authorization":localStorage.token},
                        })
                        const data = await res.json()
                        console.log(data)
                        setLovedVacations(data)
         
      } catch (err) {
        console.log(err)
      }
    }
    console.log(lovedVacations)
    getFavorites()
  }, [])

  if(!userInfo.status){   
    if(!localStorage.token){
      history.push('/login')
    }
    return <div> Loading.... </div>
  }else{
    if(Date.now() > userInfo.status.exp * 1000){
      localStorage.removeItem("token")
      history.push('/login')
      }
  }

  return (
    <div className={classes.root} color="rgba(46, 161, 255, 0.897)">
    <AppBar position="static" id="toolbar" style={{ background: '#2c91e4e5' }}>
      <Toolbar id="toolbar" >
        <IconButton edge="start" color="inherit" aria-label="menu" className={classes.menuButton}>
          <MenuIcon />
        </IconButton>
        <Typography variant="h5" id= "greetings" className={classes.title}>
          Hello {userInfo.status.username}
        </Typography> 
        <Tooltip title="Home">
         <HomeIcon id="homeBtn" color="white" className={classes.menuButton} onClick={()=> history.push('/home')}/>
        </Tooltip>
        <Tooltip title="Logout">
         <ExitToAppIcon color="inherit" id="logoutBtn" onClick={()=>{
           localStorage.removeItem("token")
           history.push('/login')
           }}> </ExitToAppIcon> 
        </Tooltip>
      </Toolbar>
    </AppBar>
     <div className="vac-list">
      {lovedVacations && lovedVacations?.map(loved=> (<VacItem vacation={loved} />))}
     </div>
    </div>
  )
}


