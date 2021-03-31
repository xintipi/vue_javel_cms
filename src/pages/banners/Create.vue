<template>
  <div id="CreateBanner">
    <Form/>
  </div>
</template>

<script>
import Prefecture from '@/models/Prefecture'
import store from '@/store'
import * as types from '@/store/mutation-types'
import Form from './Form'

export default {
  name: 'Create',
  components: { Form },

  async beforeRouteEnter (to, from, next) {
    // Get Prefecture
    let respPrefecture = store.getters.prefectures

    if (!respPrefecture) {
      respPrefecture = await Prefecture.all()

      store.commit(types.SET_PREFECTURES, respPrefecture)
    }

    to.meta['prefectures'] = respPrefecture.data

    return next()
  }
}
</script>

<style scoped>

</style>
