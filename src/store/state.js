import { reactive } from 'vue'

export const state = reactive({
    isLogin: false,
    userInfo: {
        username: '',
        avatarUrl: '',
    },
    orderType: 'selfPickUp', // 'selfPickUp' 或 'deliveryOrder'
    loaded: 0, // 页面加载状态，0为初始状态，1为已完成首页导航
    // 注册当前用户，接收一个包含 username 和 avatarUrl 的对象
    registerUser(user = {}) {
        this.isLogin = true
        this.userInfo.username = user.username || ''
        this.userInfo.avatarUrl = user.avatarUrl || ''
    }
})

// 自取单state
export const selfPickUpState = reactive({
    orders: [],
    addItem2Cart(item) {
        this.orders.push(item)
    }
})

// 外卖单state
export const deliveryOrderState = reactive({
    orders: [],
    addressInfo: {
        name: '',
        address: '',
        phone: '',
        recipient: ''
    },
    addItem2Cart(item) {
        this.orders.push(item)
    },
    setAddressInfo(info = {}) {
        this.addressInfo.name = info.name || ''
        this.addressInfo.address = info.address || ''
        this.addressInfo.phone = info.phone || ''
        this.addressInfo.recipient = info.recipient || ''
    }
})