import { writeFile } from 'fs';
export async function saveImage(image, filename) {
    return new Promise(res => {
        writeFile(filename, image, 'base64', err => {
            if (err)
                console.error(err);
            res();
        });
    });
}
export function getChartConfig(options, labels) {
    return {
        type: 'line',
        data: {
            datasets: [],
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
                }
            },
            scales: {
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
                    ticks: {},
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
                y: {
                    title: {
                        display: true,
                        color: '#bbbbbb',
                        text: options.ytitle,
                        font: {
                            size: 10
                        }
                    },
                    ticks: {},
                },
            }
        }
    };
}
//# sourceMappingURL=common.js.map