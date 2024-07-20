import { getRequestConfig } from 'next-intl/server';
import { cookies } from 'next/headers'

const locales = ['en', 'zh-CN'];
const DEFAULT_LANGUAGE = 'en';

// @ts-ignore
export default getRequestConfig(async ({ req }) => {
    let locale = DEFAULT_LANGUAGE;

    const cookieStore = cookies()
    const lan = cookieStore?.get('language')?.value || DEFAULT_LANGUAGE

    // if (req.headers.cookie) {
    //     const cookies = cookie.parse(req.headers.cookie);
    //     locale = cookies.language || DEFAULT_LANGUAGE;
    // }

    console.log(lan);

    return {
        locale,
        messages: (await import(`../messages/${lan}.json`)).default
    };
});