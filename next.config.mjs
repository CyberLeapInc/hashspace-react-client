/** @type {import('next').NextConfig} */
const nextConfig = {
    output: "standalone",
    env: {  
        IS_TEST: process.env.IS_TEST,
        CLOUDFLARE_TURNSTILE: process.env.CLOUDFLARE_TURNSTILE
    }
};

export default nextConfig;
