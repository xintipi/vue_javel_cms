<template>
  <div id="UpdateNews" class="edit-news">
    <Form/>
  </div>
</template>

<script>
import News from '@/models/News'
import Prefecture from '@/models/Prefecture'
import Form from './Form'
import store from '@/store'
import * as types from '@/store/mutation-types'

export default {
  name: 'Edit',
  data () {
    return {
      detail: null
    }
  },
  components: {
    Form
  },
  beforeRouteEnter: async (to, from, next) => {
    const news = await News.find(to.params['id'], {
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

    const respNewsCategories = await News.news_categories()

    to.meta['prefectures'] = respPrefecture.data
    to.meta['news_categories'] = respNewsCategories.data

    to.meta['detail'] = news.data

    return next()
  }
}
</script>

<style lang="scss" scoped>
  .edit-news {
    padding: 1.25rem;
  }
</style>
