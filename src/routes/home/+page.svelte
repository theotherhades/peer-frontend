<script>
    // @ts-nocheck

    // The homepage (/home)
    import "../../lib/assets/style.css";
    import Modal from "../../lib/Modal.svelte";
    import Sidebar from "../../lib/Sidebar.svelte";
    import { modal, showModal, apiUrl } from "../../lib/stores.js";
    import { browser } from "$app/environment";

    let chats = {};
    let chatsLoaded = false;

    async function chatFetch(chatId) {
        let rawData = await (await fetch(`${$apiUrl}/chat/${chatId}`)).text();
        return JSON.parse(rawData);
    }

    showModal.set(false);
    if (browser) {
        // Redirct to landing page if user is not logged in.
        if (sessionStorage.getItem("is_authed") === null) {
            window.location.replace("/");
        }

        // Get array of chats the user is in from the server.
        fetch(`${$apiUrl}/userid/${sessionStorage.getItem("username")}/${sessionStorage.getItem("discriminator")}`)
            .then((res) => res.text())
            .then((resText) => JSON.parse(resText))
            .then((resData) => {
                // Redirect to landing page if user is invalid.
                if (resData.error !== "") {
                    window.location.replace("/");
                }
                fetch(`${$apiUrl}/user/${resData.userid}`)
                    .then((res) => res.text())
                    .then((resText) => JSON.parse(resText))
                    .then((resData) => {
                        if (Object.keys(resData).includes("chats")) {
                            for (const chat of resData.chats) {
                                chatFetch(chat).then(
                                    (chatData) => {
                                        chats[chat] = chatData;
                                    }
                                );
                            }
                        }
                        chatsLoaded = true;
                        console.log(chats);
                    });
            });
    }
</script>

<Modal />
<Sidebar />

{#if browser}
    <div id="main-home">
        <div class="action-buttons">
            <span class="btn"><button on:click={
                () => {
                    modal.set("createChatModal");
                    showModal.set(true);
                }
            }>Create chat</button></span>
        </div>
        <h1>Home</h1>
        <span class="text">Hi, {sessionStorage.getItem("username")}#{sessionStorage.getItem("discriminator")}! This is your homepage.</span><br>
        <span class="text">You could try <a href="." on:click|preventDefault={
            () => {
                modal.set("createChatModal");
                showModal.set(true);
            }
        }>create a chat</a>, <a href="/profile">check out your profile</a>, or just explore! It's up to you :)</span><br>
        <h3>Chats</h3>
        {#if !chatsLoaded}
            <span class="text"><i>Loading chats...</i></span>
        {:else}
            {#if Object.keys(chats).length === 0}
                <span class="text">It looks like you aren't in any chats yet.</span>
            {:else}
                {#each Object.keys(chats) as chatId}
                    <a href="/chat/{chatId}">{chats[chatId].name}</a>
                {/each}
            {/if}
        {/if}
    </div>
{/if}

<style>
    .action-buttons {
        float: right;
    }
</style>