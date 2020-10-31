import {
  scaleLinear,
  scaleSqrt,
  max,
  zoom,
  event,
  select,
  geoNaturalEarth1,
  geoPath,
  geoGraticule,
  map,
  arc,
} from 'd3';

const projection = geoNaturalEarth1();
const path = geoPath(projection);
const graticule = geoGraticule();

export const mapp = (selection, props) => {
  const {
    features,
    selectedCountryId,
    selectedCountryName,
    onCountryClick,
    place_dict_data,
    p_s_dict,
    s_f_dict,
    p_c_dict,
  } = props;

  const gUpdate = selection.selectAll('g').data([null]);
  const gEnter = gUpdate.enter().append('g');
  const g = gUpdate.merge(gEnter);

  gEnter
    .append('path')
    .attr('class', 'sphere')
    .attr('d', path({ type: 'Sphere' }))
    .merge(gUpdate.select('.sphere'))
    .attr('opacity', selectedCountryId ? 0.03 : 0.3);

  gEnter
    .append('path')
    .attr('class', 'graticules')
    .attr('d', path(graticule()));

  selection.call(
    zoom().on('zoom', () => {
      g.attr('transform', event.transform);
    })
  );

  const countryPaths = g.selectAll('.country').data(features);
  const countryPathsEnter = countryPaths
    .enter()
    .append('path')
    .attr('class', 'country');
  countryPaths
    .merge(countryPathsEnter)
    .attr('d', path)
    .attr('fill', '#009900')
    .attr('opacity', (d) =>
      !selectedCountryId || selectedCountryId === d.id ? 0.2 : 0.02
    )
    .on('click', (d) => {
      if (selectedCountryId && selectedCountryId === d.id) {
        onCountryClick(null);
      } else {
        onCountryClick(d.id, d.c_name);
      }
    })
    .append('title')
    .text((d) => d.c_name);

  //console.log(place_dict_data[0]);
  const sizeValue = (d) => d.my_count;

  const tooltipValue = (d) => {
    /*
    var temp_arr = [];
    temp_arr.push('Number of Launches: ');
    temp_arr.push(d.my_place);
    temp_arr.push('\nLocation: ');
    temp_arr.push(d.my_count);
    //temp_arr.push('\nCountry of launch:');
    //temp_arr.push(d.Country_of_Launch);
*/
    var temp_p_c = [];
    if (d.my_place in p_c_dict) {
      temp_p_c = p_c_dict[d.my_place];
    }

    return (
      'Number of Launches: ' +
      d.my_count +
      '\nLocation: ' +
      d.my_place +
      '\nLaunch Country: ' +
      temp_p_c
    );
  };

  const minLength = 2;
  const maxLength = 43;

  const sizeScale = scaleLinear()
    .domain([0, max(place_dict_data, sizeValue)])
    .range([minLength, maxLength]);

  place_dict_data.forEach((d) => {
    d.project_lon_lat = projection([d.my_long, d.my_lat]);
    //console.log(d.project_lon_lat);
  });

  place_dict_data.forEach((d) => {
    var x1 = d.project_lon_lat[0];
    var y1 = d.project_lon_lat[1];
    const s_width = 6;
    const s_height = sizeScale(sizeValue(d));
    var x2 = x1 - s_width / 2;
    var y2 = y1 - s_height;
    var x3 = x1 + s_width / 2;
    var y3 = y1 - s_height;

    var poly = [
      { x: x1, y: y1 },
      { x: x2, y: y2 },
      { x: x3, y: y3 },
    ];

    d.my_poly_points = poly;

    //console.log(d.my_poly_points[0]);
  });

  //my_data.forEach((d)=>{console.log(d.Country_of_Launch);});

  //console.log(my_data[0]);
  //console.log(selectedCountryName);
  //console.log(selectedCountryId);

  const my_polygon = g.selectAll('.polygon').data(place_dict_data);
  const my_polygonEnter = my_polygon
    .enter()
    .append('polygon')
    .attr('class', 'polygon');
  my_polygon
    .merge(my_polygonEnter)
    .attr('d', path)
    .attr('points', function (d) {
      if (d.my_poly_points != 'null') {
        var d1 = d.my_poly_points;
        return d1
          .map(function (d1) {
            return [d1.x, d1.y];
          })
          .join(' ');
      }
    })
    .attr('fill', 'green')
    .attr('fill-opacity', (d) => {
      if (!selectedCountryId || selectedCountryId === 'null') {
        // || selectedCountryName===d.Country_of_Launch) {
        return 1;
      } else {
        return 0;
      }
    })
    .append('title')
    .text((d) => [tooltipValue(d)]);

  const arc1 = g.selectAll('.arc').data(place_dict_data);
  const arc1Enter = arc1.enter().append('path').attr('class', 'arc');

  var my_end_val = p_s_dict[selectedCountryName];
  var my_end = Math.PI * 2 * my_end_val;

  const my_arc1 = arc(my_end)
    .innerRadius(40)
    .outerRadius(60)
    .startAngle(0)
    .endAngle(my_end);

  arc1
    .merge(arc1Enter)
    .attr('transform', 'translate(495,320)')
    .attr('class', 'arc')
    //.attr('d','M445 320 a40 40 0 0 1 0 80 a40 40 0 0 1 0 -80')
    .attr('d', my_arc1)
    .attr('fill', '#BB2020')
    .attr('fill-opacity', (d) => {
      if (!selectedCountryId || selectedCountryId === 'null') {
        return 0;
      } else {
        return 1;
      }
    });

  var my_end_val1 = s_f_dict[selectedCountryName];
  var my_end1 = Math.PI * 2 * my_end_val1;

  //console.log(s_f_dict[selectedCountryName]);

  const my_arc3 = arc(my_end1)
    .innerRadius(40)
    .outerRadius(60)
    .startAngle(0)
    .endAngle(my_end1);

  //console.log(my_end1);

  const arc3 = selection.selectAll('g').data([null]);
  const arc3Enter = arc3.enter().append('g');

  gEnter
    .append('path')
    .attr('class', 'arc')
    .merge(arc3.select('.arc'))
    .attr('transform', 'translate(695,320)')
    .attr('d', my_arc3)
    .attr('fill', 'green');

  const a_text = selection.selectAll('g').data([null]);
  const a_textEnter = a_text.enter().append('g');

  //console.log(selectedCountryId);
  //a_textEnter
  gEnter
    .append('text')
    .attr('class', 'text')
    .merge(a_text.selectAll('.text'))
    .attr('transform', 'translate(595,250)')
    //.attr('transform', 'translate(393,250)')
    //.attr('dx', '310')
    //.attr('dy', '200')
    .attr('fill', 'green')
    .attr('text-anchor', 'middle')
    .text((d) => {
      if (!selectedCountryId || selectedCountryId === 'null') {
        return '';
      } else {
        if (selectedCountryName in p_s_dict) {
          if (selectedCountryName === 'Korea') {
            return (
              'South Korea: ' +
              'State Launch Rate: ' +
              (my_end_val * 100).toFixed(2) +
              '%' +
              ' Success Rate:' +
              (my_end_val1 * 100).toFixed(2) +
              '%'
            );
          } else if (selectedCountryName === 'Dem. Rep. Korea') {
            return (
              'North Korea: ' +
              'State Launch Rate: ' +
              (my_end_val * 100).toFixed(2) +
              '%' +
              ' Success Rate:' +
              (my_end_val1 * 100).toFixed(2) +
              '%'
            );
          } else
            return (
              selectedCountryName +
              ': State Launch Rate: ' +
              (my_end_val * 100).toFixed(2) +
              '%' +
              ' Success Rate:' +
              (my_end_val1 * 100).toFixed(2) +
              '%'
            );
        } else {
          return selectedCountryName + ': ' + 'No Data';
        }
      }
    });

};
