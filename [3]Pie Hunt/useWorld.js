import { json, tsv, csv } from 'd3';
import { feature } from 'topojson';

export const useWorld = () =>
  Promise.all([
    tsv('https://unpkg.com/world-atlas@1.1.4/world/50m.tsv'),
    json('https://unpkg.com/world-atlas@2.0.2/countries-50m.json'),
    csv(
      'https://gist.githubusercontent.com/TaylorW43/25908e7fbe9def43d82d879c774e531d/raw/41cfb669ff137706c46477269c0bd9e4d72cfe2b/added_cor.csv'
    ),
  ]).then(([tsv_data, json_data, csv_data]) => {
    const countryName = tsv_data.reduce((accumulator, d) => {
      accumulator[d.iso_n3] = d.name;
      return accumulator;
    }, {});

    //console.log(countryName);

    const my_countries = feature(json_data, json_data.objects.countries);

    my_countries.features.forEach((d) => {
      //console.log(d.id);
      d.c_name = countryName[d.id];
    });
    //console.log(my_countries.features);

    //console.log(csv_data[0]);

    var my_dict = {};
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
        {
        	//do nothing
        }
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
