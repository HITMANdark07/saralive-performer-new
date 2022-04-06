import { userActionTypes } from './user.types';

export const setCurrentUser = (user) => ({
        type: userActionTypes.SET_CURRENT_USER,
        payload: user 
})
export const setData = (data) => ({
        type:userActionTypes.SET_DATA,
        payload:data
})
export const setNotification = (data) => ({
        type:userActionTypes.SET_NOTIFICATION,
        payload:data
})
