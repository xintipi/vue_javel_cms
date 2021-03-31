<template>
  <div id="Resource">
    <!--Header-->
    <div v-if="$route.meta.type !== 'app_setting'"
         class="sub-header bg-white d-flex align-items-center justify-content-between">
      <h1 class="title text-primary font-weight-bold mb-0">
        {{$t($route.meta.title)}}
      </h1>

      <!-- Page title actions -->
      <Breadcrumb/>
    </div>

    <!--main-->
    <slot>
      <router-view v-if="true"
                   class="main-wrapper"/>
    </slot>
  </div>
</template>

<script>
import Breadcrumb from '@/components/Breadcrumb'

export default {
  name: 'Resource',

  components: {
    Breadcrumb
  }
}
</script>

<style scoped>
  .sub-header {
    height: 50px;
    padding: 0 1.25rem;
    border: 1px solid #DDDDDD;

    .title {
      font-size: 1rem;
      line-height: 1;
    }
  }

  .main-wrapper {
    margin-bottom: 60px;
  }
</style>
