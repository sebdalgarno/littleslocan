import preprocess from "svelte-preprocess";
const netlify = require('@sveltejs/adapter-netlify');
/** @type {import('@sveltejs/kit').Config} */
const config = {
    kit: {
        adapter: netlify(),
		// hydrate the <div id="svelte"> element in src/app.html
		target: '#svelte'
	},

    preprocess: [preprocess({
        postcss: true
    })]
};

export default config;
