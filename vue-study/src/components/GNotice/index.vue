<template>
  <div class="notice-container" v-if="isShow" :class="{show: showAnimation}">
      <span class="notice-title" v-if="title">{{title}}</span>
      <span class="notice-content" v-if="desc">{{desc}}</span>
  </div>
</template>

<script>
export default {
    props: {
        title:{
            type: String
        },
        desc:{
            type: String
        },
        duration:{
            type: Number,
            default: 2000
        }
    },
    data(){
        return{
            isShow: false,
            showAnimation: false
        }
    },
    methods: {
        show() {
            this.isShow = true;

            setTimeout(() => {
                this.showAnimation = true;
            }, 10);

            // 指定秒后自动隐藏
            setTimeout(() => {
                this.remove();
            }, this.duration);
        }
    },
}
</script>

<style lang="scss" scoped>
.notice-container{
    display: flex;
    flex-direction: column;
    border-left: 15px solid rgb(0, 140, 255);
    border-radius: 4px;
    background: white;
    color:#333;
    position:fixed;
    top: 10px;
    right: -300px;
    padding: 10px;
    box-shadow: 0px 0px 24px #8e8e8e;
    text-align: left;
    max-width: 300px;
    min-width: 200px;
    transition: all 0.35s;

    .notice-title{
        font-size: 16px;
    }
    .notice-content{
        font-size: 13px;
        color:#666;
        margin-top: 5px;
    }
}

.show{
    right:10px;
}
</style>