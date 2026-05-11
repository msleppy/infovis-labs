// Main JS file
import * as d3 from "https://cdn.jsdelivr.net/npm/d3@7/+esm";
import {renderScatterplot} from "./scatterplot_lab5.js";
import {renderBarchart} from "./barchart_lab5.js";
import {renderBonus} from "./bonus.js";

d3.csv("./cars.csv").then((data) => {
  renderScatterplot(d3, data);
  renderBarchart(d3, data);
  renderBonus(d3, data);
});