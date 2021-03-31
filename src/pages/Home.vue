<template>
  <div class="dashboard">

    <div class="card">
      <!--Header-->
      <div class="card-header d-flex align-items-center justify-content-between">
        <p class="font-weight-bold mb-0">{{ $t('chart_title') }}</p>

        <div class="total d-flex align-items-center">
          <p class="font-weight-bold mb-0 mr-3">{{ $t('total_member') }} :</p>
          <span class="font-weight-bold">{{ userTotal }}</span>
        </div>
      </div>

      <!--Search-->
      <div class="card-body">
        <form role="search" @submit.prevent="search">
          <div class="row">
            <div class="col-12 col-sm-8 col-lg-5 mb-3 mb-lg-0">
              <InputDatePickerRange
                ref="DateRange"
                format-date="YYYY-MM-DD HH:mm"
                @startDate="filter.from = $event"
                @endDate="filter.to = $event"/>
            </div>
            <div class="col-12 col-sm-4 col-lg-3 mb-3 mb-lg-0">
              <a-select
                style="width: 100%"
                v-model="filter.display_type">
                <a-select-option value="monthly">
                  {{$t('monthly')}}
                </a-select-option>
                <a-select-option value="daily">
                  {{$t('daily')}}
                </a-select-option>
              </a-select>
            </div>

            <!--Search & Reset-->
            <div class="col-12 col-lg-4">
              <div class="row">
                <div class="col-6">
                  <button type="button" @click="reset" class="text-nowrap btn btn-light btn-pill btn-block border-0">
                    {{$t('btn_reset')}}
                  </button>
                </div>

                <div class="col-6">
                  <button type="submit" class="text-nowrap btn btn-primary btn-pill btn-block border-0">
                    {{$t('btn_search')}}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </form>
      </div>

      <!--Chart-->
      <div class="card-footer">
        <!--Line chart-->
        <ChartLine :chart-data="filterLineChartData" :options="lineChartOptions" style="height: 400px"/>
      </div>
    </div>
  </div>
</template>

<script>

import Dashboard from '@/models/Dashboard'
import store from '@/store'
import * as types from '@/store/mutation-types'
import Breadcrumb from '@/components/Breadcrumb'
import ChartLine from '@/components/ChartLine'
import {keys, values} from 'lodash-es'
import locale from 'ant-design-vue/es/date-picker/locale/ja_JP'
import InputDatePickerRange from '@/components/Form/InputDatePickerRange'

export default {
  name: 'Home',

  components: {
    InputDatePickerRange,
    ChartLine,
    Breadcrumb
  },

  data () {
    return {
      locale,
      dataDashboard: {},
      dateRange: [],
      filter: {
        from: null,
        to: null,
        display_type: 'monthly'
      },
      lineChartData: {
        labels: [],
        datasets: [
          {
            label: this.$t('chart_title'),
            // Bezier curve tension of the line
            lineTension: 0.2,
            backgroundColor: 'transparent',
            borderColor: '#45aaf2',
            pointBackgroundColor: '#007cd4',
            pointBorderColor: '#f1f1f1',
            pointBorderWidth: 2,
            // set big & small dot circle
            pointRadius: 5,
            data: []
          }
        ]
      },
      lineChartOptions: {
        maintainAspectRatio: false,
        responsive: true,
        events: ['mousemove', 'mouseout'],
        tooltips: {
          mode: 'point'
        },
        scales: {
          yAxes: [{
            ticks: {
              stepSize: 1
            }
          }],
          xAxes: [{
            ticks: {
              beginAtZero: true
            }
          }]
        }
      },
      keyChart: [],
      valueChart: []
    }
  },

  computed: {
    filterLineChartData () {
      let dataChart = store.getters.dataChart
      let lineChartData = {...this.lineChartData}
      let keyChart = keys(dataChart.statistics)
      let valueChart = values(dataChart.statistics)

      lineChartData.labels = [...keyChart]
      lineChartData.datasets[0].data = [...valueChart]
      return lineChartData
    },

    userTotal () {
      if ('total_user' in store.getters.dataChart) {
        return store.getters.dataChart.total_user
      }
    }
  },

  async beforeRouteEnter (to, from, next) {
    // Get Dashboards
    const resp = await Dashboard.all()

    store.commit(types.SET_CHART, resp.data)

    return next()
  },

  methods: {
    async search () {
      const resp = await Dashboard.all({
        query: {
          ...this.filter
        }
      })

      store.commit(types.SET_CHART, resp.data)
    },

    reset () {
      this.$refs.DateRange.startValue = null
      this.$refs.DateRange.endValue = null

      for (let property in this.filter) {
        if (this.filter.hasOwnProperty(property)) {
          if (property === 'display_type') {
            this.filter[property] = 'monthly'
          } else {
            this.filter[property] = null
          }
        }
      }
      this.dateRange = []
      this.search()
    }
  }
}
</script>

<style lang="scss">
  .dashboard {
    padding: 1.25rem;
    .card {
      &-header {
        p {
          color: #333333;
        }
        span {
          font-size: 20px;
          color: #007CC3;
        }
      }

      &-body {
        .btn {
          white-space: nowrap;
        }
      }
    }
  }
</style>
