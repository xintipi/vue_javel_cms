<template>
  <div id="UpdateBanner">
    <Form :detail="model"/>
  </div>
</template>

<script>
import Banner from '@/models/Banner'
import Prefecture from '@/models/Prefecture'
import Form from './Form'
import store from '@/store'
import * as types from '@/store/mutation-types'

export default {
  name: 'Edit',
  beforeRouteEnter: async (to, from, next) => {
    const banner = await Banner.find(to.params['id'], {
      query: {
        include: 'prefectures,company'
      }
    })
    // Get Prefecture
    let respPrefecture = store.getters.prefectures

    if (!respPrefecture) {
      respPrefecture = await Prefecture.all()

      store.commit(types.SET_PREFECTURES, respPrefecture)
    }

    to.meta['detail'] = banner.data
    to.meta['prefectures'] = respPrefecture.data

    return next()
  },
  components: {
    Form
  },
  data () {
    return {
      model: null
    }
  },
  created () {
    this.model = this.$route.meta['detail']
  }
}
</script>

<style scoped>

</style>
