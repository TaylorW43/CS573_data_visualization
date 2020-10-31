export const Marks = ({
  data,
  xScale,
  yScale,
  xValue,
  yValue,
  circleRadius,
  innerHeight,
  innerWidth
}) =>
  data.map(d => (
    <rect
      className="mark"
      x={xScale(xValue(d))}
      y={yScale(yValue(d))}
      width={innerWidth/63}
      height={innerHeight - yScale(yValue(d))}
    >
      <title>Year:{xValue(d)} Count:{yValue(d)}</title>
    </rect>
  ));
