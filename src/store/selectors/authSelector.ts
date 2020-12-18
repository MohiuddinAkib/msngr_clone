import { createSelector } from "@reduxjs/toolkit";
import { firebaseStateSelector } from './firebaseSelector';

export const authStateSelector = createSelector(firebaseStateSelector, (state) => state.auth)