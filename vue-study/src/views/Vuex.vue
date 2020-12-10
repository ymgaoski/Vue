<template>
  <div class="vuex">
    <h1>count: {{$store.state.count}}</h1>
    <button @click="$store.commit('add',1)">添加</button>
    <button @click="$store.dispatch('add',10)">异步添加</button>
  </div>
</template>
