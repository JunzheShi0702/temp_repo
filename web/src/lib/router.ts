import { BASE_URL } from "@/env";
import { createRouter } from "@nanostores/router";

const $router = createRouter({
    homepage: `${BASE_URL}/`,
    post: `${BASE_URL}posts/:postId`,
    login: `${BASE_URL}login`,
    register: `${BASE_URL}register`,
});

export default $router;
