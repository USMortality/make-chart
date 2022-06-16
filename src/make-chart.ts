#!/usr/bin/env node
import { ChartConfiguration } from 'chart.js'
import { ChartJSNodeCanvas } from 'chartjs-node-canvas'
import { program } from 'commander'
import { readFileSync, writeFile } from 'fs'
import { ScatterWithErrorBarsController, IErrorBarXYDataPoint } from 'chartjs-chart-error-bars'
import csvjson from 'csvjson'

interface DataRow {
  y: string,
  yMin: string,
  yMax: string,
  x: string,
  xMin: string,
  xMax: string
}

program
  .option('-o, --infile <string>', 'Data file.')
  .option('-o, --outfile <string>', 'Where to save the chart.')
  .option('-t, --title <string>', 'Title of the chart.')
  .option('-st, --subtitle <string>', 'Subtitle of the chart.')
  .option('-xt, --xtitle <string>', 'X axis title.')
  .option('-yt, --ytitle <string>', 'Y axis title.')
  .option('-l, --labels <string>', 'Labels in Json format.')
  .option('-d, --data <string>', 'Data in Json format.')

program.parse()
const options = program.opts()

if (!options.infile) throw new Error('Must specificy --infile.')
if (!options.outfile) throw new Error('Must specificy --outfile.')
if (!options.title) throw new Error('Must specificy --title.')
if (!options.subtitle) throw new Error('Must specificy --subtitle.')
if (!options.xtitle) throw new Error('Must specificy --xtitle.')
if (!options.ytitle) throw new Error('Must specificy --ytitle.')
if (!options.labels) throw new Error('Must specificy --labels.')

const rawData = readFileSync(options.infile as string, { encoding: 'utf8' })
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
console.log(data)
const labels: string[] = JSON.parse(options.labels as string) as string[]
const width = 600
const height = 335
const chartJSNodeCanvas = new ChartJSNodeCanvas({
  width, height, backgroundColour: '#ffffff', plugins: {
    modern: ['chartjs-chart-error-bars']
  }
})

export async function saveImage(image: Buffer, filename: string):
  Promise<void> {
  return new Promise(res => {
    writeFile(filename, image, 'base64', err => {
      if (err) console.error(err)
      res()
    })
  })
}

async function makeChart() {
  const configuration: ChartConfiguration = {
    type: ScatterWithErrorBarsController.id,
    data: {
      datasets: [{
        pointStyle: 'cross',
        borderColor: '#000000',
        backgroundColor: '#000000',
        errorBarColor: '#000000',
        errorBarWhiskerColor: '#000000',
        borderWidth: 0.5,
        borderSkipped: false,
        data,
      }],
      labels
    },
    options: {
      responsive: false,
      devicePixelRatio: 2,
      layout: {
        padding: 10
      },
      plugins: {
        legend: {
          display: false,
          position: 'top',
        },
        title: {
          display: true,
          color: 'rgba(0, 0, 0, 100%)',
          text: options.title as string,
          font: {
            size: 18
          }
        },
        subtitle: {
          display: true,
          color: 'rgba(0, 0, 0, 100%)',
          text: options.subtitle as string,
          font: {
            size: 10
          },
          padding: { bottom: 20 }
        },
      },
      scales: {
        y: {
          title: {
            display: true,
            color: '#bbbbbb',
            text: options.ytitle as string,
            font: {
              size: 10
            }
          },
          ticks: {
            callback(_, index) {
              if (index % 2 === 0) return
              return labels[index / 2 - 0.5]
            },
            autoSkip: false
          },
          min: 0.5,
          max: labels.length + .5,
        },
        x: {
          type: 'linear',
          position: 'left',
          title: {
            display: true,
            color: '#bbbbbb',
            text: options.xtitle as string,
            font: {
              size: 10
            }
          },
          ticks: {
            callback(value) {
              return `${parseInt(value as string, 10) * 100} %`
            },
            autoSkip: false
          },
          grid: {
            drawBorder: false,
            color: context => {
              if (context.tick.value === 0) return '#aaaaaa'
              else return '#eeeeee'
            }
          },
        },
      }
    },
    plugins: [],
  }

  return await chartJSNodeCanvas.renderToBuffer(configuration)
}

async function save(filename: string): Promise<void> {
  const buffer: Buffer = await makeChart()
  await saveImage(buffer, filename)
}

await save(options.outfile as string)
