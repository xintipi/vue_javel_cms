<template>
  <div>
    <Nav/>
    <div class="page">
      <Header/>

      <Child/>
    </div>
  </div>
</template>

<script>

import Nav from '@/components/Nav'
import Header from '@/components/Header'
import Child from '@/components/Child'

export default {
  name: 'Default',

  components: {
    Nav,
    Header,
    Child
  }
}
</script>

<style scoped>

</style>
