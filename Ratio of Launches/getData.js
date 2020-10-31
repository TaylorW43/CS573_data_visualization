import { csv } from 'd3';

const csvUrl = 'https://gist.githubusercontent.com/TaylorW43/25908e7fbe9def43d82d879c774e531d/raw/6c9f5397be2e24ffc57e126a0036504948b9aa53/clean.csv'
      
const cal_csv = 'https://gist.githubusercontent.com/TaylorW43/25908e7fbe9def43d82d879c774e531d/raw/a1fa5da0dbedd7bfb653d0e75da660ea0db93830/calculate.csv'

//var final_p={};

export const getData = async () => {
  const data = await csv(csvUrl);
  
  //const data2= await csv(cal_csv);
  
  // Have a look at the attributes available in the console!
  console.log(data[0]);
  //console.log(data[0].Company_Name);
  /*
  //group by company country of origin then by P or S
  var origin_group=d3.nest()
  	.key(function(d){return d.Private_or_State_Run;})
  	.key(function(d){return d.Companys_Country_of_Origin;})
  	.entries(data2);
  //console.log(JSON.stringify(origin_group));
  //end group
  */
  
  //console.log(Object.values(origin_group[0])[1]); 
  /*
  var temp=Object.values(origin_group[0])[1];
  
  //console.log(temp);
  
  
  for(var i=0;i<temp.length;i++)
  {
    var temp_country=Object.values(temp[i])[0];
    var temp_private=Object.values(temp[i])[1];
    
    final_p[temp_country]=temp_private.length;
  }
  //console.log(final_p);
  //console.log(Object.keys(final_p));
  //console.log(Object.values(final_p));
               
  
  //return value
  var return_array=[];
  return_array.push(data,final_p);
  console.log(return_array);
  //console.log(return_array[1]);
  console.log(Object.keys(return_array[1]));
  */

  return data;
  //return return_array;
};