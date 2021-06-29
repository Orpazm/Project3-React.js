import React, { useState, useEffect }  from 'react'
import { makeStyles } from '@material-ui/core/styles';
import Card from '@material-ui/core/Card';
import CardHeader from '@material-ui/core/CardHeader';
import CardMedia from '@material-ui/core/CardMedia';
import CardContent from '@material-ui/core/CardContent';
import CardActions from '@material-ui/core/CardActions';
import IconButton from '@material-ui/core/IconButton';
import Typography from '@material-ui/core/Typography';
import FavoriteIcon from '@material-ui/icons/Favorite';
import { useSelector } from 'react-redux'
import EditIcon from '@material-ui/icons/Edit';
import DeleteIcon from '@material-ui/icons/Delete';
import moment from 'moment';
import Tooltip from '@material-ui/core/Tooltip';
import TextField from '@material-ui/core/TextField';
import SaveIcon from '@material-ui/icons/Save';
import ArrowBackIcon from '@material-ui/icons/ArrowBack';
import ToggleButton from '@material-ui/lab/ToggleButton';
import { MuiPickersUtilsProvider } from '@material-ui/pickers';
import DateFnsUtils from '@date-io/date-fns';
import { DatePicker } from '@material-ui/pickers';
import { useLocation } from 'react-router-dom'

const useStyles = makeStyles((theme) => ({
    root: {
      maxWidth: 345,
    },
    media: {
      height: 0,
      paddingTop: '56.25%', // 16:9
    },
  }));

  
export default function VacItem({vacation, history, setList, match}) {

    const [update, setUpdate] = useState(false);
    const userInfo = useSelector(state => state.checkUserReducer)
    const classes = useStyles();
    const [isEdit, setIsEdit] = useState(false)
    const [description, setDescription] = useState(vacation.description)
    const [destination, setDestination] = useState(vacation.destination)
    const [from_date, setFrom_date] = useState(vacation.from_date)
    const [to_date, setTo_date] = useState(vacation.to_date)
    const [price, setPrice] = useState(vacation.price)
    const [img, setImg] = useState(vacation.img)
    const [selected, setSelected] = useState(false)
    const location = useLocation()

    //setting from_date to the date selected 
    const handleFromDateChange = (date) => {
     setFrom_date(date);
    };

    //setting to_date to the date selected 
    const handleToDateChange = (date) => {
     setTo_date(date);
    };

    //showing the user his loved and rest of vacations 
    useEffect(() => {
        if(vacation.user_id == userInfo.status.id ){
          setSelected(true)
        }else{
          setSelected(false)
        }  
    })

    //changing the format of the dates shown in each vacation item
    const fdate= moment(vacation.from_date).format('DD/MM/YYYY')
    const tdate= moment(vacation.to_date).format('DD/MM/YYYY')
  
    return (
       //showing the admin the correct version of each vacation item (edit/not edit)
      <div id="itemDiv">
        {isEdit? <Card className={classes.root} id="card" >
      <CardHeader
        action=
            {userInfo.status.role === "admin" && <span>
              <Tooltip title="Back">
                <ArrowBackIcon id="backBtn" onClick={async(e)=>{
                    try {
                        setIsEdit(!isEdit)
                        setUpdate(!update)       
                    } catch (err) {
                        console.log(err)
                    }
                  }}  ></ArrowBackIcon>
              </Tooltip>
              <Tooltip title="Save changes">
                <SaveIcon id="saveBtn" onClick={async(e)=>{
                    try {
                        setIsEdit(!isEdit)
                        if(!localStorage.token){
                            history.push('/login')
                        }
                        const res = await fetch('http://localhost:1000/vacations', {
                            method:"put",
                            headers:{"content-type":"application/json",
                                     "authorization": localStorage.token},
                            body: JSON.stringify({id: vacation.id, description, destination, from_date, to_date, price, img})
                        })
                        const data = await res.json()
                        setDestination(vacation.destination)
                        setList([...data.likedVacations,...data.vacations])
                        setUpdate(!update)
                    } catch (err) {
                        console.log(err)
                    }
                  }}/> 
              </Tooltip>
              <Tooltip title="Delete vacation">
                <DeleteIcon id="deleteBtn" onClick={async(e)=>{
                    try {
                        console.log( vacation.id);
                        if(!localStorage.token){
                            history.push('/login')
                        }
                        const res = await fetch('http://localhost:1000/vacations', {
                            method:"delete",
                            headers:{"content-type":"application/json",
                                     "authorization": localStorage.token},
                            body: JSON.stringify({id: vacation.id})
                        })
                        const data = await res.json()
                        setList([...data.likedVacations,...data.vacations])
                        setUpdate(!update)
                    } catch (err) {
                        console.log(err)
                    }
                  }}/> 
              </Tooltip>
            </span>
           }
      />
      <CardContent>
         <TextField
           required
           id="filled-basic" 
           label="Destination"
           defaultValue={vacation.destination}
           variant="filled"
           onChange={e=>{
               setDestination(e.target.value)
            }}
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
            label="Img"
            defaultValue={vacation.img}
            variant="filled"
            onChange={e=>{
                setImg(e.target.value)}}
          />
          <TextField
            required
            id="filled-basic" 
            label="Description"
            defaultValue={vacation.description}
            variant="filled"
            onChange={e=>{
                setDescription(e.target.value)}}
          />
          <TextField
            required
            id="filled-basic" 
            label="Price"
            defaultValue={vacation.price}
            variant="filled"
            onChange={e=>{
                setPrice(e.target.value)}}
          />
      </CardContent>
    </Card> 
      :
    <Card className={classes.root} id="card">
       <CardHeader
        action=
            {userInfo.status.role === "admin" && <span>
              <Tooltip title="Edit">
                <EditIcon id="editBtn" onClick={async(e)=>{
                    try {
                        setIsEdit(!isEdit)
                        setUpdate(!update)
                    } catch (err) {
                        console.log(err)
                    }
                  }}/> 
              </Tooltip>
              <Tooltip title="Delete">
                <DeleteIcon id="deleteBtn" onClick={async(e)=>{
                    try {
                        console.log(vacation.id);
                        if(!localStorage.token){
                            history.push('/login')
                        }
                        const res = await fetch('http://localhost:1000/vacations/admin', {
                            method:"delete",
                            headers:{"content-type":"application/json",
                                     "authorization": localStorage.token},
                            body: JSON.stringify({id: vacation.id})
                        })
                        const data = await res.json()
                        setList([...data.likedVacations,...data.vacations])
                        setUpdate(!update)
                    } catch (err) {
                        console.log(err)
                    }
                  }}/> 
              </Tooltip>
            </span>
           }

        title={vacation.destination}
        subheader= {fdate + "-" + tdate }
      />
      <CardMedia
        className={classes.media}
        image={vacation.img}
        title="Vacation img"
      />
      <CardContent>
        <Typography variant="body2" color="textSecondary" component="p">
          {vacation.description}
        </Typography>
          {vacation.price}$
      </CardContent>
        {vacation.followers}
      <CardActions disableSpacing>
      {userInfo.status.role === "user" &&  <div>
                   <ToggleButton
                     value="check"
                     selected={selected}
                     id="togbtn"  
                    >            
                         {selected ? <IconButton id="loveBtn" aria-label="add to favorites" onClick={async(e)=>{
                             try {
                             const res = await fetch('http://localhost:1000/vacations', {
                              method:"delete",
                              headers:{"content-type":"application/json",
                                      "authorization": localStorage.token},
                              body: JSON.stringify({id: vacation.id})
                             })
                              const data = await res.json()
                              setSelected(!selected)
                              if(location.pathname.includes("home")){
                                setList([...data.likedVacations,...data.vacations])
                              }else {
                                window.location.href=('/favorites')
                              }
                              setUpdate(!update)
                            } catch (err) {
                               console.log(err)
                              }
                          }}> 
                         <FavoriteIcon id="loveit" style={{color:"red"}}  /> </IconButton>  :
                         <IconButton id="loveBtn" aria-label="add to favorites" onClick={async(e)=>{
                            try {
                              console.log(userInfo)
                              const res = await fetch('http://localhost:1000/vacations', {
                                            method:"post",
                                            headers:{"content-type":"application/json",
                                                     "authorization": localStorage.token},
                                            body: JSON.stringify({user_id: userInfo.status.id, vac_id: vacation.id})
                                        })
                                        const data = await res.json()
                                        setList([...data.likedVacations,...data.vacations])
                                        setSelected(!selected)
                                        setUpdate(!update)
                            } catch (err) {
                               console.log(err)
                            }
                          }} >
                          <FavoriteIcon id="loveit" style={{color:"grey"}}  />  </IconButton>
                           }
                    </ToggleButton>   
        </div>
        }
      </CardActions>
      </Card>  
      }
      </div>
    )
}
