import { Popup, NavBar } from 'vant'
export default {
    name: 'AppPanel',
    props: {
        visible: {
            type: Boolean,
            default: true,
        },

        title: {
            type: String,
            default: '功能选择'
        },

        actions: {
            type: Array,
            default: () => []
        },
    },

    computed: {
        isVisible: {
            get() {
                return this.visible
            },
            set(val) {
                this.$emit('update:visible', val)
            }
        }
    },

    methods: {
        enter(action) {
            this.$router.push({
                path: action.path,
                query: {
                    ...action.params,
                },
            });
        }
    },

    render(h) {
        return (
            <div>
                <Popup
                    value={this.isVisible}
                    get-container="body"
                    position="bottom"
                    style={{
                        height: '100%',
                        background: '#f6f7fa'
                    }}
                    closeOnClickOverlay={false}
                >
                    <div class="app-panel-wrapper">
                        <div class="header">
                            <NavBar
                                title={this.title}
                                leftArrow
                                fixed
                                onClick-left={() => this.$router.push('/mobile/index')}
                            />
                        </div>
                        <div class="main">
                            <div class="card">
                                <div class="application">
                                    {
                                        this.actions.map(item => {
                                            return (
                                                <div class="mode" onClick={() => this.enter(item)}>
                                                    <div class="icon">
                                                        <van-icon
                                                            class-prefix="iconfont"
                                                            name={item.icon}
                                                            size="2rem"
                                                        />
                                                    </div>
                                                    <div class="text">{item.text}</div>
                                                </div>
                                            )
                                        })
                                    }
                                </div>
                            </div>
                        </div>
                    </div>
                </Popup>
            </div>
        )

    }
}