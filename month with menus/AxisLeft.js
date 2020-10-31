export const AxisLeft = ({ yScale,innerWidth }) =>
  yScale.domain().map(tickValue => (
    <g className="tick" transform={`translate(0,${yScale(tickValue)})`}>
     <line x2={innerWidth} />
      <text
        key={tickValue}
        style={{ textAnchor: 'end' }}
        x={-3}
        dy=".32em"
      >
        {tickValue}
      </text>
    </g>
  ));