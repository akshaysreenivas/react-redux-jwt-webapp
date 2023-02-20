
import {configureStore} from '@reduxjs/toolkit'
import editUserReducer from "../features/UserSlice"

export default configureStore({
    reducer:{
        user:editUserReducer
    }
})