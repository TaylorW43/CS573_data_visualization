import { useState, useEffect } from 'react';
import { csv } from 'd3';

const csvUrl =
  'https://gist.githubusercontent.com/TaylorW43/25908e7fbe9def43d82d879c774e531d/raw/a1fa5da0dbedd7bfb653d0e75da660ea0db93830/clean.csv';

//const start_year = 1957;
//const end_year = 2020;
//const num_years = end_year - start_year;

//var sum_by_year = new Array(num_years).fill(0);

//console.log(num_years);
//console.log(sum_by_year);

export const useData = () => {
  const [data, setData] = useState(null);

  useEffect(() => {
    const row = (d) => {
      /*test
      if(d.Year==='1957')
      {
      	//console.log('true');
      }
      */
      /*
      var count=0;
      for(var i=0;i<num_years;i++)
      {
        //console.log(i);
      	if(d.Year==(i+1957))
        {
          count+=1;
        	console.log(count);
          
        }
      }
      */

      d.Year = +d.Year;
      d.Month = +d.Month;

      //console.log(d.Year);
      //console.log(d['Year']);

      /*
      d.test =+d.Year;
      console.log(d.test);
      */
      
 			
      if(d.Year>='1957' && d.Year<='1970')
      {
      	d.first_group=+d.Year;
      }
      
      if(d.Year>='1970' && d.Year<='1983')
      {
      	d.second_group=+d.Year;
      }
      
      if(d.Year>='1983' && d.Year<='1996')
      {
      	d.third_group=+d.Year;
      }
      
      if(d.Year>='1996' && d.Year<='2009')
      {
      	d.fourth_group=+d.Year;
      }
      
      if(d.Year>='2009' && d.Year<='2020')
      {
      	d.fifth_group=+d.Year;
      }
      
      //console.log(d.Year);
      //console.log(d.first_group);
      //console.log(d.second_group);
      //console.log(d.third_group);
      //console.log(d.fourth_group);
      //console.log(d.fifth_group);
      
      return d;
    };
    csv(csvUrl, row).then(setData);
  }, []);
  

  //console.log(data);
  return data;
};
