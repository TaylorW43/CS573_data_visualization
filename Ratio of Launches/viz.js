import { getData } from './getData';

import vl from 'vega-lite-api';

//var data1=return_array[0];

export const viz = vl
	//.data(data1)
  .markBar()
/*
	.transform(
  	vl.groupby('Companys_Country_of_Origin')
    	.aggregate(vl.count().as('TotalCount')),
  )
  */
  .encode(
    /*
    vl.x().fieldN('Companys_Country_of_Origin').title("Country")
    	.sort(vl.field('TotalCount').order('ascending')),
    vl.y().fieldQ('TotalCount').title('Total Number of Rockets'),
    vl.tooltip('TotalCount'),
    //vl.color().fieldN('Company_name'),
    //vl.x().fieldN(return_array[1]),
    //vl.y().fieldQ('Object.values(final_p)'),
    */
    
    vl.x().fieldN('Companys_Country_of_Origin').title("Country"),
    vl.y().count(),
    vl.tooltip().count(),
    vl.color().fieldN('Private_or_State_Run').title("Private or State Run"),
  );
  