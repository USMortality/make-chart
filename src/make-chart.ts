#!/usr/bin/env node
import { program } from 'commander'
import { readFileSync } from 'fs'
import { makeScatterChart } from './scatter.js'
import { makeScatterErrorChart } from './scattererror.js'
import csvjson from 'csvjson'

export interface CliOptions {
  infile: string
  outfile: string
  title: string
  subtitle: string
  xtitle: string
  ytitle: string
  type: string
  labels: string,
  xcolumnkey: string,
  ycolumnkey: string,
  labelcolumnkey: string
}

program
  .option('-o, --infile <string>', 'Data file.')
  .option('-o, --outfile <string>', 'Where to save the chart.')
  .option('-t, --title <string>', 'Title of the chart.')
  .option('-st, --subtitle <string>', 'Subtitle of the chart.')
  .option('-xt, --xtitle <string>', 'X axis title.')
  .option('-yt, --ytitle <string>', 'Y axis title.')
  .option('-l, --labels <string>', 'Labels in Json format.')
  .option('-t, --type <string>', 'Type of chart [scatter, scattererror].')
  .option('-xk, --xcolumnkey <string>', 'Key of x column data.')
  .option('-yk, --ycolumnkey <string>', 'Key of x column data.')
  .option('-lk, --labelcolumnkey <string>', 'Key of label column data.')

program.parse()
const options: CliOptions = program.opts()

if (!options.infile) throw new Error('Must specify --infile.')
if (!options.outfile) throw new Error('Must specify --outfile.')
if (!options.title) throw new Error('Must specify --title.')
if (!options.subtitle) throw new Error('Must specify --subtitle.')
if (!options.xtitle) throw new Error('Must specify --xtitle.')
if (!options.ytitle) throw new Error('Must specify --ytitle.')
if (!options.type) throw new Error('Must specify --type.')

const rawData = readFileSync(options.infile, { encoding: 'utf8' })
const delimiter = options.infile.endsWith('.tsv') ? '\t' : ','
// eslint-disable-next-line @typescript-eslint/no-unsafe-call, @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-member-access
const dataRows: [] = csvjson.toObject(rawData, { delimiter })

switch (options.type) {
  case 'scatter':
    console.log('Making Scatter plot.')
    if (!options.xcolumnkey) throw new Error('Must specify --xColumnKey.')
    if (!options.ycolumnkey) throw new Error('Must specify --yColumnKey.')
    await makeScatterChart(options, dataRows)
    break
  case 'scattererror':
    console.log('Making Scatter Error plot.')
    if (!options.labels) throw new Error('Must specify --labels.')
    await makeScatterErrorChart(options, dataRows)
    break
}
