"use client"
import { PayloadAction, createSlice } from "@reduxjs/toolkit";

// interface userDataProps{
//     name: string;
//     email: string;
//     password: string;
//     _id: string;
//     phoneNumber: string;
//     admin: boolean;
//     staff: boolean;
//     active: boolean;
//     imgUrl: string;
//     imgId: string;
//     token: string;
// }


interface userProps{
    login: boolean;
    token?: string;
    user:{
        role: string,
        fname: string, 
        lname: string, 
        email: string
    }

}



const initialState: userProps = {
    login: false,
    token: "",
    user:{
        role: "",
        fname: "", 
        lname: "", 
        email: "",
    }
    
};

const userSlice = createSlice({
    name: "user",
    initialState,
    reducers: {
        login: (state, {payload}) => {
            state.login = true;
            state.token = payload.token,
            state.user = payload.data
            
        },
        logout: (state) => {
            state.login = false;
            state.token = "",
            state.user = {
                role: "",
                fname: "", 
                lname: "", 
                email: "",
            }
        },
        
    }
})


export default userSlice.reducer;
export const { login, logout } = userSlice.actions;