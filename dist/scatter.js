import { ChartJSNodeCanvas } from 'chartjs-node-canvas';
import { getChartConfig, saveImage } from './common.js';
async function makeChart(data, labels, options) {
    const datasets = [{
            backgroundColor: '#000000',
            data,
            datalabels: {
                anchor: 'center',
                align: 'top',
                formatter: (_, context) => {
                    const l = context.chart.data.labels;
                    if (l)
                        return l[context.dataIndex];
                    else
                        '';
                }
            }
        }];
    const config = getChartConfig(options, labels);
    config.data.datasets = datasets;
    if (config.options?.scales?.x && config.options.scales.x.ticks) {
        config.options.scales.x.min = 0;
        config.options.scales.x.max = 1;
        config.options.scales.x.ticks = {
            callback(value) {
                return `${Math.round(value * 100)}%`;
            },
            autoSkip: false
        };
    }
    config.type = 'scatter';
    const chartJSNodeCanvas = new ChartJSNodeCanvas({
        width: 600, height: 335, backgroundColour: '#ffffff', plugins: {
            modern: [],
            requireLegacy: ['chartjs-plugin-datalabels']
        }
    });
    return await chartJSNodeCanvas.renderToBuffer(config);
}
export const makeScatterChart = async (options, dataRows) => {
    const data = [];
    const labels = [];
    dataRows.forEach(row => {
        data.push({
            x: row[options.xcolumnkey],
            y: row[options.ycolumnkey]
        });
        if (options.labelcolumnkey) {
            labels.push(row[options.labelcolumnkey]);
        }
    });
    // console.log(data)
    const buffer = await makeChart(data, labels, options);
    await saveImage(buffer, options.outfile);
};
//# sourceMappingURL=scatter.js.map