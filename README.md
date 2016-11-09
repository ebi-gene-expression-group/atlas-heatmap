## Expression Atlas Heatmap

Heatmap visualization of baseline, proteomics baseline and differential gene expression experiments for [Expression
Atlas](http://www.ebi.ac.uk/gxa).

It has four basic visualizations:
* Multiexperiment: collapses several baseline tissue experiments into a single table
* Baseline: displays a single baseline expression experiment
* Proteomics baseline: displays a single proteomics baseline expression experiment
* Differential: displays a single differential expression experiment

Visualizations include, where available, an anatomogram to the left of the table.

### Atlas Widget

Our data can be included as a widget as part of your website.
[Demo](https://gxa.github.io/atlas-heatmap/html/genePageZincFinger.html)

##### What you need
You should add the following to your environment:

```
<link rel="stylesheet" type="text/css"
href="http://www.ebi.ac.uk/gxa/resources/css/customized-bootstrap-3.3.5.css"/>
```

If you already use your own flavour of Bootstrap, then you
can remove the styles link tags and the widget will integrate smoothly
in your environment. You could also skip it as we only make a fairly light use of Bootstrap.

Then include our widget and the vendor bundle:
```
<script language="JavaScript" type="text/javascript"
src="http://www.ebi.ac.uk/gxa/resources/js-bundles/vendorCommons.bundle.js"></script>
<script language="JavaScript" type="text/javascript"
src="http://www.ebi.ac.uk/gxa/resources/js-bundles/expressionAtlasHeatmapHighcharts.bundle.js"></script>
```

You could also build us from source - we use webpack/npm.
```
npm install expression-atlas-heatmap-highcharts
```

Tell us about any problems by raising an issue in this repository.

##### Invoking the widget

You need to call the render method on the exposed global variable:
```
expressionAtlasHeatmapHighcharts.render({
    params: "geneQuery=ASPM&species=mus%20musculus",
    isMultiExperiment: true,
    target: "heatmapContainer"
});
```

At the time of writing the docs are over the code: [here](https://github.com/gxa/atlas-heatmap/blob/master/src/highchartsHeatmapRenderer.js)

##### License

Apache 2.0.
When including the widget on your website, please keep the attribution footer linking to the results in Expression Atlas.
