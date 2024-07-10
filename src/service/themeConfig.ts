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
            contentFontSizeLG: 16,
            contentFontSizeSM: 14,
            contentFontSize: 14,
            defaultActiveBorderColor: '#3C53FF',
            defaultActiveColor: '#3C53FF',
            borderColorDisabled: '#EBEEFF',
            borderRadius: 8,
            borderRadiusLG: 12,
            controlHeightLG: 52,
        },
        Input:{
            colorBorder: '#E9E9E9',
            controlHeightLG: 52,
            fontSizeLG: 14,
            colorTextPlaceholder: '#999999',
        },
        Popover:{
            boxShadowTertiary: '0px 4px 12px rgba(0, 1, 0, 0.1)',
            boxShadowSecondary: '0px 4px 12px rgba(0, 1, 0, 0.1)',
            boxShadow: '0px 4px 12px rgba(0, 1, 0, 0.1)',
        },
        Select: {
            controlHeightLG: 52,
            lineHeightLG: 52,
        }
    },
}

export default themeConfig;