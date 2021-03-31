<template>
  <div class="switch-active">
    <label v-if="label"
           class="form-label font-weight-bold">
      {{ $t(label) }}
    </label>

    <a-switch v-model="switchValue" :disabled="disabled"/>
  </div>
</template>

<script>
export default {
  name: 'InputSwitch',

  props: {
    label: {
      type: String,
      default: ''
    },

    disabled: {
      type: Boolean,
      default: false
    },

    value: {
      type: Boolean,
      required: true,
      default: false
    }
  },

  computed: {
    switchValue: {
      get () {
        return this.value
      },
      set (val) {
        this.$emit('input', val)
      }
    }
  }
}
</script>

<style lang="scss" scoped>
  /deep/.ant-switch {
    min-width: 58px;
    height: 20px;
    background: #DDDDDD;
    &:before {
      content: 'OFF';
      font-size: 13px;
      font-weight: bold;
      color: #999999;
      position: absolute;
      top: -1px;
      left: 25px;
    }
    &:after {
      top: -1px;
      left: 0;
      width: 20px;
      height: 20px;
      border: 1px solid #DDDDDD;
      box-shadow: 0 3px 6px rgba(0,0,0,.16);
    }
    &:active {
      &::before {
        width: unset;
      }
      &::after {
        width: 20px;
      }
    }
    &-checked {
      background: #0062AF;
      transform: unset;
      &:before {
        content: 'ON';
        font-size: 13px;
        font-weight: bold;
        color: #ffffff;
        position: absolute;
        top: -1px;
        left: 12px;
      }
      &:after {
        left: 100%;
        margin-left: 1px;
      }
      &:active {
        &::before {
          width: unset;
        }
      }
    }
  }
</style>
