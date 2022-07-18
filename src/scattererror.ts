import { ChartJSNodeCanvas } from 'chartjs-node-canvas'
import {
  ScatterWithErrorBarsController,
  IErrorBarXYDataPoint
} from 'chartjs-chart-error-bars'
import { getChartConfig, saveImage } from './common.js'
import { CliOptions } from './make-chart.js'

interface DataRow {
  y: string,
  yMin: string,
  yMax: string,
  x: string,
  xMin: string,
  xMax: string
}

async function makeChart(
  data: IErrorBarXYDataPoint[],
  labels: string[],
  options: CliOptions
): Promise<Buffer> {
  const datasets = [{
    pointStyle: 'cross',
    borderColor: '#000000',
    backgroundColor: '#000000',
    errorBarColor: '#000000',
    errorBarWhiskerColor: '#000000',
    borderWidth: 0.5,
    borderSkipped: false,
    data,
  }]
  const config = getChartConfig(options, labels)
  config.data.datasets = datasets
  config.type = ScatterWithErrorBarsController.id
  if (config.options?.scales?.x && config.options.scales.x.ticks) {
    config.options.scales.x.ticks = {
      callback(value) {
        return `${parseInt(value as string, 10) * 100} %`
      },
      autoSkip: false
    }
  }
  if (config.options?.scales?.y) {
    config.options.scales.y.min = 0.5
    config.options.scales.y.max = labels.length + .5
    if (config.options.scales.y.ticks) {
      config.options.scales.y.ticks = {
        callback(_, index) {
          if (index % 2 === 0) return
          return labels[index / 2 - 0.5]
        },
        autoSkip: false
      }
    }
  }
  const chartJSNodeCanvas = new ChartJSNodeCanvas({
    width: 600, height: 335, backgroundColour: '#ffffff', plugins: {
      modern: ['chartjs-chart-error-bars'],
      requireLegacy: []
    }
  })
  return await chartJSNodeCanvas.renderToBuffer(config)
}

export const makeScatterErrorChart = async (options: CliOptions, rawData: []) => {
  // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access, @typescript-eslint/no-unsafe-call
  const dataRows = rawData as DataRow[]
  const data: IErrorBarXYDataPoint[] = []
  dataRows.forEach(row => data.push({
    x: parseFloat(row.x as unknown as string),
    xMin: parseFloat(row.xMin as unknown as string),
    xMax: parseFloat(row.xMax as unknown as string),
    y: parseFloat(row.y as unknown as string),
    yMin: parseFloat(row.yMin as unknown as string),
    yMax: parseFloat(row.yMax as unknown as string),
  }))
  const labels: string[] = JSON.parse(options.labels) as string[]

  const buffer: Buffer = await makeChart(data, labels, options)
  await saveImage(buffer, options.outfile)
}
