export default {
    name: 'SignDingDing',
    props: {
        visible: {
            type: Boolean,
            default: () => false
        }
    },
    data() {
        return {
                
        }
    },

    render(h) {
        return h('div', {
            ref: 'sign',
            class: 'buttons'
        }, '测试')
    }
}