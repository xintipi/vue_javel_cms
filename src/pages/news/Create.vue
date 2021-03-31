<template>
  <div id="CreateNews"
       class="create-news">
    <Form/>
  </div>
</template>

<script>
import News from '@/models/News'
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

    const respNewsCategories = await News.news_categories()

    to.meta['prefectures'] = respPrefecture.data
    to.meta['news_categories'] = respNewsCategories.data

    return next()
  }
}
</script>

<style lang="scss" scoped>
  .create-news {
    padding: 1.25rem;
  }
</style>
