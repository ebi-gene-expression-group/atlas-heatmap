# Expression Atlas Heatmap

Visualization of baseline, proteomics baseline and differential gene expression experiments for [Expression
Atlas](https://www.ebi.ac.uk/gxa).

It has four basic visualizations:
* Multiexperiment: collapses several baseline tissue experiments into a single table
* Baseline: displays a single RNA-seq baseline expression experiment
* Proteomics baseline: displays a single proteomics baseline expression experiment
* Differential: displays a single differential expression experiment

Visualizations optionally include, where available, an anatomogram to the left of the table.

## Atlas Widget

The heatmap can be included as a widget in your website.
[Demo](https://www.ebi.ac.uk/gxa/resources/test/widget/showcase/index.html)

### What you need
You must add the following to your environment:

```
<link rel="stylesheet" type="text/css"
href="https://www.ebi.ac.uk/gxa/resources/css/customized-bootstrap-3.3.5.css"/>
```

If you already use your own flavour of Bootstrap, then you
can remove the styles link tags and the widget will integrate smoothly
in your environment.

Are you targetting ES5, IE11 or Safari? Include these polyfills for babel-polyfill and whatwg-fetch:
```
<script language="JavaScript" type="text/javascript"
src="https://www.ebi.ac.uk/gxa/resources/js/lib/babel-polyfill.min.js"></script>
<script language="JavaScript" type="text/javascript"
src="https://www.ebi.ac.uk/gxa/resources/js/lib/fetch-polyfill.min.js"></script>
```

Then include our widget and the vendor bundle:
```
<script language="JavaScript" type="text/javascript"
src="https://www.ebi.ac.uk/gxa/resources/js-bundles/vendorCommons.bundle.js"></script>
<script language="JavaScript" type="text/javascript"
src="https://www.ebi.ac.uk/gxa/resources/js-bundles/expressionAtlasHeatmapHighcharts.bundle.js"></script>
```

### Invoking the widget

You need to call the render method on the exposed global variable:
```
expressionAtlasHeatmapHighcharts.render({
    query: {
      gene: "ASPM"
    },
    isMultiExperiment: true,
    target: "heatmapContainer"
});
```
[Lots of examples](https://www.ebi.ac.uk/gxa/resources/test/widget/showcase/index.html)

Tell us about any problems by raising an issue in this repository.

## Building from source
```
npm install expression-atlas-heatmap-highcharts --save
```
You can use it as a React component:
```
import ExpressionAtlasHeatmap from 'expression-atlas-heatmap-highcharts'
...
ReactDom.render(<ExpressionAtlasHeatmap .../>, 'id-of-dom-element')
```

Or mount it on a DOM node if you’re not using the React framework:
```
import {render as expressionAtlasHeatmapRender} from 'expression-atlas-heatmap-highcharts'
...
expressionAtlasHeatmapRender({...})
```

For all the options available visit the [examples showcase](http://www.ebi.ac.uk/gxa/resources/test/widget/showcase/index.html).

##### Notes for developers
The authoritative docs are the code itself, here is the main function: [here](https://github.com/gxa/atlas-heatmap/blob/master/src/Main.js)

#### Licence

Apache 2.0.
When including the widget on your website, please keep the attribution footer linking to the results in Expression Atlas.
