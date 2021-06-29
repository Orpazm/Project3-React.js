import jwt_decode from "jwt-decode"


export const checkUserReducer = (state = {}, action) => {
    console.log(action.type);
    if (action.type === "CHECK_USER") {
        if(localStorage.token){
            const decoded = jwt_decode(localStorage.token)
            console.log(decoded);
            return {...state , status:decoded }
        } 
        console.log("redux working");
      return state;
    } else {
      return state;
    }
  };

  export const storeVacations = (state = [], action) => {
    console.log(action.type);
    if (action.type === "STORE_VACATIONS") {
       state=action.payload
       console.log("vacation works", action.payload);
      return state;
    } else {
      return state;
    }
  };