<template>
  <ol v-if="breadcrumbs.length" class="breadcrumb breadcrumb-arrows" aria-label="breadcrumbs">
    <li class="breadcrumb-item" v-for="(item, index) in breadcrumbs" :key="index" :class="isActive(item.name)">
      <router-link :to="{name: item.name }" tag="a">{{ $t(`${item.title}`) }}</router-link>
    </li>
  </ol>
</template>

<script>
export default {
  name: 'Breadcrumb',

  computed: {
    breadcrumbs () {
      return [
        { title: 'dashboard', name: 'home' },
        ...this.$route.meta.breadcrumbs
      ]
    }
  },

  methods: {
    isActive (name) {
      return {
        'active': name === this.$route.name
      }
    }
  }
}
</script>

<style scoped>

</style>
