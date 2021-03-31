<script>
import { Line, mixins } from 'vue-chartjs'

export default {
  name: 'ChartLine',

  extends: Line,

  props: {
    chartData: {
      type: Object,
      default: null
    },
    options: {
      type: Object,
      default: null
    }
  },

  mixins: [mixins.reactiveProp],

  mounted () {
    // Overwriting base render method with actual data.
    this.renderChart(this.chartData, this.options)
  }
}
</script>
