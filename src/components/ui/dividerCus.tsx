import React from 'react';


const DividerCus = ({margin = 0, visible = true}) => {
    return (<span className={'divider-cus'} style={{marginTop: margin, marginBottom: margin, backgroundColor: visible ? '#eee' : 'transparent'}}></span>)
}

export default DividerCus