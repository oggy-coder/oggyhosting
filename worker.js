export default {
    async fetch(request, env) {
        try {
            const url = new URL(request.url);

            if (url.pathname === "/debug") {
                // List all KV keys to check if index.html exists
                const keys = await env.STATIC_CONTENT_KV.list();
                return new Response(JSON.stringify(keys, null, 2), { headers: { "Content-Type": "application/json" } });
            }

            if (url.pathname === "/" || url.pathname === "/index.html") {
                let staticFile = await env.STATIC_CONTENT_KV.get("index.html", "text");
                if (staticFile) {
                    return new Response(staticFile, {
                        headers: { "Content-Type": "text/html" }
                    });
                } else {
                    return new Response("🚨 index.html not found in KV!", { status: 404 });
                }
            }

            return new Response("404 Not Found", { status: 404 });

        } catch (err) {
            return new Response(`Error: ${err.message}`, { status: 500 });
        }
    }
};
