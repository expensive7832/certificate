
import { combineReducers, configureStore } from "@reduxjs/toolkit";
import {
  useSelector as rawUseSelector,
  TypedUseSelectorHook,
  useDispatch as rawUseDispatch
} from "react-redux";
import { persistStore, persistReducer } from 'redux-persist'
import storage from 'redux-persist/lib/storage' // defaults to localStorage for web
 
import userReducer from "./slices/userslice";

const persistConfig = {
    key: 'root',
    storage,
    devTools: process.env.NODE_ENV !== 'production',
  }

const rootReducer = combineReducers({
    user: userReducer,
})

const persistedReducer = persistReducer(persistConfig, rootReducer) 

export const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({ serializableCheck: false })
});

export const persistor = persistStore(store);

export type AppDispatch = typeof store.dispatch;
export type RootState = ReturnType<typeof store.getState>;
export const useSelector: TypedUseSelectorHook<RootState> = rawUseSelector;
export const useDispatch = () => rawUseDispatch<AppDispatch>();
