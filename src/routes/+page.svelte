<script>
    import "../lib/assets/style.css";
    import Modal from "../lib/Modal.svelte";
    import { modal, showModal, apiUrl } from "../lib/stores.js";
    import { browser } from "$app/environment";

    let motd = "";
    if (browser) {
        fetch(`${$apiUrl}/motd`)
            .then((res) => res.text())
            .then((resText) => {
                motd = resText;
            });
    }
</script>

<Modal />

<div id="landing">
    <h1><img src="/src/lib/assets/imgs/logo.svg" alt="logo" />Peer</h1>
    <p>
        {motd}
    </p>
    <div id="buttons">
        <span class="btn-secondary"><button on:click={
            () => {
                modal.set("loginModal");
                showModal.set(!$showModal);
            }
        }>Log in</button></span>
        <span class="btn"><button on:click={
            () => {
                modal.set("createAccountModal");
                showModal.set(!$showModal);
            }
        }>Sign up</button></span>
    </div>
</div>

<style>
    #buttons {
        position: relative;
        top: 10px;
        left: 20%;
    }
    #buttons .btn-secondary button {
        margin-right: 5px;
    }
</style>