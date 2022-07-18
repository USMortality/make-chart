#!/usr/bin/env node
import { ChartJSNodeCanvas } from 'chartjs-node-canvas';
import { program } from 'commander';
import { readFileSync } from 'fs';
import { ScatterWithErrorBarsController } from 'chartjs-chart-error-bars';
import csvjson from 'csvjson';
import { saveImage } from './common.js';
async function makeChart() {
    const configuration = {
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
                            if (index % 2 === 0)
                                return;
                            return labels[index / 2 - 0.5];
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
                            return `${parseInt(value, 10) * 100} %`;
                        },
                        autoSkip: false
                    },
                    grid: {
                        drawBorder: false,
                        color: context => {
                            if (context.tick.value === 0)
                                return '#aaaaaa';
                            else
                                return '#eeeeee';
                        }
                    },
                },
            }
        },
        plugins: [],
    };
    return await chartJSNodeCanvas.renderToBuffer(configuration);
}
program
    .option('-o, --infile <string>', 'Data file.')
    .option('-o, --outfile <string>', 'Where to save the chart.')
    .option('-t, --title <string>', 'Title of the chart.')
    .option('-st, --subtitle <string>', 'Subtitle of the chart.')
    .option('-xt, --xtitle <string>', 'X axis title.')
    .option('-yt, --ytitle <string>', 'Y axis title.')
    .option('-l, --labels <string>', 'Labels in Json format.');
program.parse();
const options = program.opts();
if (!options.infile)
    throw new Error('Must specify --infile.');
if (!options.outfile)
    throw new Error('Must specify --outfile.');
if (!options.title)
    throw new Error('Must specify --title.');
if (!options.subtitle)
    throw new Error('Must specify --subtitle.');
if (!options.xtitle)
    throw new Error('Must specify --xtitle.');
if (!options.ytitle)
    throw new Error('Must specify --ytitle.');
if (!options.labels)
    throw new Error('Must specify --labels.');
const rawData = readFileSync(options.infile, { encoding: 'utf8' });
// eslint-disable-next-line @typescript-eslint/no-unsafe-member-access, @typescript-eslint/no-unsafe-call
const dataRows = csvjson.toObject(rawData, { delimiter: ',' });
const data = [];
dataRows.map(row => data.push({
    x: parseFloat(row.x),
    xMin: parseFloat(row.xMin),
    xMax: parseFloat(row.xMax),
    y: parseFloat(row.y),
    yMin: parseFloat(row.yMin),
    yMax: parseFloat(row.yMax),
}));
console.log(data);
const labels = JSON.parse(options.labels);
const chartJSNodeCanvas = new ChartJSNodeCanvas({
    width: 600, height: 335, backgroundColour: '#ffffff', plugins: {
        modern: ['chartjs-chart-error-bars']
    }
});
const buffer = await makeChart();
await saveImage(buffer, options.outfile);
//# sourceMappingURL=make-chart%20copy.js.map