<template>
  <div class="card">
    <div class="card-body">
      <!--Form-->
      <form role="search" @submit.prevent="search">
        <div class="row">

          <!--news_category-->
          <div class="col-12 col-sm-6 col-md-4 mb-3">
            <label class="form-label font-weight-bold">{{$t('news_category')}}</label>

            <a-select
              show-search
              style="width: 100%"
              v-model="filter.category_id">
              <a-select-option value="">
                {{$t('search_category')}}
              </a-select-option>
              <a-select-option v-for="item in list_categories" :key="item.id">
                {{ item.news_category_name }}
              </a-select-option>
            </a-select>
          </div>

          <!--news_title-->
          <div class="col-12 col-sm-6 col-md-4 mb-3">
            <label class="form-label font-weight-bold">{{$t('content_title')}}</label>

            <a-input v-model="filter.title"/>
          </div>

          <!--news_prefecture-->
          <div class="col-12 col-sm-6 col-md-4 mb-3">
            <label class="form-label font-weight-bold">{{$t('prefecture')}}</label>

            <div class="custom-arrow">
              <a-select
                mode="multiple"
                style="width: 100%"
                v-model="filter.prefectures"
                :filter-option="filterOption"
                option-filter-prop="children"
                :placeholder="$t('placeholder_prefecture')">
                <a-select-option v-for="item in list_prefectures" :key="item.id">
                  {{ item.prefecture_name }}
                </a-select-option>
              </a-select>
              <a-icon type="down" :style="{ fontSize: '12px'}"/>
            </div>
          </div>

          <!--news_public_time-->
          <div class="col-12 col-sm-6 col-md-4 mb-3 mb-sm-0">
            <label class="form-label font-weight-bold">{{$t('duration')}}</label>

            <InputDatePickerRange
              ref="DateRange"
              format-date="YYYY-MM-DD HH:mm"
              @startDate="filter.publish_datetime.from = $event"
              @endDate="filter.publish_datetime.to = $event"/>
          </div>

          <!--is_active-->
          <div class="col-12 col-sm-6 col-md-4 mb-3 mb-sm-0">
            <label class="form-label font-weight-bold">{{$t('status')}}</label>

            <a-select
              show-search
              style="width: 100%"
              v-model="filter.is_active">
              <a-select-option value="">
                {{$t('select_option_empty')}}
              </a-select-option>
              <a-select-option value="1">
                {{$t('select_option_active')}}
              </a-select-option>
              <a-select-option value="0">
                {{$t('select_option_inactive')}}
              </a-select-option>
            </a-select>
          </div>

          <!--Search & Reset-->
          <div class="col-12 col-sm-6 col-md-4 mb-3 mb-sm-0">
            <label class="form-label" v-html="'&nbsp;'"/>

            <div class="row">
              <div class="col-6">
                <button type="button" @click="reset" class="text-nowrap btn btn-pill btn-light btn-block border-0">
                  {{$t('btn_reset')}}
                </button>
              </div>

              <div class="col-6">
                <button type="submit" class="text-nowrap btn btn-pill btn-primary btn-block border-0">
                  {{$t('btn_search')}}
                </button>
              </div>
            </div>
          </div>
        </div>
      </form>
    </div>
  </div>
</template>

<script>
import locale from 'ant-design-vue/es/date-picker/locale/ja_JP'
import InputDatePickerRange from '@/components/Form/InputDatePickerRange'

export default {
  name: 'Search',
  components: {InputDatePickerRange},
  data () {
    return {
      locale,
      list_categories: [],
      list_prefectures: [],
      filter: {
        category_id: '',
        title: '',
        prefectures: [],
        publish_datetime: {
          from: null,
          to: null
        },
        is_active: ''
      },
      rangeConfig: []
    }
  },

  created () {
    this.list_prefectures = this.$route.meta['prefectures']
    this.list_categories = this.$route.meta['categories']
  },

  methods: {
    search () {
      this.$emit('filter-changed', this.filter)
    },

    reset () {
      this.$refs.DateRange.startValue = null
      this.$refs.DateRange.endValue = null

      for (let property in this.filter) {
        if (this.filter.hasOwnProperty(property)) {
          if (property === 'prefectures') {
            this.filter[property] = []
          } else if (property === 'publish_datetime') {
            this.filter[property].from = null
            this.filter[property].to = null
          } else {
            this.filter[property] = ''
          }
        }
      }
      this.$emit('filter-changed', this.filter)
    },

    filterOption (input, option) {
      return (
        option.componentOptions.children[0].text.toLowerCase().indexOf(input.toLowerCase().trim()) >= 0
      )
    }
  }
}
</script>

<style lang="postcss" scoped>

</style>
