import { Ajax } from "./ajax.js";

const api = new Ajax({
    baseUrl: "https://jsonplaceholder.typicode.com",
    timeout: 5000
});

async function test() {

    console.log("GET /posts/1");
    const post = await api.get("/posts/1");
    console.log(post);

    console.log("POST /posts");
    const newPost = await api.post("/posts", {
        title: "Hello world",
        body: "Lorem ipsum",
        userId: 1
    });
    console.log(newPost);

    console.log("PUT /posts/1");
    const updated = await api.put("/posts/1", {
        title: "Updated title",
        body: "Updated body",
        userId: 1
    });
    console.log(updated);

    console.log("DELETE /posts/1");
    const deleted = await api.delete("/posts/1");
    console.log(deleted);
}

test().catch(console.error);
