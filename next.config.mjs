import createNextIntlPlugin from 'next-intl/plugin';
const withNextIntl = createNextIntlPlugin();
/** @type {import('next').NextConfig} */
const nextConfig = {
    output: "standalone",
    env: {
        IS_TEST: process.env.IS_TEST,
        CLOUDFLARE_TURNSTILE: process.env.CLOUDFLARE_TURNSTILE
    }
};

export default withNextIntl(nextConfig);