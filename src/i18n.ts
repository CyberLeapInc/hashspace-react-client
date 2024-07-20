import {getRequestConfig} from 'next-intl/server';

const locales = ['en', 'zh-CN'];
const DEFAULT_LANGUAGE = 'zh-CN'


export default getRequestConfig(async () => {
    // Provide a static locale, fetch a user setting,
    // read from `cookies()`, `headers()`, etc.
    // 在这里通过local来设置语言
    let locale = DEFAULT_LANGUAGE;
    if (typeof window !== 'undefined') {
        locale = window.localStorage.getItem('language') || DEFAULT_LANGUAGE;
    }

    return {
        locale,
        messages: (await import(`../messages/${locale}.json`)).default
    };
});