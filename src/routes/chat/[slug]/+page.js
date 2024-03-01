// @ts-nocheck
// Return the requested chat ID from the URL slug.

export async function load({ params }) {
    let chatId = params.slug;
    console.log(chatId);
    return {
        slug: chatId
    };
}