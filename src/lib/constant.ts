let cloudFlareSiteKey ='0x4AAAAAAAVuhgDN4FXyZAFb';
if (process.env.CLOUDFLARE_TURNSTILE && (process.env.CLOUDFLARE_TURNSTILE.length > 0)) {
    cloudFlareSiteKey = process.env.CLOUDFLARE_TURNSTILE
}

export cloudFlareSiteKey 
