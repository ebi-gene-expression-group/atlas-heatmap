import _range from 'lodash/range'
import download from 'downloadjs'

const heatmapDataIntoLinesOfData = (heatmapData,experiment) => {

    const symbol = experiment?`0`:`NA`
    const heatmapDataAsMatrix =
        _range(heatmapData.yAxisCategories.length)
            .map(y => _range(heatmapData.xAxisCategories.length).map(x => symbol))

    heatmapData.dataSeries.forEach(series => {
        series.data.forEach(point => {heatmapDataAsMatrix[point.y][point.x] = point.value})
    })

    return (
        [[``].concat(heatmapData.xAxisCategories.map(header => header.label))].concat(
            heatmapData.yAxisCategories
                .map((rowLabel, ix) => [].concat.apply([rowLabel.label], heatmapDataAsMatrix[ix]))
        ).map(line => line.join(`\t`))
    )

}

const CommenceDownload = ({name, descriptionLines, heatmapData},experiment) => {
    download(
        new Blob(
            [
                `# Downloaded from: ${window.location.href}`,
                `# Timestamp: ${new Date().toISOString()}`,
                ...descriptionLines.map(line => `# ${line}`),
                ...heatmapDataIntoLinesOfData(heatmapData, experiment)
            ].map(line => `${line}\n`)
        ),
        `${name.replace(/ +/, `_`)}.tsv`,
        `text/tsv`
    )
}

export default CommenceDownload