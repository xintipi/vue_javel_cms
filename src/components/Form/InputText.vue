<template>
  <ValidationProvider tag="div"
                      :name="label"
                      :vid="vid"
                      :rules="rules+'|not_emoji'"
                      v-slot="{ errors }">
    <label v-if="label"
           class="form-label font-weight-bold d-flex justify-content-between align-items-center">
      <div class="d-flex align-items-start">
        {{ $t(label) }}
        <span v-if="required" class="required">{{$t('required')}}</span>
      </div>
      <span v-if="rules.includes('max:')" class="character-count">
        {{value.length}}/{{maxLength}}
      </span>
    </label>

    <div :class="{'has__error': errors[0]}">
      <a-input :placeholder="placeholder"
               :tabindex="tabindex"
               :value="value"
               :max-length="maxLength"
               :disabled="disabledInput"
               :type="type"
               @keypress="type === 'number' ? preventE($event) : ''"
               @input="handleType($event)">
        <a-icon v-if="icon" slot="prefix" :type="icon"/>
      </a-input>

      <!--Message Error-->
      <span v-if="errors[0]" class="errors">{{ errors[0] }}</span>
    </div>
  </ValidationProvider>
</template>

<script>
export default {
  name: 'InputText',

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

    value: {
      type: [String, Number],
      default: ''
    },

    disabledInput: {
      type: Boolean,
      default: false
    },

    type: {
      type: String,
      default: 'text'
    },

    icon: {
      type: String,
      default: ''
    },

    column: {
      type: String,
      default: ''
    },

    required: {
      type: Boolean,
      default: false
    },

    tabindex: {
      type: String
    }
  },

  methods: {
    preventE (evt) {
      if ((evt.which !== 8 && evt.which !== 0) && (evt.which < 48 || evt.which > 57)) {
        evt.preventDefault()
      }
    },

    handleType ($event) {
      if (this.type !== 'number') {
        this.$emit('change', $event.target.value)
        return
      }

      let value = $event.target.value
      let one = '1'
      let valueLength = one.padEnd(this.maxLength + 1, 0)

      if (value < parseInt(valueLength)) {
        this.$emit('change', $event.target.value)
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.character-count {
  font-size: 12px;
  font-weight: normal;
  color: #999999;
}
</style>
