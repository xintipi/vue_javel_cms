<template>
  <div class="empty">
    <div class="empty-icon">
      <img alt="" class="h-8 mb-4" src="../../static/illustrations/undraw_printing_invoices_5r4r.svg">
    </div>
    <p class="empty-title h3">No results found</p>
    <p class="empty-subtitle text-muted">
      Try adjusting your search or filter to find what you're looking for.
    </p>
    <div class="empty-action">
      <button class="btn btn-primary" onclick="window.history.go(-1); return false;">
        <arrow-left-icon class="icon"></arrow-left-icon>
        Go Back
      </button>
    </div>
  </div>
</template>

<script>
import { ArrowLeftIcon } from 'vue-feather-icons'

export default {
  name: 'PageNotFound',
  components: {
    ArrowLeftIcon
  }
}
</script>

<style scoped>

</style>
