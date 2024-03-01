<script>
    // @ts-nocheck
    import "./assets/style.css";
    import { parseForm } from "./utils.js";
    import { modal, showModal, apiUrl, apiKey, username, currentChat } from "./stores.js";
    modal.subscribe(() => {
        if ($modal != "") {
            console.log(`Modal was set to "${$modal}"`);
        }
    })

    async function userDiscriminatorCheck(user) {
        let splitCheck = user.split("#");
        let userId;

        if (splitCheck.length === 2) {
            let resText = await(await fetch(`${$apiUrl}/userid/${splitCheck[0]}/${splitCheck[1]}`)).text();
            if (Object.keys(JSON.parse(resText)).includes("userid")) {
                userId = JSON.parse(resText).userid;
            } else {
                userId = "NOTFOUND";
            }
        } else {
            userId = user;
        }
        return userId;
    }

    let err;
</script>

{#if $showModal}
    {#if $modal === "test"}
        <div id="modal">
            <h2>Example Modal</h2>
            <span class="text">Here's some example text</span><br>
            <span class="btn">
                <input type="submit" value="Close" on:click={
                    () => {
                        showModal.set(false);
                    }
                } />
            </span>
        </div>
    {:else if $modal === "altTest"}
        <div id="modal">
            <h2>Other Example Modal</h2>
            <span class="text">Here's some lorem ipsum: Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed convallis arcu vitae enim vestibulum scelerisque. Nulla dignissim tellus neque. Vivamus efficitur enim id molestie tempor.</span><br>
            <input type="submit" value="Close" on:click={
                () => {
                    showModal.set(false);
                }
            } />
        </div>
    {:else if $modal === "loginModal"}
        <div id="modal">
            <center>
                <h2>Login to Peer</h2>
                <span class="text">Don't have an account? Create one <a href="." on:click={
                    () => {
                        modal.set("createAccountModal");
                    }
                }>here!</a></span>
                <br>
                <form autocomplete="off" on:submit|preventDefault={
                    (e) => {
                        let formData = parseForm(e);
                        fetch(`${$apiUrl}/auth`, {
                            method: "POST",
                            headers: {
                                username: formData.username,
                                pswd: formData.pswd
                            }
                        })
                            .then((res) => res.text())
                            .then((resText) => {
                                let resData = JSON.parse(resText);

                                /*
                                    Sets sessionStorage keys:
                                    is_authed: A stringified boolean confirming the user has logged in successfully.
                                    username: The user's username (excluding the discriminator)
                                    discriminator: The user's discriminator.
                                    apikey: The API key assigned by the server.
                                */
                                sessionStorage.setItem("is_authed", "true");
                                sessionStorage.setItem("username", resData.rec_username);
                                sessionStorage.setItem("discriminator", resData.rec_discriminator);
                                sessionStorage.setItem("apikey", resData.apikey);
                                sessionStorage.setItem("id", resData._id);
                                apiKey.set(resData.apikey);
                                username.set(`${resData.rec_username}#${resData.rec_discriminator}`);

                                console.log(resData);
                                window.location.replace("/home");
                            });
                    }
                }>
                    <input type="text" placeholder="Username" name="username" style="margin-bottom: 10px; margin-top: 10px;" /><br>
                    <input type="password" placeholder="Password" name="pswd" /><br><br>
                    <input type="submit" value="Login" />
                    <input type="submit" class="input-button-secondary" value="Close" on:click|preventDefault={
                        () => {
                            showModal.set(false);
                        }
                    } />
                </form>
            </center>
        </div>
    {:else if $modal === "createAccountModal"}
        <div id="modal">
            <center>
                <h2>Sign up</h2>
                <span class="text">Already have an account? Log in <a href="." on:click={
                    () => {
                        modal.set("loginModal");
                    }
                }>here!</a></span>
                <br>
                <form autocomplete="off" on:submit|preventDefault={
                    (e) => {
                        let formData = parseForm(e);
                        let newDiscriminator = "";
                        for (const i of [...Array(4).keys()]) {
                            newDiscriminator += Math.floor(Math.random() * 10);
                        }

                        fetch(`${$apiUrl}/register_user`, {
                            method: "POST",
                            headers: {
                                username: formData.username,
                                pswd: formData.pswd,
                                discriminator: newDiscriminator
                            }
                        })
                            .then((res) => res.text())
                            .then((resText) => {
                                let resData = JSON.parse(resText);
                                console.log(resText);

                                fetch(`${$apiUrl}/auth`, {
                                    method: "POST",
                                    headers: {
                                        username: resData.user,
                                        pswd: formData.pswd
                                    }
                                })
                                    .then((res) => res.text())
                                    .then((resText) => {
                                        let resData = JSON.parse(resText);

                                        sessionStorage.setItem("is_authed", "true");
                                        sessionStorage.setItem("username", resData.rec_username);
                                        sessionStorage.setItem("discriminator", resData.rec_discriminator);
                                        sessionStorage.setItem("apikey", resData.apikey);
                                        sessionStorage.setItem("id", resData._id);
                                        apiKey.set(resData.apikey);
                                        username.set(`${resData.rec_username}#${resData.rec_discriminator}`);

                                        console.log(resData);
                                        window.location.replace("/home");
                                    });
                            });
                    }
                }>
                    <input type="text" placeholder="Username" name="username" style="margin-bottom: 10px; margin-top: 10px;" /><br>
                    <input type="password" placeholder="Password" name="pswd" /><br><br>
                    <input type="submit" value="Sign up" />
                    <input type="submit" class="input-button-secondary" value="Close" on:click|preventDefault={
                        () => {
                            showModal.set(false);
                        }
                    } />
                </form>
            </center>
        </div>
    {:else if $modal === "searchModal"}
        <div id="modal">
            <h2>Search</h2>
            <span class="text">Search for users and public groupchats.</span><br>
            <form autocomplete="off" on:submit|preventDefault={
                () => {

                }
            } style="margin-bottom: 10px; margin-top: 5px;">
                <input type="text" placeholder="What are you looking for?" name="query" />
                <input type="submit" value="Search" />
            </form>
            <input type="submit" class="input-button-secondary" value="Close" on:click|preventDefault={
                () => {
                    showModal.set(false);
                }
            } />
        </div>
    {:else if $modal === "createChatModal"}
        <div id="modal">
            <h2>Create chat</h2>
            <form autocomplete="off" on:submit|preventDefault={
                (e) => {
                    let formData = parseForm(e);

                    fetch(`${$apiUrl}/create_chat`, {
                        method: "POST",
                        headers: {
                            chat_name: formData.name,
                            chat_owner_apikey: sessionStorage.getItem("apikey")
                        }
                    })
                        .then((res) => res.text())
                        .then((resText) => JSON.parse(resText))
                        .then((resData) => {
                            window.location.href = `/chat/${resData.id}`;
                        })
                }
            } style="margin-bottom: 2px;">
                <input type="text" placeholder="Chat name" name="name" />
                <input type="submit" value="Create" />
            </form>
            <input type="submit" class="input-button-secondary" value="Cancel" on:click|preventDefault={
                () => {
                    showModal.set(false);
                }
            } />
        </div>
    {:else if $modal === "addMemberToChatModal"}
        <div id="modal">
            <h2>Add a member</h2>
            <form autocomplete="off" on:submit|preventDefault={
                (e) => {
                    let formData = parseForm(e);
                    userDiscriminatorCheck(formData.user)
                        .then((userId) => {
                            if (userId === "NOTFOUND") {
                                console.log(`Tried to add user ${userId} to chat but API returned NOTFOUND`);
                                modal.set("userNotFoundModal");
                            } else {
                                console.log($currentChat);
                                fetch(`${$apiUrl}/add_to_chat`, {
                                    method: "POST",
                                    headers: {
                                        inviter_apikey: sessionStorage.getItem("apikey"),
                                        invitee: userId,
                                        chat_id: $currentChat
                                    }
                                })
                                    .then((res) => res.text())
                                    .then((resText) => JSON.parse(resText))
                                    .then((resData) => {
                                        if (resData.error == "") {
                                            modal.set("successfullyAddedMemberModal");
                                        } else {
                                            modal.set("failedToAddMemberModal");
                                        }
                                    });
                            }
                        });
                }
            } style="margin-bottom: 2px;">
                <input type="text" placeholder="ExampleUser#1234 (or ID)" name="user" />
                <input type="submit" value="Add" />
            </form>
            <input type="submit" class="input-button-secondary" value="Cancel" on:click|preventDefault={
                () => {
                    showModal.set(false);
                }
            } />
        </div>
    {:else if $modal === "userNotFoundModal"}
        <div id="modal">
            <h2>User Not Found</h2>
            <span class="text">Sorry, but that user wasn't found. Check your spelling and try again.</span><br>
            <input type="submit" class="input-button" value="Close" on:click|preventDefault={
                () => {
                    showModal.set(false);
                }
            } />
        </div>
    {:else if $modal === "successfullyAddedMemberModal"}
        <div id="modal">
            <h2>Success</h2>
            <span class="text">Successfully added the user to the groupchat.</span><br>
            <input type="submit" class="input-button" value="Close" on:click|preventDefault={
                () => {
                    showModal.set(false);
                }
            } />
        </div>
    {:else if $modal === "failedToAddMemberModal"}
        <div id="modal">
            <h2>An Error Occurred</h2>
            <span class="text">Failed to add the user to the groupchat; an error occurred.</span>
            <input type="submit" class="input-button" value="Close" on:click|preventDefault={
                () => {
                    showModal.set(false);
                }
            } />
        </div>
    {:else if $modal === "confirmLogoutModal"}
        <div id="modal">
            <h2>Log out?</h2>
            <span class="text">Are you sure you want to log out?</span><br>
            <input type="submit" class="input-button-secondary" value="Cancel" on:click|preventDefault={
                () => {
                    showModal.set(false);
                }
            } />
            <input type="submit" class="input-button-danger" value="Log out" on:click|preventDefault={
                () => {
                    showModal.set(false);
                    sessionStorage.clear();
                    window.location.href = "/";
                }
            } />
        </div>
    {:else}
        <div id="modal">
            <h2>super secret modal</h2>
            <span class="text">woah thats crazy</span><br>
            <span class="text"><p>$modal is currently set to "{$modal}"</p></span>
                <input type="submit" value="Close" on:click={
                    () => {
                        showModal.set(false);
                    }
                } />
        </div>
    {/if}
    <div class="dim"></div>
{/if}

<style>
    .dim {
        display: block;
        background: black;
        opacity: 0.5;
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        z-index: 2;

    }
    #modal {
        z-index: 3;
        position: fixed;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -80%);
        background-color: #384268;
        border-radius: 5px;
        padding: 20px 20px;
        max-width: 400px;
    }
    #modal h2 {
        color: white;
        margin: 0;
    }
    #modal .text {
        color: #CECECE;
    }

</style>