import { ChartDataset, ScatterDataPoint, Tick } from 'chart.js'
import { ChartJSNodeCanvas } from 'chartjs-node-canvas'
import { getChartConfig, saveImage } from './common.js'
import { CliOptions } from './make-chart.js'
import { Context } from 'chartjs-plugin-datalabels'

async function makeChart(
  data: ScatterDataPoint[],
  labels: string[],
  options: CliOptions
): Promise<Buffer> {
  const datasets: ChartDataset[] = [{
    backgroundColor: '#000000',
    data,
    datalabels: {
      anchor: 'center',
      align: 'top',
      formatter: (_, context: Context) => {
        const l = context.chart.data.labels
        if (l) return l[context.dataIndex]
        else ''
      }
    }
  }]

  const config = getChartConfig(options, labels)
  config.data.datasets = datasets
  if (config.options?.scales?.y && config.options.scales.y.ticks) {
    config.options.scales.y.type = options.yaxistype ? options.yaxistype : 'linear'
    config.options.scales.y.min = parseInt(options.yaxismin, 10)
    config.options.scales.y.max = parseInt(options.yaxismax, 10)
    config.options.scales.y.ticks = {
      autoSkip: false
    }
    if (options.yaxistype === 'logarithmic') {
      config.options.scales.y.afterBuildTicks = chart => {
        chart.ticks = [
          { value: 0, label: '0' },
          { value: 10, label: '10' },
          { value: 100, label: '100' },
          { value: 1000, label: '1,000' },
          { value: 10000, label: '10,000' }
        ]
      }
    }
  }
  if (config.options?.scales?.x && config.options.scales.x.ticks) {
    config.options.scales.x.type = options.xaxistype ? options.xaxistype : 'linear'
    config.options.scales.x.min = options.xaxismin
    config.options.scales.x.max = options.xaxismax
    config.options.scales.x.ticks = {
      callback(value: number) {
        return `${Math.round(value * 100)}%`
      },
      autoSkip: false
    }
  }
  config.type = 'scatter'

  const chartJSNodeCanvas = new ChartJSNodeCanvas({
    width: 600, height: 335, backgroundColour: '#ffffff', plugins: {
      modern: [],
      requireLegacy: ['chartjs-plugin-datalabels']
    }
  })
  return await chartJSNodeCanvas.renderToBuffer(config)
}

export const makeScatterChart = async (options: CliOptions, dataRows: []) => {
  const data: ScatterDataPoint[] = []
  const labels = []
  dataRows.forEach(row => {
    data.push({
      x: row[options.xcolumnkey],
      y: row[options.ycolumnkey]
    })
    if (options.labelcolumnkey) {
      labels.push(row[options.labelcolumnkey])
    }
  })
  // console.log(data)
  const buffer: Buffer = await makeChart(data, labels, options)
  await saveImage(buffer, options.outfile)
}
