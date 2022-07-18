#!/usr/bin/env node
import { program } from 'commander';
import { readFileSync } from 'fs';
import { makeScatterErrorChart } from './scattererror.js';
program
    .option('-o, --infile <string>', 'Data file.')
    .option('-o, --outfile <string>', 'Where to save the chart.')
    .option('-t, --title <string>', 'Title of the chart.')
    .option('-st, --subtitle <string>', 'Subtitle of the chart.')
    .option('-xt, --xtitle <string>', 'X axis title.')
    .option('-yt, --ytitle <string>', 'Y axis title.')
    .option('-l, --labels <string>', 'Labels in Json format.')
    .option('-t, --type <string>', 'Type of chart [scatter, scattererror].');
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
if (!options.type)
    throw new Error('Must specify --type.');
const rawData = readFileSync(options.infile, { encoding: 'utf8' });
switch (options.type) {
    case 'scatter':
        console.log('Making Scatter plot.');
        console.log('not implemented.');
        break;
    case 'scattererror':
        console.log('Making Scatter Error plot.');
        if (!options.labels)
            throw new Error('Must specify --labels.');
        await makeScatterErrorChart(options, rawData);
        break;
}
//# sourceMappingURL=make-chart.js.map