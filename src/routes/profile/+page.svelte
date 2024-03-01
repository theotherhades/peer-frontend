<script>
    // @ts-nocheck

    // Basic profile page (/profile)
    import "../../lib/assets/style.css";
    import Sidebar from "../../lib/Sidebar.svelte";
    import { apiUrl } from "../../lib/stores.js";
    import { browser } from "$app/environment";

    let loaded = false;
    let username = "";
    let discriminator = "";
    let id = "";

    if (browser) {
        fetch(`${$apiUrl}/user/${sessionStorage.getItem("id")}`)
            .then((res) => res.text())
            .then((resText) => JSON.parse(resText))
            .then((resData) => {
                username = resData.username;
                discriminator = resData.discriminator;
                id = resData._id;
                loaded = true;
            });
    }
</script>

<Sidebar />

<div id="main-home">
    <h1>Profile</h1>
    {#if !loaded}
        <span class="text"><i>Loading...</i></span>
    {:else}
        {#if discriminator[0] < 2}
            <img src="/src/lib/assets/imgs/pfp-blue.png" alt="Blue default smiley face" class="pfp-profilepage" />
        {:else if discriminator[0] < 4}
            <img src="/src/lib/assets/imgs/pfp-green.png" alt="Green default smiley face" class="pfp-profilepage" />
        {:else if discriminator[0] < 6}
            <img src="/src/lib/assets/imgs/pfp-orange.png" alt="Orange default smiley face" class="pfp-profilepage" />
        {:else if discriminator[0] < 8}
            <img src="/src/lib/assets/imgs/pfp-red.png" alt="Red default smiley face" class="pfp-profilepage" />
        {:else}
            <img src="/src/lib/assets/imgs/pfp-yellow.png" alt="Yellow default smiley face" class="pfp-profilepage" />
        {/if}
        <span class="text">{username}#{discriminator}</span><br>
        <span class="text">ID: {id}</span>
    {/if}
</div>