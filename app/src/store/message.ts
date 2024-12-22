import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import type { RootState } from '.';

export interface MessageState {
    message: string;
  }
const initialState: MessageState = {
    message: '',
};

export const messageSlice = createSlice({
    name: 'message',
    initialState,
    reducers: {
        setMessage: (state, action: PayloadAction<string>) => {
            state.message = action.payload;
        },
    },
})

export const { setMessage } = messageSlice.actions;

export const selectMessage = (state: RootState) => state.message.message;

export default messageSlice.reducer;