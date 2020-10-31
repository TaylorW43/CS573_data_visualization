(function (d3, topojson) {
  'use strict';

  const useWorld = () =>
    Promise.all([
      d3.tsv('https://unpkg.com/world-atlas@1.1.4/world/50m.tsv'),
      d3.json('https://unpkg.com/world-atlas@2.0.2/countries-50m.json'),
      d3.csv(
        'https://gist.githubusercontent.com/TaylorW43/25908e7fbe9def43d82d879c774e531d/raw/41cfb669ff137706c46477269c0bd9e4d72cfe2b/added_cor.csv'
      ),
    ]).then(([tsv_data, json_data, csv_data]) => {
      const countryName = tsv_data.reduce((accumulator, d) => {
        accumulator[d.iso_n3] = d.name;
        return accumulator;
      }, {});

      //console.log(countryName);

      const my_countries = topojson.feature(json_data, json_data.objects.countries);

      my_countries.features.forEach((d) => {
        //console.log(d.id);
        d.c_name = countryName[d.id];
      });
      var place_dict = {};
      var p_s_dict = {};
      var s_f_dict = {};
      var p_c_dict={};

      csv_data.forEach((d) => {
        //console.log(d);
        //d.Latitude = +d.Latitude;
        //d.Longitude = +d.Longitude;
        //d.Count = +d.Count;
        if (d.Longitude != 'null' && d.Latitude != 'null') {
          if (d.Place in place_dict) {
            //console.log(place_dict[d.Place].my_count);
            var new_count = place_dict[d.Place].my_count + 1;
            place_dict[d.Place].my_count = new_count;
          } else {
            var temp_dic = {};
            temp_dic['my_place'] = d.Place;
            temp_dic['my_long'] = d.Longitude;
            temp_dic['my_lat'] = d.Latitude;
            temp_dic['my_count'] = 1;
            
            place_dict[d.Place] = temp_dic;
          }
        }
        //console.log(place_dict);

        if (d.Companys_Country_of_Origin in p_s_dict) {
          var temp_ori = p_s_dict[d.Companys_Country_of_Origin];
          //console.log(temp_ori);

          if (d.Private_or_State_Run == 'P') {
            //console.log(p_s_dict[d.Companys_Country_of_Origin].P);
            p_s_dict[d.Companys_Country_of_Origin].P += 1;
          } else if (d.Private_or_State_Run == 'S') {
            p_s_dict[d.Companys_Country_of_Origin].S += 1;
          }
        } else {
          if (d.Private_or_State_Run == 'P') {
            var temp = { P: 1, S: 0 };
          } else if (d.Private_or_State_Run == 'S') {
            var temp = { P: 0, S: 1 };
          }
          p_s_dict[d.Companys_Country_of_Origin] = temp;
        }

        if (d.Companys_Country_of_Origin in s_f_dict) {
          var temp_ori2 = s_f_dict[d.Companys_Country_of_Origin];
          //console.log(temp_ori);

          if (d.Status_Mission == 'Success') {
            s_f_dict[d.Companys_Country_of_Origin].suc += 1;
          } else {
            s_f_dict[d.Companys_Country_of_Origin].fail += 1;
          }
        } else {
          if (d.Status_Mission == 'Success') {
            var temp = { suc: 1, fail: 0 };
          } else {
            var temp = { suc: 0, fail: 1 };
          }
          s_f_dict[d.Companys_Country_of_Origin] = temp;
        }
        
        if(d.Place in p_c_dict)
        {
        	var temp_p_c=p_c_dict[d.Place];
          if(temp_p_c.includes(d.Companys_Country_of_Origin))
          ;
          else
          {
          	temp_p_c.push(d.Companys_Country_of_Origin);
          }
          p_c_dict[d.Place]=temp_p_c;
        }
        else
        {
          var temp_p_c_1=[];
          temp_p_c_1.push(d.Companys_Country_of_Origin);
        	p_c_dict[d.Place]=temp_p_c_1;
        }
        
      });
      //console.log(p_c_dict);
      
      
      //console.log(my_dict);
      //console.log(place_dict);
      var place_dict_data = [];
      for (var key in place_dict) {
        place_dict_data.push(place_dict[key]);
      }
      //console.log(place_dict_data);
      place_dict_data.forEach((d) => {
        //console.log(d);
        d.my_place = d.my_place;
        d.my_long = +d.my_long;
        d.my_lat = +d.my_lat;
        d.my_count = d.my_count;
      });

      //console.log(s_f_dict);
      for (var key in s_f_dict) {
        //console.log(s_f_dict[key]);
        if (s_f_dict[key] != null) {
          var temp_new_val1 =
            s_f_dict[key].suc / (s_f_dict[key].suc + s_f_dict[key].fail);

          //console.log(temp_new_val1);
          
          if (key == 'USA') {
            s_f_dict['United States'] = temp_new_val1;
          } else if (key == 'England') {
            s_f_dict['United Kingdom'] = temp_new_val1;
          } else if (key == 'South Korea') {
            s_f_dict['Korea'] = temp_new_val1;
          } else if (key == 'North Korea') {
            s_f_dict['Dem. Rep. Korea'] = temp_new_val1;
          } else {
            s_f_dict[key] = temp_new_val1;
          }
        }
      }
      //console.log(s_f_dict);
      
      //console.log(p_s_dict);
      for (var key in p_s_dict) {
        //console.log(p_s_dict[key]);
        //ratio of private/state
        //console.log(p_s_dict[key]);

        if (p_s_dict[key] != null) {
          //console.log(p_s_dict[key]);
          //console.log(key);

          var temp_new_val =
            p_s_dict[key].S / (p_s_dict[key].P + p_s_dict[key].S);

          if (key == 'USA') {
            p_s_dict['United States'] = temp_new_val;
          } else if (key == 'England') {
            p_s_dict['United Kingdom'] = temp_new_val;
          } else if (key == 'South Korea') {
            p_s_dict['Korea'] = temp_new_val;
          } else if (key == 'North Korea') {
            p_s_dict['Dem. Rep. Korea'] = temp_new_val;
          } else {
            p_s_dict[key] = temp_new_val;
          }
        }
      }
      //console.log(p_s_dict);
      //console.log(csv_data);
      //console.log(place_dict_data);
      //console.log(s_f_dict);

      return { my_countries, place_dict_data, p_s_dict,s_f_dict,p_c_dict };
    });

  const projection = d3.geoNaturalEarth1();
  const path = d3.geoPath(projection);
  const graticule = d3.geoGraticule();

  const mapp = (selection, props) => {
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
      d3.zoom().on('zoom', () => {
        g.attr('transform', d3.event.transform);
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

    const sizeScale = d3.scaleLinear()
      .domain([0, d3.max(place_dict_data, sizeValue)])
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

    const my_arc1 = d3.arc(my_end)
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

    const my_arc3 = d3.arc(my_end1)
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

  const svg = d3.select('svg');
  const mappG = svg.append('g');

  var features;
  var selectedCountryId;
  var selectedCountryName;
  var p_s_dict = {};
  var place_dict_data = {};
  var s_f_dict={};
  var p_c_dict={};

  const onCountryClick = (id, c_name) => {
    selectedCountryId = id;
    selectedCountryName = c_name;
    //console.log(selectedCountryName);
    render();
  };

  useWorld().then((countries) => {
    //console.log(countries.csv_data);
    features = countries.my_countries.features;
    place_dict_data = countries.place_dict_data;
    //console.log(place_dict_data);
  	s_f_dict=countries.s_f_dict;
    //console.log(s_f_dict);
    p_s_dict = countries.p_s_dict;
    //console.log(p_s_dict);
    p_c_dict=countries.p_c_dict;

    //console.log(my_data[0]);

    render();
  });

  const render = () => {
    mappG.call(mapp, {
      features,
      selectedCountryId,
      selectedCountryName,
      onCountryClick,
      place_dict_data,
      p_s_dict,
      s_f_dict,
      p_c_dict
    });
  };

}(d3, topojson));

//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW5kZXguanMiLCJzb3VyY2VzIjpbInVzZVdvcmxkLmpzIiwibWFwcC5qcyIsImluZGV4LmpzIl0sInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IGpzb24sIHRzdiwgY3N2IH0gZnJvbSAnZDMnO1xuaW1wb3J0IHsgZmVhdHVyZSB9IGZyb20gJ3RvcG9qc29uJztcblxuZXhwb3J0IGNvbnN0IHVzZVdvcmxkID0gKCkgPT5cbiAgUHJvbWlzZS5hbGwoW1xuICAgIHRzdignaHR0cHM6Ly91bnBrZy5jb20vd29ybGQtYXRsYXNAMS4xLjQvd29ybGQvNTBtLnRzdicpLFxuICAgIGpzb24oJ2h0dHBzOi8vdW5wa2cuY29tL3dvcmxkLWF0bGFzQDIuMC4yL2NvdW50cmllcy01MG0uanNvbicpLFxuICAgIGNzdihcbiAgICAgICdodHRwczovL2dpc3QuZ2l0aHVidXNlcmNvbnRlbnQuY29tL1RheWxvclc0My8yNTkwOGU3ZmJlOWRlZjQzZDgyZDg3OWM3NzRlNTMxZC9yYXcvNDFjZmI2NjlmZjEzNzcwNmM0NjQ3NzI2OWMwYmQ5ZTRkNzJjZmUyYi9hZGRlZF9jb3IuY3N2J1xuICAgICksXG4gIF0pLnRoZW4oKFt0c3ZfZGF0YSwganNvbl9kYXRhLCBjc3ZfZGF0YV0pID0+IHtcbiAgICBjb25zdCBjb3VudHJ5TmFtZSA9IHRzdl9kYXRhLnJlZHVjZSgoYWNjdW11bGF0b3IsIGQpID0+IHtcbiAgICAgIGFjY3VtdWxhdG9yW2QuaXNvX24zXSA9IGQubmFtZTtcbiAgICAgIHJldHVybiBhY2N1bXVsYXRvcjtcbiAgICB9LCB7fSk7XG5cbiAgICAvL2NvbnNvbGUubG9nKGNvdW50cnlOYW1lKTtcblxuICAgIGNvbnN0IG15X2NvdW50cmllcyA9IGZlYXR1cmUoanNvbl9kYXRhLCBqc29uX2RhdGEub2JqZWN0cy5jb3VudHJpZXMpO1xuXG4gICAgbXlfY291bnRyaWVzLmZlYXR1cmVzLmZvckVhY2goKGQpID0+IHtcbiAgICAgIC8vY29uc29sZS5sb2coZC5pZCk7XG4gICAgICBkLmNfbmFtZSA9IGNvdW50cnlOYW1lW2QuaWRdO1xuICAgIH0pO1xuICAgIC8vY29uc29sZS5sb2cobXlfY291bnRyaWVzLmZlYXR1cmVzKTtcblxuICAgIC8vY29uc29sZS5sb2coY3N2X2RhdGFbMF0pO1xuXG4gICAgdmFyIG15X2RpY3QgPSB7fTtcbiAgICB2YXIgcGxhY2VfZGljdCA9IHt9O1xuICAgIHZhciBwX3NfZGljdCA9IHt9O1xuICAgIHZhciBzX2ZfZGljdCA9IHt9O1xuICAgIHZhciBwX2NfZGljdD17fTtcblxuICAgIGNzdl9kYXRhLmZvckVhY2goKGQpID0+IHtcbiAgICAgIC8vY29uc29sZS5sb2coZCk7XG4gICAgICAvL2QuTGF0aXR1ZGUgPSArZC5MYXRpdHVkZTtcbiAgICAgIC8vZC5Mb25naXR1ZGUgPSArZC5Mb25naXR1ZGU7XG4gICAgICAvL2QuQ291bnQgPSArZC5Db3VudDtcbiAgICAgIGlmIChkLkxvbmdpdHVkZSAhPSAnbnVsbCcgJiYgZC5MYXRpdHVkZSAhPSAnbnVsbCcpIHtcbiAgICAgICAgaWYgKGQuUGxhY2UgaW4gcGxhY2VfZGljdCkge1xuICAgICAgICAgIC8vY29uc29sZS5sb2cocGxhY2VfZGljdFtkLlBsYWNlXS5teV9jb3VudCk7XG4gICAgICAgICAgdmFyIG5ld19jb3VudCA9IHBsYWNlX2RpY3RbZC5QbGFjZV0ubXlfY291bnQgKyAxO1xuICAgICAgICAgIHBsYWNlX2RpY3RbZC5QbGFjZV0ubXlfY291bnQgPSBuZXdfY291bnQ7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgdmFyIHRlbXBfZGljID0ge307XG4gICAgICAgICAgdGVtcF9kaWNbJ215X3BsYWNlJ10gPSBkLlBsYWNlO1xuICAgICAgICAgIHRlbXBfZGljWydteV9sb25nJ10gPSBkLkxvbmdpdHVkZTtcbiAgICAgICAgICB0ZW1wX2RpY1snbXlfbGF0J10gPSBkLkxhdGl0dWRlO1xuICAgICAgICAgIHRlbXBfZGljWydteV9jb3VudCddID0gMTtcbiAgICAgICAgICBcbiAgICAgICAgICBwbGFjZV9kaWN0W2QuUGxhY2VdID0gdGVtcF9kaWM7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICAgIC8vY29uc29sZS5sb2cocGxhY2VfZGljdCk7XG5cbiAgICAgIGlmIChkLkNvbXBhbnlzX0NvdW50cnlfb2ZfT3JpZ2luIGluIHBfc19kaWN0KSB7XG4gICAgICAgIHZhciB0ZW1wX29yaSA9IHBfc19kaWN0W2QuQ29tcGFueXNfQ291bnRyeV9vZl9PcmlnaW5dO1xuICAgICAgICAvL2NvbnNvbGUubG9nKHRlbXBfb3JpKTtcblxuICAgICAgICBpZiAoZC5Qcml2YXRlX29yX1N0YXRlX1J1biA9PSAnUCcpIHtcbiAgICAgICAgICAvL2NvbnNvbGUubG9nKHBfc19kaWN0W2QuQ29tcGFueXNfQ291bnRyeV9vZl9PcmlnaW5dLlApO1xuICAgICAgICAgIHBfc19kaWN0W2QuQ29tcGFueXNfQ291bnRyeV9vZl9PcmlnaW5dLlAgKz0gMTtcbiAgICAgICAgfSBlbHNlIGlmIChkLlByaXZhdGVfb3JfU3RhdGVfUnVuID09ICdTJykge1xuICAgICAgICAgIHBfc19kaWN0W2QuQ29tcGFueXNfQ291bnRyeV9vZl9PcmlnaW5dLlMgKz0gMTtcbiAgICAgICAgfVxuICAgICAgfSBlbHNlIHtcbiAgICAgICAgaWYgKGQuUHJpdmF0ZV9vcl9TdGF0ZV9SdW4gPT0gJ1AnKSB7XG4gICAgICAgICAgdmFyIHRlbXAgPSB7IFA6IDEsIFM6IDAgfTtcbiAgICAgICAgfSBlbHNlIGlmIChkLlByaXZhdGVfb3JfU3RhdGVfUnVuID09ICdTJykge1xuICAgICAgICAgIHZhciB0ZW1wID0geyBQOiAwLCBTOiAxIH07XG4gICAgICAgIH1cbiAgICAgICAgcF9zX2RpY3RbZC5Db21wYW55c19Db3VudHJ5X29mX09yaWdpbl0gPSB0ZW1wO1xuICAgICAgfVxuXG4gICAgICBpZiAoZC5Db21wYW55c19Db3VudHJ5X29mX09yaWdpbiBpbiBzX2ZfZGljdCkge1xuICAgICAgICB2YXIgdGVtcF9vcmkyID0gc19mX2RpY3RbZC5Db21wYW55c19Db3VudHJ5X29mX09yaWdpbl07XG4gICAgICAgIC8vY29uc29sZS5sb2codGVtcF9vcmkpO1xuXG4gICAgICAgIGlmIChkLlN0YXR1c19NaXNzaW9uID09ICdTdWNjZXNzJykge1xuICAgICAgICAgIHNfZl9kaWN0W2QuQ29tcGFueXNfQ291bnRyeV9vZl9PcmlnaW5dLnN1YyArPSAxO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIHNfZl9kaWN0W2QuQ29tcGFueXNfQ291bnRyeV9vZl9PcmlnaW5dLmZhaWwgKz0gMTtcbiAgICAgICAgfVxuICAgICAgfSBlbHNlIHtcbiAgICAgICAgaWYgKGQuU3RhdHVzX01pc3Npb24gPT0gJ1N1Y2Nlc3MnKSB7XG4gICAgICAgICAgdmFyIHRlbXAgPSB7IHN1YzogMSwgZmFpbDogMCB9O1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIHZhciB0ZW1wID0geyBzdWM6IDAsIGZhaWw6IDEgfTtcbiAgICAgICAgfVxuICAgICAgICBzX2ZfZGljdFtkLkNvbXBhbnlzX0NvdW50cnlfb2ZfT3JpZ2luXSA9IHRlbXA7XG4gICAgICB9XG4gICAgICBcbiAgICAgIGlmKGQuUGxhY2UgaW4gcF9jX2RpY3QpXG4gICAgICB7XG4gICAgICBcdHZhciB0ZW1wX3BfYz1wX2NfZGljdFtkLlBsYWNlXTtcbiAgICAgICAgaWYodGVtcF9wX2MuaW5jbHVkZXMoZC5Db21wYW55c19Db3VudHJ5X29mX09yaWdpbikpXG4gICAgICAgIHtcbiAgICAgICAgXHQvL2RvIG5vdGhpbmdcbiAgICAgICAgfVxuICAgICAgICBlbHNlXG4gICAgICAgIHtcbiAgICAgICAgXHR0ZW1wX3BfYy5wdXNoKGQuQ29tcGFueXNfQ291bnRyeV9vZl9PcmlnaW4pO1xuICAgICAgICB9XG4gICAgICAgIHBfY19kaWN0W2QuUGxhY2VdPXRlbXBfcF9jO1xuICAgICAgfVxuICAgICAgZWxzZVxuICAgICAge1xuICAgICAgICB2YXIgdGVtcF9wX2NfMT1bXTtcbiAgICAgICAgdGVtcF9wX2NfMS5wdXNoKGQuQ29tcGFueXNfQ291bnRyeV9vZl9PcmlnaW4pO1xuICAgICAgXHRwX2NfZGljdFtkLlBsYWNlXT10ZW1wX3BfY18xO1xuICAgICAgfVxuICAgICAgXG4gICAgfSk7XG4gICAgLy9jb25zb2xlLmxvZyhwX2NfZGljdCk7XG4gICAgXG4gICAgXG4gICAgLy9jb25zb2xlLmxvZyhteV9kaWN0KTtcbiAgICAvL2NvbnNvbGUubG9nKHBsYWNlX2RpY3QpO1xuICAgIHZhciBwbGFjZV9kaWN0X2RhdGEgPSBbXTtcbiAgICBmb3IgKHZhciBrZXkgaW4gcGxhY2VfZGljdCkge1xuICAgICAgcGxhY2VfZGljdF9kYXRhLnB1c2gocGxhY2VfZGljdFtrZXldKTtcbiAgICB9XG4gICAgLy9jb25zb2xlLmxvZyhwbGFjZV9kaWN0X2RhdGEpO1xuICAgIHBsYWNlX2RpY3RfZGF0YS5mb3JFYWNoKChkKSA9PiB7XG4gICAgICAvL2NvbnNvbGUubG9nKGQpO1xuICAgICAgZC5teV9wbGFjZSA9IGQubXlfcGxhY2U7XG4gICAgICBkLm15X2xvbmcgPSArZC5teV9sb25nO1xuICAgICAgZC5teV9sYXQgPSArZC5teV9sYXQ7XG4gICAgICBkLm15X2NvdW50ID0gZC5teV9jb3VudDtcbiAgICB9KTtcblxuICAgIC8vY29uc29sZS5sb2coc19mX2RpY3QpO1xuICAgIGZvciAodmFyIGtleSBpbiBzX2ZfZGljdCkge1xuICAgICAgLy9jb25zb2xlLmxvZyhzX2ZfZGljdFtrZXldKTtcbiAgICAgIGlmIChzX2ZfZGljdFtrZXldICE9IG51bGwpIHtcbiAgICAgICAgdmFyIHRlbXBfbmV3X3ZhbDEgPVxuICAgICAgICAgIHNfZl9kaWN0W2tleV0uc3VjIC8gKHNfZl9kaWN0W2tleV0uc3VjICsgc19mX2RpY3Rba2V5XS5mYWlsKTtcblxuICAgICAgICAvL2NvbnNvbGUubG9nKHRlbXBfbmV3X3ZhbDEpO1xuICAgICAgICBcbiAgICAgICAgaWYgKGtleSA9PSAnVVNBJykge1xuICAgICAgICAgIHNfZl9kaWN0WydVbml0ZWQgU3RhdGVzJ10gPSB0ZW1wX25ld192YWwxO1xuICAgICAgICB9IGVsc2UgaWYgKGtleSA9PSAnRW5nbGFuZCcpIHtcbiAgICAgICAgICBzX2ZfZGljdFsnVW5pdGVkIEtpbmdkb20nXSA9IHRlbXBfbmV3X3ZhbDE7XG4gICAgICAgIH0gZWxzZSBpZiAoa2V5ID09ICdTb3V0aCBLb3JlYScpIHtcbiAgICAgICAgICBzX2ZfZGljdFsnS29yZWEnXSA9IHRlbXBfbmV3X3ZhbDE7XG4gICAgICAgIH0gZWxzZSBpZiAoa2V5ID09ICdOb3J0aCBLb3JlYScpIHtcbiAgICAgICAgICBzX2ZfZGljdFsnRGVtLiBSZXAuIEtvcmVhJ10gPSB0ZW1wX25ld192YWwxO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIHNfZl9kaWN0W2tleV0gPSB0ZW1wX25ld192YWwxO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgfVxuICAgIC8vY29uc29sZS5sb2coc19mX2RpY3QpO1xuICAgIFxuICAgIC8vY29uc29sZS5sb2cocF9zX2RpY3QpO1xuICAgIGZvciAodmFyIGtleSBpbiBwX3NfZGljdCkge1xuICAgICAgLy9jb25zb2xlLmxvZyhwX3NfZGljdFtrZXldKTtcbiAgICAgIC8vcmF0aW8gb2YgcHJpdmF0ZS9zdGF0ZVxuICAgICAgLy9jb25zb2xlLmxvZyhwX3NfZGljdFtrZXldKTtcblxuICAgICAgaWYgKHBfc19kaWN0W2tleV0gIT0gbnVsbCkge1xuICAgICAgICAvL2NvbnNvbGUubG9nKHBfc19kaWN0W2tleV0pO1xuICAgICAgICAvL2NvbnNvbGUubG9nKGtleSk7XG5cbiAgICAgICAgdmFyIHRlbXBfbmV3X3ZhbCA9XG4gICAgICAgICAgcF9zX2RpY3Rba2V5XS5TIC8gKHBfc19kaWN0W2tleV0uUCArIHBfc19kaWN0W2tleV0uUyk7XG5cbiAgICAgICAgaWYgKGtleSA9PSAnVVNBJykge1xuICAgICAgICAgIHBfc19kaWN0WydVbml0ZWQgU3RhdGVzJ10gPSB0ZW1wX25ld192YWw7XG4gICAgICAgIH0gZWxzZSBpZiAoa2V5ID09ICdFbmdsYW5kJykge1xuICAgICAgICAgIHBfc19kaWN0WydVbml0ZWQgS2luZ2RvbSddID0gdGVtcF9uZXdfdmFsO1xuICAgICAgICB9IGVsc2UgaWYgKGtleSA9PSAnU291dGggS29yZWEnKSB7XG4gICAgICAgICAgcF9zX2RpY3RbJ0tvcmVhJ10gPSB0ZW1wX25ld192YWw7XG4gICAgICAgIH0gZWxzZSBpZiAoa2V5ID09ICdOb3J0aCBLb3JlYScpIHtcbiAgICAgICAgICBwX3NfZGljdFsnRGVtLiBSZXAuIEtvcmVhJ10gPSB0ZW1wX25ld192YWw7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgcF9zX2RpY3Rba2V5XSA9IHRlbXBfbmV3X3ZhbDtcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH1cbiAgICAvL2NvbnNvbGUubG9nKHBfc19kaWN0KTtcbiAgICAvL2NvbnNvbGUubG9nKGNzdl9kYXRhKTtcbiAgICAvL2NvbnNvbGUubG9nKHBsYWNlX2RpY3RfZGF0YSk7XG4gICAgLy9jb25zb2xlLmxvZyhzX2ZfZGljdCk7XG5cbiAgICByZXR1cm4geyBteV9jb3VudHJpZXMsIHBsYWNlX2RpY3RfZGF0YSwgcF9zX2RpY3Qsc19mX2RpY3QscF9jX2RpY3QgfTtcbiAgfSk7XG4iLCJpbXBvcnQge1xuICBzY2FsZUxpbmVhcixcbiAgc2NhbGVTcXJ0LFxuICBtYXgsXG4gIHpvb20sXG4gIGV2ZW50LFxuICBzZWxlY3QsXG4gIGdlb05hdHVyYWxFYXJ0aDEsXG4gIGdlb1BhdGgsXG4gIGdlb0dyYXRpY3VsZSxcbiAgbWFwLFxuICBhcmMsXG59IGZyb20gJ2QzJztcblxuY29uc3QgcHJvamVjdGlvbiA9IGdlb05hdHVyYWxFYXJ0aDEoKTtcbmNvbnN0IHBhdGggPSBnZW9QYXRoKHByb2plY3Rpb24pO1xuY29uc3QgZ3JhdGljdWxlID0gZ2VvR3JhdGljdWxlKCk7XG5cbmV4cG9ydCBjb25zdCBtYXBwID0gKHNlbGVjdGlvbiwgcHJvcHMpID0+IHtcbiAgY29uc3Qge1xuICAgIGZlYXR1cmVzLFxuICAgIHNlbGVjdGVkQ291bnRyeUlkLFxuICAgIHNlbGVjdGVkQ291bnRyeU5hbWUsXG4gICAgb25Db3VudHJ5Q2xpY2ssXG4gICAgcGxhY2VfZGljdF9kYXRhLFxuICAgIHBfc19kaWN0LFxuICAgIHNfZl9kaWN0LFxuICAgIHBfY19kaWN0LFxuICB9ID0gcHJvcHM7XG5cbiAgY29uc3QgZ1VwZGF0ZSA9IHNlbGVjdGlvbi5zZWxlY3RBbGwoJ2cnKS5kYXRhKFtudWxsXSk7XG4gIGNvbnN0IGdFbnRlciA9IGdVcGRhdGUuZW50ZXIoKS5hcHBlbmQoJ2cnKTtcbiAgY29uc3QgZyA9IGdVcGRhdGUubWVyZ2UoZ0VudGVyKTtcblxuICBnRW50ZXJcbiAgICAuYXBwZW5kKCdwYXRoJylcbiAgICAuYXR0cignY2xhc3MnLCAnc3BoZXJlJylcbiAgICAuYXR0cignZCcsIHBhdGgoeyB0eXBlOiAnU3BoZXJlJyB9KSlcbiAgICAubWVyZ2UoZ1VwZGF0ZS5zZWxlY3QoJy5zcGhlcmUnKSlcbiAgICAuYXR0cignb3BhY2l0eScsIHNlbGVjdGVkQ291bnRyeUlkID8gMC4wMyA6IDAuMyk7XG5cbiAgZ0VudGVyXG4gICAgLmFwcGVuZCgncGF0aCcpXG4gICAgLmF0dHIoJ2NsYXNzJywgJ2dyYXRpY3VsZXMnKVxuICAgIC5hdHRyKCdkJywgcGF0aChncmF0aWN1bGUoKSkpO1xuXG4gIHNlbGVjdGlvbi5jYWxsKFxuICAgIHpvb20oKS5vbignem9vbScsICgpID0+IHtcbiAgICAgIGcuYXR0cigndHJhbnNmb3JtJywgZXZlbnQudHJhbnNmb3JtKTtcbiAgICB9KVxuICApO1xuXG4gIGNvbnN0IGNvdW50cnlQYXRocyA9IGcuc2VsZWN0QWxsKCcuY291bnRyeScpLmRhdGEoZmVhdHVyZXMpO1xuICBjb25zdCBjb3VudHJ5UGF0aHNFbnRlciA9IGNvdW50cnlQYXRoc1xuICAgIC5lbnRlcigpXG4gICAgLmFwcGVuZCgncGF0aCcpXG4gICAgLmF0dHIoJ2NsYXNzJywgJ2NvdW50cnknKTtcbiAgY291bnRyeVBhdGhzXG4gICAgLm1lcmdlKGNvdW50cnlQYXRoc0VudGVyKVxuICAgIC5hdHRyKCdkJywgcGF0aClcbiAgICAuYXR0cignZmlsbCcsICcjMDA5OTAwJylcbiAgICAuYXR0cignb3BhY2l0eScsIChkKSA9PlxuICAgICAgIXNlbGVjdGVkQ291bnRyeUlkIHx8IHNlbGVjdGVkQ291bnRyeUlkID09PSBkLmlkID8gMC4yIDogMC4wMlxuICAgIClcbiAgICAub24oJ2NsaWNrJywgKGQpID0+IHtcbiAgICAgIGlmIChzZWxlY3RlZENvdW50cnlJZCAmJiBzZWxlY3RlZENvdW50cnlJZCA9PT0gZC5pZCkge1xuICAgICAgICBvbkNvdW50cnlDbGljayhudWxsKTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIG9uQ291bnRyeUNsaWNrKGQuaWQsIGQuY19uYW1lKTtcbiAgICAgIH1cbiAgICB9KVxuICAgIC5hcHBlbmQoJ3RpdGxlJylcbiAgICAudGV4dCgoZCkgPT4gZC5jX25hbWUpO1xuXG4gIC8vY29uc29sZS5sb2cocGxhY2VfZGljdF9kYXRhWzBdKTtcbiAgY29uc3Qgc2l6ZVZhbHVlID0gKGQpID0+IGQubXlfY291bnQ7XG5cbiAgY29uc3QgdG9vbHRpcFZhbHVlID0gKGQpID0+IHtcbiAgICAvKlxuICAgIHZhciB0ZW1wX2FyciA9IFtdO1xuICAgIHRlbXBfYXJyLnB1c2goJ051bWJlciBvZiBMYXVuY2hlczogJyk7XG4gICAgdGVtcF9hcnIucHVzaChkLm15X3BsYWNlKTtcbiAgICB0ZW1wX2Fyci5wdXNoKCdcXG5Mb2NhdGlvbjogJyk7XG4gICAgdGVtcF9hcnIucHVzaChkLm15X2NvdW50KTtcbiAgICAvL3RlbXBfYXJyLnB1c2goJ1xcbkNvdW50cnkgb2YgbGF1bmNoOicpO1xuICAgIC8vdGVtcF9hcnIucHVzaChkLkNvdW50cnlfb2ZfTGF1bmNoKTtcbiovXG4gICAgdmFyIHRlbXBfcF9jID0gW107XG4gICAgaWYgKGQubXlfcGxhY2UgaW4gcF9jX2RpY3QpIHtcbiAgICAgIHRlbXBfcF9jID0gcF9jX2RpY3RbZC5teV9wbGFjZV07XG4gICAgfVxuXG4gICAgcmV0dXJuIChcbiAgICAgICdOdW1iZXIgb2YgTGF1bmNoZXM6ICcgK1xuICAgICAgZC5teV9jb3VudCArXG4gICAgICAnXFxuTG9jYXRpb246ICcgK1xuICAgICAgZC5teV9wbGFjZSArXG4gICAgICAnXFxuTGF1bmNoIENvdW50cnk6ICcgK1xuICAgICAgdGVtcF9wX2NcbiAgICApO1xuICB9O1xuXG4gIGNvbnN0IG1pbkxlbmd0aCA9IDI7XG4gIGNvbnN0IG1heExlbmd0aCA9IDQzO1xuXG4gIGNvbnN0IHNpemVTY2FsZSA9IHNjYWxlTGluZWFyKClcbiAgICAuZG9tYWluKFswLCBtYXgocGxhY2VfZGljdF9kYXRhLCBzaXplVmFsdWUpXSlcbiAgICAucmFuZ2UoW21pbkxlbmd0aCwgbWF4TGVuZ3RoXSk7XG5cbiAgcGxhY2VfZGljdF9kYXRhLmZvckVhY2goKGQpID0+IHtcbiAgICBkLnByb2plY3RfbG9uX2xhdCA9IHByb2plY3Rpb24oW2QubXlfbG9uZywgZC5teV9sYXRdKTtcbiAgICAvL2NvbnNvbGUubG9nKGQucHJvamVjdF9sb25fbGF0KTtcbiAgfSk7XG5cbiAgcGxhY2VfZGljdF9kYXRhLmZvckVhY2goKGQpID0+IHtcbiAgICB2YXIgeDEgPSBkLnByb2plY3RfbG9uX2xhdFswXTtcbiAgICB2YXIgeTEgPSBkLnByb2plY3RfbG9uX2xhdFsxXTtcbiAgICBjb25zdCBzX3dpZHRoID0gNjtcbiAgICBjb25zdCBzX2hlaWdodCA9IHNpemVTY2FsZShzaXplVmFsdWUoZCkpO1xuICAgIHZhciB4MiA9IHgxIC0gc193aWR0aCAvIDI7XG4gICAgdmFyIHkyID0geTEgLSBzX2hlaWdodDtcbiAgICB2YXIgeDMgPSB4MSArIHNfd2lkdGggLyAyO1xuICAgIHZhciB5MyA9IHkxIC0gc19oZWlnaHQ7XG5cbiAgICB2YXIgcG9seSA9IFtcbiAgICAgIHsgeDogeDEsIHk6IHkxIH0sXG4gICAgICB7IHg6IHgyLCB5OiB5MiB9LFxuICAgICAgeyB4OiB4MywgeTogeTMgfSxcbiAgICBdO1xuXG4gICAgZC5teV9wb2x5X3BvaW50cyA9IHBvbHk7XG5cbiAgICAvL2NvbnNvbGUubG9nKGQubXlfcG9seV9wb2ludHNbMF0pO1xuICB9KTtcblxuICAvL215X2RhdGEuZm9yRWFjaCgoZCk9Pntjb25zb2xlLmxvZyhkLkNvdW50cnlfb2ZfTGF1bmNoKTt9KTtcblxuICAvL2NvbnNvbGUubG9nKG15X2RhdGFbMF0pO1xuICAvL2NvbnNvbGUubG9nKHNlbGVjdGVkQ291bnRyeU5hbWUpO1xuICAvL2NvbnNvbGUubG9nKHNlbGVjdGVkQ291bnRyeUlkKTtcblxuICBjb25zdCBteV9wb2x5Z29uID0gZy5zZWxlY3RBbGwoJy5wb2x5Z29uJykuZGF0YShwbGFjZV9kaWN0X2RhdGEpO1xuICBjb25zdCBteV9wb2x5Z29uRW50ZXIgPSBteV9wb2x5Z29uXG4gICAgLmVudGVyKClcbiAgICAuYXBwZW5kKCdwb2x5Z29uJylcbiAgICAuYXR0cignY2xhc3MnLCAncG9seWdvbicpO1xuICBteV9wb2x5Z29uXG4gICAgLm1lcmdlKG15X3BvbHlnb25FbnRlcilcbiAgICAuYXR0cignZCcsIHBhdGgpXG4gICAgLmF0dHIoJ3BvaW50cycsIGZ1bmN0aW9uIChkKSB7XG4gICAgICBpZiAoZC5teV9wb2x5X3BvaW50cyAhPSAnbnVsbCcpIHtcbiAgICAgICAgdmFyIGQxID0gZC5teV9wb2x5X3BvaW50cztcbiAgICAgICAgcmV0dXJuIGQxXG4gICAgICAgICAgLm1hcChmdW5jdGlvbiAoZDEpIHtcbiAgICAgICAgICAgIHJldHVybiBbZDEueCwgZDEueV07XG4gICAgICAgICAgfSlcbiAgICAgICAgICAuam9pbignICcpO1xuICAgICAgfVxuICAgIH0pXG4gICAgLmF0dHIoJ2ZpbGwnLCAnZ3JlZW4nKVxuICAgIC5hdHRyKCdmaWxsLW9wYWNpdHknLCAoZCkgPT4ge1xuICAgICAgaWYgKCFzZWxlY3RlZENvdW50cnlJZCB8fCBzZWxlY3RlZENvdW50cnlJZCA9PT0gJ251bGwnKSB7XG4gICAgICAgIC8vIHx8IHNlbGVjdGVkQ291bnRyeU5hbWU9PT1kLkNvdW50cnlfb2ZfTGF1bmNoKSB7XG4gICAgICAgIHJldHVybiAxO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgcmV0dXJuIDA7XG4gICAgICB9XG4gICAgfSlcbiAgICAuYXBwZW5kKCd0aXRsZScpXG4gICAgLnRleHQoKGQpID0+IFt0b29sdGlwVmFsdWUoZCldKTtcblxuICBjb25zdCBhcmMxID0gZy5zZWxlY3RBbGwoJy5hcmMnKS5kYXRhKHBsYWNlX2RpY3RfZGF0YSk7XG4gIGNvbnN0IGFyYzFFbnRlciA9IGFyYzEuZW50ZXIoKS5hcHBlbmQoJ3BhdGgnKS5hdHRyKCdjbGFzcycsICdhcmMnKTtcblxuICB2YXIgbXlfZW5kX3ZhbCA9IHBfc19kaWN0W3NlbGVjdGVkQ291bnRyeU5hbWVdO1xuICB2YXIgbXlfZW5kID0gTWF0aC5QSSAqIDIgKiBteV9lbmRfdmFsO1xuXG4gIGNvbnN0IG15X2FyYzEgPSBhcmMobXlfZW5kKVxuICAgIC5pbm5lclJhZGl1cyg0MClcbiAgICAub3V0ZXJSYWRpdXMoNjApXG4gICAgLnN0YXJ0QW5nbGUoMClcbiAgICAuZW5kQW5nbGUobXlfZW5kKTtcblxuICBhcmMxXG4gICAgLm1lcmdlKGFyYzFFbnRlcilcbiAgICAuYXR0cigndHJhbnNmb3JtJywgJ3RyYW5zbGF0ZSg0OTUsMzIwKScpXG4gICAgLmF0dHIoJ2NsYXNzJywgJ2FyYycpXG4gICAgLy8uYXR0cignZCcsJ000NDUgMzIwIGE0MCA0MCAwIDAgMSAwIDgwIGE0MCA0MCAwIDAgMSAwIC04MCcpXG4gICAgLmF0dHIoJ2QnLCBteV9hcmMxKVxuICAgIC5hdHRyKCdmaWxsJywgJyNCQjIwMjAnKVxuICAgIC5hdHRyKCdmaWxsLW9wYWNpdHknLCAoZCkgPT4ge1xuICAgICAgaWYgKCFzZWxlY3RlZENvdW50cnlJZCB8fCBzZWxlY3RlZENvdW50cnlJZCA9PT0gJ251bGwnKSB7XG4gICAgICAgIHJldHVybiAwO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgcmV0dXJuIDE7XG4gICAgICB9XG4gICAgfSk7XG5cbiAgdmFyIG15X2VuZF92YWwxID0gc19mX2RpY3Rbc2VsZWN0ZWRDb3VudHJ5TmFtZV07XG4gIHZhciBteV9lbmQxID0gTWF0aC5QSSAqIDIgKiBteV9lbmRfdmFsMTtcblxuICAvL2NvbnNvbGUubG9nKHNfZl9kaWN0W3NlbGVjdGVkQ291bnRyeU5hbWVdKTtcblxuICBjb25zdCBteV9hcmMzID0gYXJjKG15X2VuZDEpXG4gICAgLmlubmVyUmFkaXVzKDQwKVxuICAgIC5vdXRlclJhZGl1cyg2MClcbiAgICAuc3RhcnRBbmdsZSgwKVxuICAgIC5lbmRBbmdsZShteV9lbmQxKTtcblxuICAvL2NvbnNvbGUubG9nKG15X2VuZDEpO1xuXG4gIGNvbnN0IGFyYzMgPSBzZWxlY3Rpb24uc2VsZWN0QWxsKCdnJykuZGF0YShbbnVsbF0pO1xuICBjb25zdCBhcmMzRW50ZXIgPSBhcmMzLmVudGVyKCkuYXBwZW5kKCdnJyk7XG5cbiAgZ0VudGVyXG4gICAgLmFwcGVuZCgncGF0aCcpXG4gICAgLmF0dHIoJ2NsYXNzJywgJ2FyYycpXG4gICAgLm1lcmdlKGFyYzMuc2VsZWN0KCcuYXJjJykpXG4gICAgLmF0dHIoJ3RyYW5zZm9ybScsICd0cmFuc2xhdGUoNjk1LDMyMCknKVxuICAgIC5hdHRyKCdkJywgbXlfYXJjMylcbiAgICAuYXR0cignZmlsbCcsICdncmVlbicpO1xuXG4gIGNvbnN0IGFfdGV4dCA9IHNlbGVjdGlvbi5zZWxlY3RBbGwoJ2cnKS5kYXRhKFtudWxsXSk7XG4gIGNvbnN0IGFfdGV4dEVudGVyID0gYV90ZXh0LmVudGVyKCkuYXBwZW5kKCdnJyk7XG5cbiAgLy9jb25zb2xlLmxvZyhzZWxlY3RlZENvdW50cnlJZCk7XG4gIC8vYV90ZXh0RW50ZXJcbiAgZ0VudGVyXG4gICAgLmFwcGVuZCgndGV4dCcpXG4gICAgLmF0dHIoJ2NsYXNzJywgJ3RleHQnKVxuICAgIC5tZXJnZShhX3RleHQuc2VsZWN0QWxsKCcudGV4dCcpKVxuICAgIC5hdHRyKCd0cmFuc2Zvcm0nLCAndHJhbnNsYXRlKDU5NSwyNTApJylcbiAgICAvLy5hdHRyKCd0cmFuc2Zvcm0nLCAndHJhbnNsYXRlKDM5MywyNTApJylcbiAgICAvLy5hdHRyKCdkeCcsICczMTAnKVxuICAgIC8vLmF0dHIoJ2R5JywgJzIwMCcpXG4gICAgLmF0dHIoJ2ZpbGwnLCAnZ3JlZW4nKVxuICAgIC5hdHRyKCd0ZXh0LWFuY2hvcicsICdtaWRkbGUnKVxuICAgIC50ZXh0KChkKSA9PiB7XG4gICAgICBpZiAoIXNlbGVjdGVkQ291bnRyeUlkIHx8IHNlbGVjdGVkQ291bnRyeUlkID09PSAnbnVsbCcpIHtcbiAgICAgICAgcmV0dXJuICcnO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgaWYgKHNlbGVjdGVkQ291bnRyeU5hbWUgaW4gcF9zX2RpY3QpIHtcbiAgICAgICAgICBpZiAoc2VsZWN0ZWRDb3VudHJ5TmFtZSA9PT0gJ0tvcmVhJykge1xuICAgICAgICAgICAgcmV0dXJuIChcbiAgICAgICAgICAgICAgJ1NvdXRoIEtvcmVhOiAnICtcbiAgICAgICAgICAgICAgJ1N0YXRlIExhdW5jaCBSYXRlOiAnICtcbiAgICAgICAgICAgICAgKG15X2VuZF92YWwgKiAxMDApLnRvRml4ZWQoMikgK1xuICAgICAgICAgICAgICAnJScgK1xuICAgICAgICAgICAgICAnIFN1Y2Nlc3MgUmF0ZTonICtcbiAgICAgICAgICAgICAgKG15X2VuZF92YWwxICogMTAwKS50b0ZpeGVkKDIpICtcbiAgICAgICAgICAgICAgJyUnXG4gICAgICAgICAgICApO1xuICAgICAgICAgIH0gZWxzZSBpZiAoc2VsZWN0ZWRDb3VudHJ5TmFtZSA9PT0gJ0RlbS4gUmVwLiBLb3JlYScpIHtcbiAgICAgICAgICAgIHJldHVybiAoXG4gICAgICAgICAgICAgICdOb3J0aCBLb3JlYTogJyArXG4gICAgICAgICAgICAgICdTdGF0ZSBMYXVuY2ggUmF0ZTogJyArXG4gICAgICAgICAgICAgIChteV9lbmRfdmFsICogMTAwKS50b0ZpeGVkKDIpICtcbiAgICAgICAgICAgICAgJyUnICtcbiAgICAgICAgICAgICAgJyBTdWNjZXNzIFJhdGU6JyArXG4gICAgICAgICAgICAgIChteV9lbmRfdmFsMSAqIDEwMCkudG9GaXhlZCgyKSArXG4gICAgICAgICAgICAgICclJ1xuICAgICAgICAgICAgKTtcbiAgICAgICAgICB9IGVsc2VcbiAgICAgICAgICAgIHJldHVybiAoXG4gICAgICAgICAgICAgIHNlbGVjdGVkQ291bnRyeU5hbWUgK1xuICAgICAgICAgICAgICAnOiBTdGF0ZSBMYXVuY2ggUmF0ZTogJyArXG4gICAgICAgICAgICAgIChteV9lbmRfdmFsICogMTAwKS50b0ZpeGVkKDIpICtcbiAgICAgICAgICAgICAgJyUnICtcbiAgICAgICAgICAgICAgJyBTdWNjZXNzIFJhdGU6JyArXG4gICAgICAgICAgICAgIChteV9lbmRfdmFsMSAqIDEwMCkudG9GaXhlZCgyKSArXG4gICAgICAgICAgICAgICclJ1xuICAgICAgICAgICAgKTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICByZXR1cm4gc2VsZWN0ZWRDb3VudHJ5TmFtZSArICc6ICcgKyAnTm8gRGF0YSc7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9KTtcblxufTtcbiIsImltcG9ydCB7IHNlbGVjdCB9IGZyb20gJ2QzJztcbmltcG9ydCB7IHVzZVdvcmxkIH0gZnJvbSAnLi91c2VXb3JsZCc7XG5pbXBvcnQgeyBtYXBwIH0gZnJvbSAnLi9tYXBwJztcblxuY29uc3Qgc3ZnID0gc2VsZWN0KCdzdmcnKTtcbmNvbnN0IG1hcHBHID0gc3ZnLmFwcGVuZCgnZycpO1xuXG52YXIgZmVhdHVyZXM7XG52YXIgc2VsZWN0ZWRDb3VudHJ5SWQ7XG52YXIgc2VsZWN0ZWRDb3VudHJ5TmFtZTtcbnZhciBwX3NfZGljdCA9IHt9O1xudmFyIHBsYWNlX2RpY3RfZGF0YSA9IHt9O1xudmFyIHNfZl9kaWN0PXt9O1xudmFyIHBfY19kaWN0PXt9O1xuXG5jb25zdCBvbkNvdW50cnlDbGljayA9IChpZCwgY19uYW1lKSA9PiB7XG4gIHNlbGVjdGVkQ291bnRyeUlkID0gaWQ7XG4gIHNlbGVjdGVkQ291bnRyeU5hbWUgPSBjX25hbWU7XG4gIC8vY29uc29sZS5sb2coc2VsZWN0ZWRDb3VudHJ5TmFtZSk7XG4gIHJlbmRlcigpO1xufTtcblxudXNlV29ybGQoKS50aGVuKChjb3VudHJpZXMpID0+IHtcbiAgLy9jb25zb2xlLmxvZyhjb3VudHJpZXMuY3N2X2RhdGEpO1xuICBmZWF0dXJlcyA9IGNvdW50cmllcy5teV9jb3VudHJpZXMuZmVhdHVyZXM7XG4gIHBsYWNlX2RpY3RfZGF0YSA9IGNvdW50cmllcy5wbGFjZV9kaWN0X2RhdGE7XG4gIC8vY29uc29sZS5sb2cocGxhY2VfZGljdF9kYXRhKTtcblx0c19mX2RpY3Q9Y291bnRyaWVzLnNfZl9kaWN0O1xuICAvL2NvbnNvbGUubG9nKHNfZl9kaWN0KTtcbiAgcF9zX2RpY3QgPSBjb3VudHJpZXMucF9zX2RpY3Q7XG4gIC8vY29uc29sZS5sb2cocF9zX2RpY3QpO1xuICBwX2NfZGljdD1jb3VudHJpZXMucF9jX2RpY3Q7XG5cbiAgLy9jb25zb2xlLmxvZyhteV9kYXRhWzBdKTtcblxuICByZW5kZXIoKTtcbn0pO1xuXG5jb25zdCByZW5kZXIgPSAoKSA9PiB7XG4gIG1hcHBHLmNhbGwobWFwcCwge1xuICAgIGZlYXR1cmVzLFxuICAgIHNlbGVjdGVkQ291bnRyeUlkLFxuICAgIHNlbGVjdGVkQ291bnRyeU5hbWUsXG4gICAgb25Db3VudHJ5Q2xpY2ssXG4gICAgcGxhY2VfZGljdF9kYXRhLFxuICAgIHBfc19kaWN0LFxuICAgIHNfZl9kaWN0LFxuICAgIHBfY19kaWN0XG4gIH0pO1xufTtcbiJdLCJuYW1lcyI6WyJ0c3YiLCJqc29uIiwiY3N2IiwiZmVhdHVyZSIsImdlb05hdHVyYWxFYXJ0aDEiLCJnZW9QYXRoIiwiZ2VvR3JhdGljdWxlIiwiem9vbSIsImV2ZW50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