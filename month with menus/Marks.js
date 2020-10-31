export const Marks = ({
  data,
  xScale,
  yScale,
  xValue,
  yValue,
  circleRadius
}) =>
  data.map(d => (
    <circle
      className="mark"
      cx={xScale(xValue(d))}
      cy={yScale(yValue(d))}
      r={circleRadius}
    >
      <title>{xValue(d)}</title>
    </circle>
  ));
