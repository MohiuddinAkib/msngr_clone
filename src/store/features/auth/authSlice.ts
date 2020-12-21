import moment from "moment";
import { IThunkApi } from "@store/types/IThunkApi";
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { COLLECTIONS } from "@src/api/firebaseClientApi";

interface IRegisterData {
  email: string;
  password: string;
  last_name: string;
  first_name: string;
}

const initialState = {
  something: "",
};

export const logout = createAsyncThunk<void, void, IThunkApi>(
  "auth/logout",
  async (data: void, thunkApi) => {
    try {
      const state = thunkApi.getState();
      const auth = state.firebase.auth;
      const firebase = thunkApi.extra.getFirebase();

      await firebase
        .database()
        .ref(COLLECTIONS.presence)
        .child(auth.uid)
        .update({
          state: "offline",
          last_changed: moment().toISOString(),
        });

      await firebase.logout();
    } catch (error) {
      thunkApi.rejectWithValue(error);
    }
  }
);

export const register = createAsyncThunk<void, IRegisterData, IThunkApi>(
  "auth/register",
  async (values, thunkApi) => {
    try {
      const firebase = thunkApi.extra.getFirebase();
      const { email, password, ...profile } = values;
      await firebase.createUser({ email, password }, profile);
    } catch (error) {
      thunkApi.rejectWithValue(error);
    }
  }
);

export const login = createAsyncThunk<
  void,
  Pick<IRegisterData, "email" | "password">,
  IThunkApi
>("auth/login", async (values, thunkApi) => {
  try {
    const firebase = thunkApi.extra.getFirebase();
    await firebase.login(values);
  } catch (error) {
    thunkApi.rejectWithValue(error);
  }
});

export const authSlice = createSlice({
  name: "auth",
  reducers: {},
  initialState,
  extraReducers: (builder) => {
    builder
      .addCase(login.fulfilled, (state) => {})
      .addCase(logout.fulfilled, (state) => {})
      .addCase(register.fulfilled, (state) => {});
  },
});
