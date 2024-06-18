import {ThemeConfig} from "antd";

export const themeConfig: ThemeConfig = {
    token: {
        colorPrimary: '#3C53FF',
        colorPrimaryActive: '#3042CC',
        colorPrimaryHover: '#8A98FF',
        colorError: '#EA2A2A',
        colorBgContainerDisabled: '#EBEEFF',
        colorTextDisabled: '#ffffff',
        borderRadiusLG: 12,
        borderRadius: 12,
        borderRadiusSM: 4,
    },
    components: {
        Slider: {
            /* 这里是你的组件 token */
            handleColor: 'black',
            trackBg: 'black',
            trackHoverBg: 'black',
            dotActiveBorderColor: 'black',
            handleActiveColor: 'black',
        },
        Button: {
            contentFontSizeLG: 14,
            contentFontSizeSM: 14,
            contentFontSize: 14,
            defaultActiveBorderColor: '#3C53FF',
            defaultActiveColor: '#3C53FF',
            borderColorDisabled: '#EBEEFF'
        },
    },
}

export default themeConfig;