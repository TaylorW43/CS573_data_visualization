import React, { useState } from 'react';
import ReactDOM from 'react-dom';
import { scaleBand,scaleLinear,extent } from 'd3';
import ReactDropdown from 'react-dropdown';
import { useData } from './useData';
import { AxisBottom } from './AxisBottom';
import { AxisLeft } from './AxisLeft';
import { Marks } from './Marks';

const menuHeight = 80;

const width = 960;
const height = 500 - menuHeight;
const margin = { top: 20, right: 30, bottom: 65, left: 90 };
const xAxisLabelOffset = 50;
const yAxisLabelOffset = 45;

const attrY = [{ value: 'month', Label: 'Month' }];

const attributes=[
	{ value: 'Year', label: '1957-2020' },
  { value: 'first_group', label: '1957-1970' },
  { value: 'second_group', label: '1970-1983' },
  { value: 'third_group', label: '1983-1996' },
  { value: 'fourth_group', label: '1996-2009' },
  { value: 'fifth_group', label: '2009-2020' },
];

const getLabel = (value) => {
  for (let i = 0; i < attributes.length; i++) {
    if (attributes[i].value == value) {
      return attributes[i].label;
    }
  }
};

const App = () => {
  const data = useData();
  
  //console.log(data);

  const initialXAttribute = 'Year';
  const [xAttribute, setXAttribute] = useState(initialXAttribute);

  //const xValue = d => d.Year;
  const xValue = d => d[xAttribute];
  const xAxisLabel = getLabel(xAttribute);

  const yValue = (d) => d.Month;
  const yAxisLabel = 'Month';

  //console.log(yAttribute);
  //console.log(yAxisLabel);

  if (!data) {
    return <pre>Loading...</pre>;
  }

  const innerHeight = height - margin.top - margin.bottom;
  const innerWidth = width - margin.left - margin.right;
  
  
  const circleRadius=3;

  const xScale = scaleLinear()
    .domain(extent(data, xValue))
    .range([0, innerWidth]);
    
  const yScale = scaleBand()
    .domain([12, 11, 10, 9, 8, 7, 6, 5, 4, 3, 2, 1])
    .range([0, innerHeight]);

  return (
    <>
      <div className="menus-container">
        <span className="dropdown-label">X</span>
        <ReactDropdown
          options={attributes}
          value={xAttribute}
          onChange={({ value }) => setXAttribute(value)}
        />
        <span className="dropdown-label">Y</span>
        <ReactDropdown options={attrY} value="Month" />
      </div>

      <svg width={width} height={height}>
        <g transform={`translate(${margin.left},${margin.top})`}>
          <AxisBottom
            xScale={xScale}
            innerHeight={innerHeight}
            tickOffset={5}
          />

          <text
            className="axis-label"
            textAnchor="middle"
            transform={`translate(${-yAxisLabelOffset},${
              innerHeight / 2
            }) rotate(-90)`}
          >
            {yAxisLabel}
          </text>

          <AxisLeft yScale={yScale} innerWidth={innerWidth} tickOffset={5} />

          <text
            className="axis-label"
            x={innerWidth / 2}
            y={innerHeight + xAxisLabelOffset}
            textAnchor="middle"
          >
            {xAxisLabel}
          </text>

          <Marks
            data={data}
            xScale={xScale}
            yScale={yScale}
            xValue={xValue}
            yValue={yValue}
            circleRadius={circleRadius}
          />
        </g>
      </svg>
    </>
  );
};
const rootElement = document.getElementById('root');
ReactDOM.render(<App />, rootElement);
