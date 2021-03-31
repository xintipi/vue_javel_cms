<template>
  <div class="card mb-3">
    <div class="card-body">
      <!--Form-->
      <form role="search" @submit.prevent="search">
        <div class="row">
          <!-- Title -->
          <div class="col-12 col-sm-6 col-md-4 mb-3">
            <label class="form-label font-weight-bold">{{ $t('banner_title') }}</label>

            <a-input v-model.trim="filter.title" />
          </div>

          <!-- Duration -->
          <div class="col-12 col-sm-6 col-md-4 mb-3">
            <label class="form-label font-weight-bold">{{ $t('duration') }}</label>

            <InputDatePickerRange
              ref="DateRange"
              format-date="YYYY-MM-DD HH:mm:ss"
              @startDate="filter.publish_datetime.from = $event"
              @endDate="filter.publish_datetime.to = $event"/>
          </div>

          <!-- Prefecture -->
          <div class="col-12 col-sm-6 col-md-4 mb-3">
            <label class="form-label font-weight-bold">{{ $t('prefecture') }}</label>

            <div class="custom-arrow">
              <a-select
                mode="multiple"
                style="width: 100%"
                v-model="filter.prefecture_id"
                :filter-option="filterOption"
                option-filter-prop="children"
                :placeholder="$t('please_select_option')">
                <a-select-option v-for="item in prefectures" :value="item.id" :key="item.id">
                  {{ item.prefecture_name }}
                </a-select-option>
              </a-select>
              <a-icon type="down" :style="{ fontSize: '12px'}"/>
            </div>
          </div>

          <!-- Active -->
          <div class="col-12 col-sm-6 col-md-4 mb-3 mb-sm-0">
            <label class="form-label font-weight-bold">{{ $t('status') }}</label>

            <a-select
              show-search
              :placeholder="$t('please_select_option')"
              style="width: 100%"
              v-model="filter.is_active">
              <a-select-option value="">
                {{ $t('please_select_option') }}
              </a-select-option>
              <a-select-option value="1">
                {{ $t('active') }}
              </a-select-option>
              <a-select-option value="0">
                {{ $t('inactive') }}
              </a-select-option>
            </a-select>
          </div>

          <div class="col-12 col-sm-6 col-md-4"/>

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
  components: {
    InputDatePickerRange
  },
  data () {
    return {
      locale,
      prefectures: [],
      filter: {
        title: '',
        prefecture_id: [],
        publish_datetime: {
          from: null,
          to: null
        },
        is_active: ''
      }
    }
  },

  created () {
    this.prefectures = this.$route.meta['prefectures']
  },

  methods: {
    search () {
      this.$emit('filter-changed', this.filter)
    },

    reset () {
      // Reset datepicker
      this.$refs.DateRange.startValue = null
      this.$refs.DateRange.endValue = null

      for (let property in this.filter) {
        if (this.filter.hasOwnProperty(property)) {
          if (property === 'prefecture_id') {
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

<style scoped>

</style>
