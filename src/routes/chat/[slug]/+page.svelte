<script>
    // @ts-nocheck

    // The main chat page (/chat/<id>)
    export let data;
    import Modal from "../../../lib/Modal.svelte";
    import Sidebar from "../../../lib/Sidebar.svelte";
    import { apiUrl, showModal, messageHistories, apiKey, modal, currentChat } from "../../../lib/stores.js";
    import { parseForm } from "../../../lib/utils.js";
    import WsManager from "../../../lib/wsmanager.js";
    import { browser } from "$app/environment";
    import "../../../lib/assets/style.css";
    
    let loaded = false;
    let loadingText;
    let chatName;
    const requestedId = data.slug;

    async function getUsername(id) {
        let userData = await fetch(`${$apiUrl}/user/${id}`);
        return JSON.parse(await userData.text()).username;
    }

    async function getAllUsernames(chatHistory) {
        let newChatHistory = [];
        let cachedUsernames = {};
        let cachedDiscriminators = {};
        let userFetch;

        for (const message of chatHistory) {
            if (!Object.keys(cachedUsernames).includes(message.author)) {
                console.log(`Fetching user ${message.author}`);
                userFetch = JSON.parse(await (await fetch(`${$apiUrl}/user/${message.author}`)).text());
                cachedUsernames[message.author] = userFetch.username;
                cachedDiscriminators[message.author] = userFetch.discriminator;
            } else {
                userFetch = {
                    username: cachedUsernames[message.author],
                    discriminator: cachedDiscriminators[message.author]
                };
            }

            newChatHistory.push({
                author: message.author,
                content: message.content,
                timestamp: message.timestamp,
                username: userFetch.username,
                discriminator: userFetch.discriminator
            });
        }
        return newChatHistory;
    }

    showModal.set(false);
    if (browser) {
        // Redirct to landing page if user is not logged in.
        if (sessionStorage.getItem("is_authed") === null) {
            window.location.replace("/");
        } else {
            let chatHistory;

            // WebSocket Manager for live messages.
            const ws = new WsManager(`chatfeed/${requestedId}`);
            window.ws = ws;
            ws.on("auth", () => {
                ws.send({
                    cmd: "auth",
                    val: {
                        apikey: sessionStorage.getItem("apikey")
                    }
                });
            });
            
            // Get the chat's data.
            loadingText = "Getting chat data...";
            console.log("Getting chat data");
            fetch(`${$apiUrl}/chat/${requestedId}`, { method: "GET" })
                .then((res) => res.text())
                .then((resText) => JSON.parse(resText))
                .then((chatData) => {
                    // Send the user to home if there is an error.
                    console.log(chatData.error);
                    if (chatData.error !== "") {
                        window.location.href = "/home";
                    }
                    chatName = chatData.name;
                    // Get the user's ID from the API.
                    console.log("Getting user data");
                    fetch(`${$apiUrl}/userid/${sessionStorage.getItem("username")}/${sessionStorage.getItem("discriminator")}`, { method: "GET" })
                        .then((res) => res.text())
                        .then((resText) => JSON.parse(resText))
                        .then((resData) => {
                            // Check if the user is indeed in the chat, and if not redirect to the homepage.
                            let userId = resData.userid;
                            console.log(chatData);
                            if (!chatData.members.includes(userId)) {
                                window.location.replace("/home");
                            } else {
                                // Fetch latest messages.
                                loadingText = "Fetching messages..."
                                if (/* Object.keys($messageHistories).includes(requestedId) */ false) {
                                    console.log("chicken butt");
                                    chatHistory = $messageHistories[requestedId];
                                } else {
                                    console.log("Getting messages");
                                    fetch(`${$apiUrl}/chatfetch/${requestedId}`, {
                                        method: "POST",
                                        headers: {
                                            apikey: $apiKey
                                        }
                                    })
                                        .then((res) => res.text())
                                        .then((resText) => JSON.parse(resText))
                                        .then((resData) => {
                                            chatHistory = resData.messages;
                                            console.log(chatHistory);
                                            
                                            console.log("Getting usernames");
                                            getAllUsernames(chatHistory)
                                                .then((newChatHistory) => {
                                                    // Only store up to three message history arrays.
                                                    if (Object.keys($messageHistories).length === 3) {
                                                        delete $messageHistories[Object.keys($messageHistories)[0]];
                                                        $messageHistories[requestedId] = newChatHistory;
                                                    } else {
                                                        $messageHistories[requestedId] = newChatHistory;
                                                    }

                                                    console.log("Binding WebSocket callbacks");
                                                    // Bind WebSocket callback.
                                                    ws.on("livemsg", (packet) => {
                                                        $messageHistories[requestedId].push(packet.val);
                                                        $messageHistories = $messageHistories;
                                                        //document.documentElement.scrollTop = document.documentElement.scrollHeight;
                                                        //console.log(document.documentElement.scrollTop);
                                                        window.scrollBy(0, document.documentElement.scrollHeight);
                                                    });

                                                    loaded = true;
                                                    console.log("Loaded");
                                                    console.log($messageHistories[requestedId]);
                                                    currentChat.set(requestedId);
                                                });
                                        });
                                }
                            }
                        });
                });
        }
    }
</script>

<Modal />
<Sidebar />

<div id="main-home">
    <div class="topbar">
        {#if loaded}
            <div class="action-buttons">
                <span class="btn"><button on:click={
                    () => {
                        modal.set("addMemberToChatModal");
                        showModal.set(!$showModal);
                    }
                }>Add member</button></span>
            </div>
        {/if}
        {#if chatName == undefined}
            <h1 class="chat-header">Loading</h1>
        {:else}
            <h1 class="chat-header">{chatName}</h1>
        {/if}
    </div>
    {#if !loaded}
        {#if loadingText == undefined}
            <span class="text"><i>Loading...</i></span>
        {:else}
            <span class="text"><i>{loadingText}</i></span>
        {/if}
    {:else}
    <!-- <div class="ten-ton-weight"></div> -->
        <div class="message-list-wrapper">
            <div class="chat-top">
                <span class="text"><svg class="icon-info" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path d="M12 22C6.47715 22 2 17.5228 2 12C2 6.47715 6.47715 2 12 2C17.5228 2 22 6.47715 22 12C22 17.5228 17.5228 22 12 22ZM12 20C16.4183 20 20 16.4183 20 12C20 7.58172 16.4183 4 12 4C7.58172 4 4 7.58172 4 12C4 16.4183 7.58172 20 12 20ZM11 7H13V9H11V7ZM11 11H13V17H11V11Z"></path></svg><i>This is the beginning of the chat.</i></span>
            </div>
            {#each $messageHistories[requestedId] as message}
                {#if "username" in message}
                    <div class="message">
                        {#if message.discriminator[0] < 2}
                            <img src="/src/lib/assets/imgs/pfp-blue.png" alt="Blue default smiley face" class="pfp" />
                        {:else if message.discriminator[0] < 4}
                            <img src="/src/lib/assets/imgs/pfp-green.png" alt="Green default smiley face" class="pfp" />
                        {:else if message.discriminator[0] < 6}
                            <img src="/src/lib/assets/imgs/pfp-orange.png" alt="Orange default smiley face" class="pfp" />
                        {:else if message.discriminator[0] < 8}
                            <img src="/src/lib/assets/imgs/pfp-red.png" alt="Red default smiley face" class="pfp" />
                        {:else}
                            <img src="/src/lib/assets/imgs/pfp-yellow.png" alt="Yellow default smiley face" class="pfp" />
                        {/if}
                        <div class="message-username-header">
                            <span class="text"><b>{message.username}</b></span>
                        </div>
                        <span class="text">{message.content}</span>
                    </div>
                {/if}
            {/each}
        </div>
        <form autocomplete="off" on:submit|preventDefault={
            (event) => {
                let data = parseForm(event);
                fetch(`${$apiUrl}/msg`, { method: "POST", headers: {
                    "chat_id": requestedId,
                    "author_apikey": sessionStorage.getItem("apikey"),
                    "timestamp": Date.now(),
                    "content": data.messageContent
                } });
                event.target.reset();
            }
        }>
            <div class="compose-message-form-wrapper">
                <input type="text" name="messageContent" placeholder="Write a message" />
                <input type="submit" value="Send" title="Or hit Enter" />
            </div>
        </form>
    {/if}
</div>

<style>
    .topbar .action-buttons {
        float: right;
    }

    /*
    .ten-ton-weight {
        display: inline-block;
        height: 100%;
        vertical-align: bottom;
        width: 0px;
    }
    */

    .message-list-wrapper {
        /*
        display: flex;
        flex-direction: column;
        */
        padding-bottom: 60px;
    }
    .message-list-wrapper .chat-top {
        padding-bottom: 20px;
    }

    .message {
        /*align-self: flex-end;*/
        padding-bottom: 16px;
    }
    .message .message-username-header {
        line-height: 100%;
        padding-bottom: 0;
    }
    .message .text {
        line-height: 100%;
        display: inline-block;
        inline-size: 600px;
        overflow-wrap: break-word;
        padding-top: 0;
    }

    .compose-message-form-wrapper {
        position: fixed;
        bottom: 0;
        background-color: var(--bg);
        padding-bottom: 16px;
    }
    .compose-message-form-wrapper input[type="text"] {
        width: 85vw;
        height: 30px;
    }
    .compose-message-form-wrapper input[type="submit"] {
        width: 60px;
        height: 32px;
    }
</style>