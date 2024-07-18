/** @type {import('next').NextConfig} */
const nextConfig = {
    output: "standalone",
    env: {  IS_TEST: process.env.IS_TEST  }
};

export default nextConfig;
