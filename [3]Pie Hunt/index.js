import { select } from 'd3';
import { useWorld } from './useWorld';
import { mapp } from './mapp';

const svg = select('svg');
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
