<script>
    // @ts-nocheck

    // This svelte file is for testing
    import "../../lib/assets/style.css";
    import Modal from "../../lib/Modal.svelte";
    import WsManager from "../../lib/wsmanager.js";
    import { modal, showModal, apiUrl, apiKey, username } from "../../lib/stores.js";
    import { parseForm } from "../../lib/utils.js";
</script>

<Modal />

<div id="main">
    <div class="right">
        <span class="text">Username: {#if $username === ""}&lt;not set&gt;{:else}{$username}{/if}</span><br>
        <span class="text">API key: {#if $apiKey === ""}&lt;not set&gt;{:else}{$apiKey}{/if}</span>
    </div>
    <span class="text">welcome to the playground nerd</span>
    <br>
    <span class="btn">
        <button>Button</button>
    </span>
    <span class="btn-secondary">
        <button>Button</button>
    </span>
    <br>
    <form on:submit|preventDefault={
        (e) => {
            alert(JSON.stringify(parseForm(e)));
        }
    } autocomplete="off">
        <input type="text" name="textInputted" placeholder="Text input" />
        <input type="submit" value="Submit" />
    </form><br>
    <span class="btn">
        <button on:click={() => {
            modal.set("test");
            showModal.set(true);
        }}>Show modal</button>
    </span>
    <span class="btn">
        <button on:click={() => {
            modal.set("altTest");
            showModal.set(true);
        }}>Show other modal</button>
    </span>
    <br><br>
    <span class="text">Force modal</span>
    <form on:submit|preventDefault={
        (e) => {
            let newModal = parseForm(e);
            modal.set(newModal.forceModal);
            e.target.reset();
        }
    } autocomplete="off">
        <input type="text" name="forceModal" placeholder="Modal name" />
        <input type="submit" value="Set" />
    </form>
    <form on:submit|preventDefault={() => {
        showModal.set(true);
    }}>
        <input type="submit" value="Show current modal" />
    </form><br>
    <span class="text">API request</span><br>
    <form autocomplete="off" on:submit|preventDefault={
        (e) => {
            let requestData = parseForm(e);
            if (requestData.method === "") {
                requestData.method = "GET";
            }
            if (requestData.headers === "") {
                requestData.headers = "{}";
            }
            fetch(`${$apiUrl}${requestData.path}`, {
                method: requestData.method,
                headers: JSON.parse(requestData.headers)
            })
                .then((res) => res.text())
                .then((resText) => {
                    if (requestData.path === "/auth") {
                        apiKey.set(JSON.parse(resText).apikey);
                        username.set(`${JSON.parse(resText).rec_username}#${JSON.parse(resText).rec_discriminator}`);
                        sessionStorage.setItem("apikey", JSON.parse(resText).apikey);
                        sessionStorage.setItem("username", JSON.parse(resText).rec_username);
                        sessionStorage.setItem("discriminator", JSON.parse(resText).rec_discriminator);
                    }
                    console.log(resText);
                });
            
            console.log(requestData.path);
            console.log(requestData.method);
            console.log(requestData.headers);
        }
    }>
        <input type="text" name="path" placeholder="Request path" />
        <input type="text" name="method" placeholder="Method (leave blank for GET)" /><br>
        <input type="text" name="headers" placeholder="Headers (JSON format)" /><br>
        <input type="submit" value="Submit" />
    </form><br>
    <span class="text">WebSocket connection</span>
    <form autocomplete="off" id="ws-form" on:submit|preventDefault={
        (e) => {
            let formData = parseForm(e);
            const ws = new WsManager(formData.path);
            document.getElementById("ws-close").addEventListener("click", () => {
                ws.close();
                document.getElementById("ws-form").reset();
            })
            ws.on("auth", () => {
                ws.send(
                    {
                        cmd: "auth",
                        val: JSON.parse(formData.authdata)
                    }
                );
            });
        }
    }>
        <input type="text" name="path" placeholder="Connection path" />
        <input type="text" name="authdata" placeholder="Auth packet val" /><br>
        <input type="submit" value="Submit" />
        <input type="submit" value="Close connection" class="btn-secondary" id="ws-close" on:click|preventDefault /></form>
</div>

<style>
    .right {
        float: right;
    }
    .right .text {
        float: right;
    }
</style>