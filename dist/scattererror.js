import { ChartJSNodeCanvas } from 'chartjs-node-canvas';
import { ScatterWithErrorBarsController } from 'chartjs-chart-error-bars';
import { getChartConfig, saveImage } from './common.js';
async function makeChart(data, labels, options) {
    const datasets = [{
            pointStyle: 'cross',
            borderColor: '#000000',
            backgroundColor: '#000000',
            errorBarColor: '#000000',
            errorBarWhiskerColor: '#000000',
            borderWidth: 0.5,
            borderSkipped: false,
            data,
        }];
    const config = getChartConfig(options, labels);
    config.data.datasets = datasets;
    config.type = ScatterWithErrorBarsController.id;
    if (config.options?.scales?.x && config.options.scales.x.ticks) {
        config.options.scales.x.ticks = {
            callback(value) {
                return `${parseInt(value, 10) * 100} %`;
            },
            autoSkip: false
        };
    }
    if (config.options?.scales?.y) {
        config.options.scales.y.min = 0.5;
        config.options.scales.y.max = labels.length + .5;
        if (config.options.scales.y.ticks) {
            config.options.scales.y.ticks = {
                callback(_, index) {
                    if (index % 2 === 0)
                        return;
                    return labels[index / 2 - 0.5];
                },
                autoSkip: false
            };
        }
    }
    const chartJSNodeCanvas = new ChartJSNodeCanvas({
        width: 600, height: 335, backgroundColour: '#ffffff', plugins: {
            modern: ['chartjs-chart-error-bars'],
            requireLegacy: []
        }
    });
    return await chartJSNodeCanvas.renderToBuffer(config);
}
export const makeScatterErrorChart = async (options, rawData) => {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access, @typescript-eslint/no-unsafe-call
    const dataRows = rawData;
    const data = [];
    dataRows.forEach(row => data.push({
        x: parseFloat(row.x),
        xMin: parseFloat(row.xMin),
        xMax: parseFloat(row.xMax),
        y: parseFloat(row.y),
        yMin: parseFloat(row.yMin),
        yMax: parseFloat(row.yMax),
    }));
    const labels = JSON.parse(options.labels);
    const buffer = await makeChart(data, labels, options);
    await saveImage(buffer, options.outfile);
};
//# sourceMappingURL=scattererror.js.map