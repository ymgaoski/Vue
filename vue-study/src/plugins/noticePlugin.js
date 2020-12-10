import Vue from 'vue'
import GNotice from '@/components/GNotice'

const NoticePlugin = {
    install(Vue,options){

        // 添加实例方法
        Vue.prototype.$notice = function (props) {

            // 使用Vue render函数创建虚拟DOM
            const vm = new Vue({
                render : h => h(GNotice,{props})
            }).$mount() // 不指定宿主元素，则会创建真实dom，但是不会追加操作;

            // 获取真实dom,并手动挂载到body上
            document.body.appendChild(vm.$el);

            // 获取组件实例
            const comp = vm.$children[0];

            // 默认调用显示 
            comp.show();

            // 新增 删除方法
            comp.remove = function() {
              document.body.removeChild(vm.$el)
              vm.$destroy()
            }
        }
    }
}

if (typeof window != 'undefined' && window.Vue){
    console.log('自动注入');
    window.Vue.use(NoticePlugin);
}

export default NoticePlugin;