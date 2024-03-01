import { writable } from "svelte/store";

export const modal = writable("");
export const showModal = writable(false);
export const apiUrl = writable("http://localhost:8000");
export const apiWsUrl = writable("ws://localhost:8000");
export const apiKey = writable("");
export const username = writable("");
export const messageHistories = writable({});
export const currentChat = writable("");