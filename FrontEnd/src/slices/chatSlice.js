// slices/chatSlice.js
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axiosClient from "../utils/axiosClient";

// Async thunk to handle the API call
export const sendMessageToAi = createAsyncThunk(
    "chat/sendMessage",
    async (requestData, { rejectWithValue }) => {
        try {
            const response = await axiosClient.post("/ai/chat", requestData);
            // Return just the text string from the backend response
            return response.data.message;
        } catch (error) {
            console.error("AI API Error:", error);
            return rejectWithValue(
                error.response?.data?.message || "Failed to get AI response."
            );
        }
    }
);

const chatSlice = createSlice({
    name: "chat",
    initialState: {
        messages: [],
        isLoading: false,
        error: null,
    },
    reducers: {
        // Adds a user message immediately
        addMessage: (state, action) => {
            state.messages.push(action.payload);
        },
        // Adds the initial greeting if the chat is empty
        initializeChat: (state) => {
            if (state.messages.length === 0) {
                state.messages.push({
                    role: 'model',
                    parts: [{ text: "Hello! I'm your coding assistant. I can help you with this problem, explain concepts, or debug your code. What would you like to know?" }],
                    timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
                });
            }
        },
        clearChat: (state) => {
            state.messages = [];
            state.error = null;
        }
    },
    extraReducers: (builder) => {
        builder
            .addCase(sendMessageToAi.pending, (state) => {
                state.isLoading = true;
                state.error = null;
            })
            .addCase(sendMessageToAi.fulfilled, (state, action) => {
                state.isLoading = false;
                // Add the AI's successful response to the chat
                state.messages.push({
                    role: 'model',
                    parts: [{ text: action.payload }],
                    timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
                });
            })
            .addCase(sendMessageToAi.rejected, (state, action) => {
                state.isLoading = false;
                state.error = action.payload;
                // Add an error message bubble if the API fails
                state.messages.push({
                    role: 'model',
                    parts: [{ text: "Sorry, I encountered an error. Please try again in a moment." }],
                    timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
                });
            });
    }
});

export const { addMessage, initializeChat, clearChat } = chatSlice.actions;
export default chatSlice.reducer;