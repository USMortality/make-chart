import { ChartJSNodeCanvas } from 'chartjs-node-canvas';
import { ScatterWithErrorBarsController } from 'chartjs-chart-error-bars';
import csvjson from 'csvjson';
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
    const chartConfiguration = getChartConfig(labels, datasets, options);
    chartConfiguration.type = ScatterWithErrorBarsController.id;
    const chartJSNodeCanvas = new ChartJSNodeCanvas({
        width: 600, height: 335, backgroundColour: '#ffffff', plugins: {
            modern: ['chartjs-chart-error-bars']
        }
    });
    return await chartJSNodeCanvas.renderToBuffer(chartConfiguration);
}
export const makeScatterErrorChart = async (options, rawData) => {
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
    const labels = JSON.parse(options.labels);
    const buffer = await makeChart(data, labels, options);
    await saveImage(buffer, options.outfile);
};
//# sourceMappingURL=scattererror.js.map