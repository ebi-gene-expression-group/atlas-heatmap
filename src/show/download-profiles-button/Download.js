const _range = require(`lodash/range`)
const CommenceDownload = require("downloadjs");

/*
TODO Units? there can be both FPKMs and sometimes TPMs
*/


const heatmapDataIntoLinesOfData = (heatmapData) => {

  const heatmapDataAsMatrix =
    _range(heatmapData.yAxisCategories.length)
    .map((y) => (
      _range(heatmapData.xAxisCategories.length)
      .map((x) => (
        "NA"
      ))
    ))
  heatmapData.dataSeries.forEach((series)=>{
    series.data.forEach((point)=>{
      heatmapDataAsMatrix[point.y][point.x] = point.value
    })
  })
  return (
    [[""].concat(heatmapData.xAxisCategories.map((header)=> header.label))].concat(
      heatmapData.yAxisCategories.map((rowLabel, ix)=>(
        [].concat.apply([rowLabel.label], heatmapDataAsMatrix[ix])
      ))
    ).map((line)=>(
      line.join('\t')
    ))
  )
}

const buildUrl = (lines) => (
  'data:text/tsv;charset=utf-8,' + encodeURI(lines.join('\n'))
)

exports.buildUrl = buildUrl;

exports.commenceDownload = (args) => {
  CommenceDownload(
    buildUrl(
      ["#Results: "+args.name+ ", "+new Date().toISOString()]
      .concat(
        args.descriptionLines.map((line)=>"#"+line),
        heatmapDataIntoLinesOfData(args.heatmapData))
      ),
    args.name.replace(/" +"/,"_")+".tsv",
    "text/tsv"
  )
}
