import _range from 'lodash/range';
import download from 'downloadjs';

// TODO Units? there can be both FPKMs and sometimes TPMs

const heatmapDataIntoLinesOfData = (heatmapData) => {

  const heatmapDataAsMatrix =
    _range(heatmapData.yAxisCategories.length).map(y => _range(heatmapData.xAxisCategories.length).map(x => `NA`));

  heatmapData.dataSeries.forEach(series => {
      series.data.forEach(point => {heatmapDataAsMatrix[point.y][point.x] = point.value})
  });

  return (
    [[``].concat(heatmapData.xAxisCategories.map((header)=> header.label))].concat(
      heatmapData.yAxisCategories.map((rowLabel, ix) => [].concat.apply([rowLabel.label], heatmapDataAsMatrix[ix]))
    ).map(line => line.join(`\t`))
  )
};

const CommenceDownload = args => {
  download(
    new Blob(
      [
        `# Downloaded from: ${window.location.href}`,
        `# Timestamp: ${new Date().toISOString()}`,
        ...args.descriptionLines.map(line => `# ${line}`),
        ...heatmapDataIntoLinesOfData(args.heatmapData)
      ].map(line => `${line}\n`)
    ),
    `${args.name.replace(/ +/, `_`)}.tsv`,
    `text/tsv`
  )
};

export {CommenceDownload};