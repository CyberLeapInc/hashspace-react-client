export const cloudFlareSiteKey = () => {
    let cfSiteKey ='0x4AAAAAAAVuhgDN4FXyZAFb';
    if (process.env.CLOUDFLARE_TURNSTILE && (process.env.CLOUDFLARE_TURNSTILE.length > 0)) {
        cfSiteKey = process.env.CLOUDFLARE_TURNSTILE;
    }

    return cfSiteKey
};
