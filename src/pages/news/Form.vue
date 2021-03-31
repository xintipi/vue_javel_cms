<template>
  <div class="card">
    <div class="card-body">
      <!--Form-->
      <ValidationObserver tag="form"
                          ref="observer"
                          @submit.prevent="validateBeforeSubmit">
        <div class="row">
          <!--news_category_id-->
          <InputCategory v-model="form.news_category_id"
                         class="col-md-6 mb-3"
                         rules="required"
                         :required="true"
                         vid="news_category_id"
                         label="news_category"
                         :options="optionsNewsCategory"/>

          <!--news_title-->
          <InputText v-model="form.news_title"
                     class="col-md-6 mb-3"
                     rules="required|max:200"
                     :max-length="200"
                     vid="news_title"
                     label="content_title"
                     :required="true"/>

          <!--publish_datetime-->
          <InputDatePickerRange
            label="duration"
            format-date="YYYY-MM-DD HH:mm"
            class="col-md-6 mb-3"
            name-start="start_time"
            name-end="end_time"
            :required="true"
            :rules-start="'required'"
            :rules-end="'required'"
            :startDateValue.sync="form.publish_start_datetime"
            :endDateValue.sync="form.publish_end_datetime"
            @startDate="form.publish_start_datetime = $event"
            @endDate="form.publish_end_datetime = $event"/>

          <!--news_prefectures-->
          <InputCategoryMulti v-model="form.prefecture_id"
                              class="col-md-6 mb-3"
                              vid="prefecture_id"
                              label="prefecture"
                              :options="optionsPrefecture"/>

          <!--News text-->
          <InputHtmlEditor v-model="form.news_text"
                           vid="text"
                           label="news_text"
                           class="col-md-12 mb-3"/>

          <!--thumbnail-->
          <div class="col-md-12 mb-3">
            <UploadDragDrop v-if="$route.params.id ? hasPermissionAction(PERMISSIONS.UPDATE_NEWS) : hasPermissionAction(PERMISSIONS.CREATE_NEWS)"
                            label="thumbnail"
                            vid="thumbnail"
                            :urlImage="form.thumbnail_url"
                            :accept="'.png, .jpg, .jpeg'"
                            :fileType="'image'"
                            :type="MODEL.NEWS"
                            @onFileSelect="onFileSelect($event, 'thumbnail')"
                            @deleteImage="deleteImage($event)"/>
          </div>

          <!--news_url-->
          <InputText v-model="form.news_url"
                     class="col-md-6 mb-3 mb-sm-0"
                     rules="max:200|format_url"
                     :max-length="200"
                     vid="news_url"
                     label="news_url"/>

          <!--Is active-->
          <InputSwitch v-model="form.is_active"
                       class="col-md-6 mb-3 mb-sm-0"
                       label="text_active"/>
        </div>

        <!-- Action Section Submit & Cancel -->
        <div class="card-footer card-action fixed-bottom shadow">
          <button type="submit"
                  v-if="$route.params.id ? hasPermissionAction(PERMISSIONS.UPDATE_NEWS) : hasPermissionAction(PERMISSIONS.CREATE_NEWS)"
                  class="btn btn-pill btn-success float-right px-4 font-weight-bold"
                  :class="{'btn-loading disabled': isSubmit}">
            {{this.$route.name === 'news.edit' ? $t('btn_update') : $t('btn_save')}}
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
</template>

<script>
import File from '@/models/File'
import News from '@/models/News'
import {MODEL} from '@/enum/model.enum'
import store from '@/store'
import Form from '@/mixins/form.mixin'
import InputText from '@/components/Form/InputText'
import InputCategory from '@/components/Form/InputCategory'
import InputTextarea from '@/components/Form/InputTextarea'
import InputSwitch from '@/components/Form/InputSwitch'
import InputCategoryMulti from '@/components/Form/InputCategoryMulti'
import {map, forEach, pickBy} from 'lodash-es'
import InputHtmlEditor from '@/components/Form/InputHtmlEditor'
import SelectFile from '@/components/file/SelectFile'
import ImageAzure from '@/components/file/ImageAzure'
import InputDatePickerRange from '@/components/Form/InputDatePickerRange'
import UploadDragDrop from '@/components/file/UploadDragDrop'
export default {
  name: 'Form',

  components: {
    UploadDragDrop,
    InputDatePickerRange,
    ImageAzure,
    SelectFile,
    InputHtmlEditor,
    InputSwitch,
    InputTextarea,
    InputCategory,
    InputText,
    InputCategoryMulti
  },

  data () {
    return {
      list_prefectures: [],
      list_news_category: [],
      MODEL,
      form: {
        news_category_id: '',
        news_title: '',
        prefecture_id: [],
        publish_start_datetime: '',
        publish_end_datetime: '',
        thumbnail: '',
        thumbnail_url: '',
        news_text: '',
        news_url: '',
        is_active: true
      },
      idImageAzure: '',
      isDelete: false,
      isSubmit: false
    }
  },

  mixins: [Form],

  created () {
    this.list_prefectures = this.$route.meta['prefectures']
    this.list_news_category = this.$route.meta['news_categories']

    if ('id' in this.$route.params && this.$route.name === 'news.edit') {
      this.form = Object.assign(this.form, {
        ...this.$route.meta['detail']
      })

      this.form.prefecture_id = map(this.form.prefectures, (item) => item.id)
      // assign id to delete image azure
      this.idImageAzure = this.form.thumbnail
    } else {
      this.form.news_category_id = this.list_news_category[0].id
    }
  },

  computed: {
    currentUser () {
      return store.getters.profile.data
    },

    optionsPrefecture () {
      return {
        data: this.list_prefectures,
        id: 'id',
        key: 'prefecture_name'
      }
    },

    optionsNewsCategory () {
      return {
        data: this.list_news_category,
        id: 'id',
        key: 'news_category_name'
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

      if (this.$route.name === 'news.edit') {
        this.updateNews(data)
      } else {
        this.createNews(data)
      }
    },

    async updateNews (data) {
      try {
        if (this.isDelete && this.form.thumbnail_url === '') {
          await File.deleteImageAzure(this.idImageAzure, data.id, 'NEWS')
        }
        const resp = new News(data)
        await resp.save()

        await this.onSuccess(this.$t('message_success'), this.$t('update_message_successfully'))
        await this.$router.push({name: 'news.index'}).catch(_ => {
        })
      } catch (err) {
        this.checkErrorsAPI(err)
        this.isSubmit = false
      }
    },

    async createNews (data) {
      try {
        const resp = await News.create(data)

        if (resp && Object.keys(resp).length) {
          await this.onSuccess(this.$t('message_success'), this.$t('create_message_successfully'))

          this.$router.push({name: 'news.index'}).catch(_ => {
          })
        }
      } catch (err) {
        this.checkErrorsAPI(err)
        this.isSubmit = false
        throw err
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
      return this.$router.push({name: 'news.index'})
    },

    onFileSelect (file, keyName) {
      this.form.thumbnail_url = file.url
      this.form.thumbnail = file.id

      // assign id to delete image azure
      this.idImageAzure = this.form.thumbnail
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
  .avatar-uploader > .ant-upload {
    width: 128px;
    height: 128px;
  }

  .ant-upload-select-picture-card i {
    font-size: 32px;
    color: #999;
  }

  .ant-upload-select-picture-card .ant-upload-text {
    margin-top: 8px;
    color: #666;
  }

  /*.hiddenImage {*/
  /*  .ql-custom-image-92 {*/
  /*    */
  /*  }*/
  /*}*/
</style>
