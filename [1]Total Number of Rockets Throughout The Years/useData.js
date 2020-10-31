import { useState, useEffect } from 'react';
import { csv } from 'd3';

const csvUrl =
  'https://gist.githubusercontent.com/TaylorW43/25908e7fbe9def43d82d879c774e531d/raw/41cfb669ff137706c46477269c0bd9e4d72cfe2b/added_cor_count.csv';

export const useData = () => {
  const [data, setData] = useState(null);

  useEffect(() => {
    const row = (d) => {
      
      d.Year = +d.Year;
      d.my_count=+d.Count_by_year;
      
      return d;
    };
    csv(csvUrl, row).then(setData);
  }, []);
  

  //console.log(data);
  return data;
};
