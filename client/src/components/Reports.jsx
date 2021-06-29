import React, { useEffect, useState } from 'react'
import { Bar } from 'react-chartjs-2'
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
import { useDispatch } from "react-redux";
import moment from 'moment';
import AddCircleIcon from '@material-ui/icons/AddCircle';

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

export default function Reports({history}) {

    const [chartData, setChartData] = useState({})
    const userInfo = useSelector(state => state.checkUserReducer)
    const classes = useStyles();
    const dispatch = useDispatch();

    //getting the reports 
    const getReports = async () => {
        try {
            dispatch({
                type: "CHECK_USER"
            })
         const res = await fetch('http://localhost:1000/reports', {
         method:"get",
         headers:{"authorization":localStorage.token},
        })
        const data = await res.json()
        let destination=[]
        let followers=[]

        for (const d of data) {
            //changing the format of the dates shown in each vacation column
            const fdate= moment(d.from_date).format('DD/MM/YYYY')
            const tdate= moment(d.to_date).format('DD/MM/YYYY')
            //inserting into destination an array with the destination and dates of the vacations
            destination.push([d.destination,fdate,tdate])
            //inserting into followers the number of followers for each vacation 
            followers.push(d.followers)
        }

        //setting the chart 
        setChartData({
            labels: destination,
            datasets: [
                {
                    label: "Followers",
                    data: followers,
                    backgroundColor:"rgba(42, 147, 233, 0.897)",
                    hoverBackgroundColor:"rgba(46, 161, 255, 0.897)",
                    borderWidth: 1,
                    hoverBorderWidth:2,
                    barThickness:60,
                }
            ]
        })    
        } catch (err) {
            console.log(err)
        }
    }

    useEffect(() => {
        getReports() 
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
        <div id="reportdiv">
            <AppBar position="static" id="toolbar" style={{ background: '#2c91e4e5' }}>
             <Toolbar id="toolbar">
              <IconButton edge="start" color="inherit" aria-label="menu" className={classes.menuButton}>
               <MenuIcon />
              </IconButton>
              <Typography variant="h5" id= "greetings" className={classes.title}>
                Hello {userInfo.status.username}
              </Typography>
              <Tooltip title="Add vacation">
               <AddCircleIcon id="addVacBtn" color="white" aria-label="add" size="small" className={classes.menuButton}
                onClick={()=> history.push("/add")}>
               </AddCircleIcon>
              </Tooltip>
              <Tooltip title="Home">
               <HomeIcon id="homeBtn" color="white" className={classes.menuButton} 
                onClick={()=>history.push('/home')}/>
              </Tooltip>
              <Tooltip title="Logout">
               <ExitToAppIcon color="inherit" id="logoutBtn" onClick={()=>{
                localStorage.removeItem("token")
                history.push('/login')
                }}> 
               </ExitToAppIcon> 
              </Tooltip>
             </Toolbar>
            </AppBar>
            <h1 id="reportsTitle">Vacation reports</h1>
            <Bar
                data={chartData}
                  height={120}
            />
        </div>
    )
}

