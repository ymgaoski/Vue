<template>
  <div class="vuex">
    <h1>count: {{$store.state.count}}</h1>
    <!-- <h1>countDesc: {{$store.getters.countDesc}}</h1> -->

    <button @click="$store.commit('add',1)">添加</button>
    <button @click="$store.dispatch('add',10)">异步添加</button>
    <button @click="$store.state = {count: 120}">直接改对象</button>
    <button @click="$store.state.count = 120">直接改值</button>
  </div>
</template>
