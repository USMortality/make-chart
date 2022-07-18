import { ChartJSNodeCanvas } from 'chartjs-node-canvas'
import {
  ScatterWithErrorBarsController,
  IErrorBarXYDataPoint
} from 'chartjs-chart-error-bars'
import csvjson from 'csvjson'
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
  const chartConfiguration = getChartConfig(labels, datasets, options)
  chartConfiguration.type = ScatterWithErrorBarsController.id

  const chartJSNodeCanvas = new ChartJSNodeCanvas({
    width: 600, height: 335, backgroundColour: '#ffffff', plugins: {
      modern: ['chartjs-chart-error-bars']
    }
  })
  return await chartJSNodeCanvas.renderToBuffer(chartConfiguration)
}

export const makeScatterErrorChart = async (options: CliOptions, rawData) => {
  // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access, @typescript-eslint/no-unsafe-call
  const dataRows = csvjson.toObject(rawData, { delimiter: ',' }) as DataRow[]
  const data: IErrorBarXYDataPoint[] = []
  dataRows.map(row => data.push({
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
