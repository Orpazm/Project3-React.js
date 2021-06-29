import React, { useEffect, useState } from 'react'
import { useSelector } from 'react-redux'
import VacItem from './VacItem'

export default function VacList({history}) {
  const [update, setUpdate] = useState(false);
  const userInfo = useSelector(state => state.checkUserReducer)
  const [allVacations, setAllVacations] = useState([])

  useEffect(() => {
    const getVacations = async () => {
     try {
       //checking if user is connected in order to get vacations
      if (userInfo.status.username){
        const res = await fetch('http://localhost:1000/vacations', {
         method:"get",
         headers:{"authorization":localStorage.token},
        })
        //checking if the response from the server is ok 
        if(res.status == 200){ 
          const data = await res.json()
          setAllVacations([...data.likedVacations,...data.vacations ])
        }else{
          //checking if the user's session has already expired and if so, removing his token 
          if(Date.now() > userInfo.status.exp * 1000){
            localStorage.removeItem("token")
            history.push('/login')
            }
         } 
        }
        } catch (err) {
            console.log(err)
        }
    }
    getVacations()
  }, [update])

  //returning a Loading msg if it is still loading 
  if(!userInfo.status){
    return <div> Loading.... </div>
  }

    return (
      <div className="vac-list">
        {allVacations && allVacations?.map(vacation=> (<VacItem key={vacation.id} vacation={vacation} setList={setAllVacations} />))}
      </div>
    )
  }



