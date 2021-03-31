<template>
  <div class="banner-section">
    <div class="card">
      <div class="card-body">
        <!--Form-->
        <ValidationObserver tag="form"
                            ref="observer"
                            @submit.prevent="validateBeforeSubmit">
          <div class="row">
            <div class="col-md-6 col-xs-12">
              <!--Title-->
              <InputText v-model="form.banner_title"
                         class="mb-3"
                         rules="required|max:100"
                         :max-length="100"
                         vid="banner_title"
                         label="banner_title"
                         :required="true"/>

              <!--Duration-->
              <InputDatePickerRange
                label="duration"
                format-date="YYYY-MM-DD HH:mm"
                class="mb-3"
                name-start="start_time"
                name-end="end_time"
                :required="true"
                :rules-start="'required'"
                :rules-end="'required'"
                :startDateValue.sync="form.publish_start_datetime"
                :endDateValue.sync="form.publish_end_datetime"
                @startDate="form.publish_start_datetime = $event"
                @endDate="form.publish_end_datetime = $event"/>

              <!--Prefecture-->
              <InputCategoryMulti v-model="form.prefecture_id"
                                  class="mb-3"
                                  vid="prefecture_id"
                                  label="prefecture"
                                  :options="optionsPrefectureCategory"/>

              <!--Display order-->
              <InputText v-model="form.display_order"
                         class="mb-3"
                         rules="required|numeric"
                         vid="display_order"
                         label="display_order"
                         :required="true"/>

              <!--URL-->
              <InputText v-model="form.banner_url"
                         class="mb-3 mb-sm-0"
                         rules="max:200|format_url"
                         :max-length="200"
                         vid="banner_url"
                         label="banner_url"/>
            </div>

            <div class="col-md-6 col-xs-12">
              <!--Thumbnail-->
              <UploadDragDrop v-if="$route.params.id ? hasPermissionAction(PERMISSIONS.UPDATE_BANNER) : hasPermissionAction(PERMISSIONS.CREATE_BANNER)"
                              label="thumbnail"
                              vid="thumbnail"
                              :rules="form.thumbnail ? '' : 'required'"
                              :urlImage="form.thumbnail_url"
                              :accept="'.png, .jpg, .jpeg'"
                              :fileType="'image'"
                              :type="MODEL.BANNER"
                              :required="true"
                              @onFileSelect="onFileSelect($event, 'thumbnail')"
                              @deleteImage="deleteImage($event)"/>

              <!--Is active-->
              <InputSwitch v-model="form.is_active"
                           class="mb-3 mb-sm-0"
                           label="text_active"/>
            </div>
          </div>

          <!-- Action Section Submit & Cancel -->
          <div class="card-footer card-action fixed-bottom shadow">
            <button type="submit"
                    v-if="$route.params.id ? hasPermissionAction(PERMISSIONS.UPDATE_BANNER) : hasPermissionAction(PERMISSIONS.CREATE_BANNER)"
                    class="btn btn-pill btn-success float-right px-4 font-weight-bold"
                    :class="{'btn-loading disabled': isSubmit}">
              {{this.$route.name === 'banners.edit' ? $t('btn_update') : $t('btn_save')}}
            </button>

            <button type="button"
                    class="btn btn-pill btn-light float-right px-4 mr-3"
                    @click="onCancel">
              <span>{{ $t('back') }}</span>
            </button>
          </div>
        </ValidationObserver>
      </div>
    </div>
  </div>
</template>

<script>
import File from '@/models/File'
import Banner from '@/models/Banner'
import store from '@/store'
import Form from '@/mixins/form.mixin'
import SelectFile from '@/components/file/SelectFile'
import InputCategory from '@/components/Form/InputCategory'
import InputText from '@/components/Form/InputText'
import InputSwitch from '@/components/Form/InputSwitch'
import InputCategoryMulti from '@/components/Form/InputCategoryMulti'
import {forEach, pickBy, map} from 'lodash-es'
import ImageAzure from '@/components/file/ImageAzure'
import InputDatePickerRange from '@/components/Form/InputDatePickerRange'
import UploadDragDrop from '@/components/file/UploadDragDrop'
import {MODEL} from '@/enum/model.enum'

export default {
  props: {
    detail: {
      type: Object,
      default: () => {
      }
    }
  },

  name: 'Form',

  components: {
    UploadDragDrop,
    InputDatePickerRange,
    ImageAzure,
    InputCategoryMulti,
    InputSwitch,
    InputText,
    InputCategory,
    SelectFile
  },

  data () {
    return {
      list_prefectures: [],
      MODEL,
      form: {
        banner_title: '',
        banner_url: '',
        publish_start_datetime: '',
        publish_end_datetime: '',
        prefecture_id: [],
        display_order: '',
        is_active: true,
        thumbnail: '',
        thumbnail_url: ''
      },
      isSubmit: false,
      isDelete: false,
      idImageAzure: ''
    }
  },

  mixins: [Form],

  created () {
    this.list_prefectures = this.$route.meta['prefectures']

    if ('id' in this.$route.params && this.$route.name === 'banners.edit') {
      this.form = Object.assign(this.form, {
        ...this.detail
      })

      this.form.prefecture_id = map(this.form.prefectures, (item) => item.id)
      // assign id to delete image azure
      this.idImageAzure = this.form.thumbnail
    }
  },

  computed: {
    currentUser () {
      return store.getters.profile.data
    },

    optionsPrefectureCategory () {
      return {
        data: this.list_prefectures,
        id: 'id',
        key: 'prefecture_name'
      }
    }
  },

  methods: {
    async validateBeforeSubmit () {
      const isValid = await this.$refs.observer.validate()

      if (isValid) {
        this.handleSubmit()
      }
    },

    handleSubmit () {
      this.isSubmit = true
      let data = this.form

      // check prefecture empty data
      if ('prefecture_id' in data && data.prefecture_id.length === 0) {
        data.prefecture_id = []
      }

      if (this.$route.name === 'banners.edit') {
        this.updateBanner(data)
      } else {
        this.createBanner(data)
      }
    },

    onFileSelect (file, keyName) {
      this.form.thumbnail_url = file.url
      this.form.thumbnail = file.id

      // assign id to delete image azure
      this.idImageAzure = this.form.thumbnail
    },

    async createBanner (data) {
      try {
        await Banner.create(data)

        await this.onSuccess(this.$t('message_success'), this.$t('create_message_successfully'))

        await this.$router.push({name: 'banners.index'})
      } catch (err) {
        this.checkErrorsAPI(err)
        throw err
      }
    },

    async updateBanner (data) {
      try {
        if (this.isDelete === true && this.form.thumbnail_url === '') {
          await File.deleteImageAzure(this.idImageAzure, data.id, 'BANNER')
        }

        const resp = new Banner(data)
        await resp.save()

        await this.onSuccess(this.$t('message_success'), this.$t('update_message_successfully'))

        await this.$router.push({name: 'banners.index'})
      } catch (err) {
        this.checkErrorsAPI(err)
      }
    },

    checkErrorsAPI (err) {
      forEach(err.response.data.errors, (item) => {
        pickBy(this.$refs.observer.errors, (value, key) => {
          if (item.field === key) {
            value.push(item.message)
            this.isSubmit = false
          }
        })
      })
    },

    onCancel () {
      return this.$router.push({name: 'banners.index'})
    },

    deleteImage (e) {
      this.isDelete = true
      this.form.thumbnail_url = e
      this.form.thumbnail = ''
    }
  }
}
</script>

<style lang="scss" scoped>
  .banner-section {
    padding: 1.25rem;
    /deep/ #drop-area {
      min-height: 269px;
      height: 100%;
    }
  }
</style>
