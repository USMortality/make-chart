import { CliOptions } from './make-chart'
import {
  ChartConfiguration,
  ChartDataset,
  ChartType,
  DefaultDataPoint
} from 'chart.js'
import { ScatterWithErrorBarsController } from 'chartjs-chart-error-bars'
import { writeFile } from 'fs'

export async function saveImage(image: Buffer, filename: string):
  Promise<void> {
  return new Promise(res => {
    writeFile(filename, image, 'base64', err => {
      if (err) console.error(err)
      res()
    })
  })
}

export function getChartConfig(
  labels: string[],
  datasets: ChartDataset<ChartType, DefaultDataPoint<ChartType>>[],
  options: CliOptions
): ChartConfiguration {
  return {
    type: ScatterWithErrorBarsController.id,
    data: {
      datasets,
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
          text: options.title,
          font: {
            size: 18
          }
        },
        subtitle: {
          display: true,
          color: 'rgba(0, 0, 0, 100%)',
          text: options.subtitle,
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
            text: options.ytitle,
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
            text: options.xtitle,
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
}
