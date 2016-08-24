$(function(){
    BI.createWidget({
        type: 'bi.absolute',
        element: '#wrapper',
        items: [{
            el: {
                type: 'bi.button',
                text: 'ddd'
            },
            left: 100,
            top: 100
        }]
    })
})