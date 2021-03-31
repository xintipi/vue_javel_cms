<template>
  <ValidationProvider tag="div"
                      :name="label"
                      :vid="vid"
                      :rules="rules"
                      v-slot="{ errors }">
    <label class="form-label d-flex justify-content-between align-items-center font-weight-bold">
      <div>
        {{ $t(label) }}
        <span v-if="required" class="required">{{$t('required')}}</span>
      </div>
      <span v-if="rules.includes('max:')" class="character-count">
        {{value.length}}/{{maxLength}}
      </span>
    </label>

    <div :class="{'has__error': errors[0]}">
      <a-textarea :rows="rows"
                  :placeholder="placeholder"
                  :max-length="maxLength"
                  :value="value"
                  @input="$emit('change', $event.target.value)"/>
      <!--Message Error-->
      <span v-if="errors[0]" class="errors">{{ errors[0] }}</span>
    </div>
  </ValidationProvider>
</template>

<script>
export default {
  name: 'InputTextarea',

  model: {
    prop: 'value',
    event: 'change'
  },

  props: {
    label: {
      type: String,
      required: true,
      default: ''
    },

    rules: {
      type: String,
      default: ''
    },

    vid: {
      type: String,
      default: ''
    },

    placeholder: {
      type: String,
      default: ''
    },

    maxLength: {
      type: [String, Number]
    },

    rows: {
      type: [String, Number]
    },

    value: {
      type: [String, Number],
      required: true,
      default: ''
    },

    required: {
      type: Boolean,
      default: false
    }
  }
}
</script>

<style scoped>
  .character-count {
    font-size: 12px;
    font-weight: normal;
    color: #999999;
  }
</style>
