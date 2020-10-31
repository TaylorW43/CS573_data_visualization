(function (vega, vegaLite, vl, vegaTooltip, d3) {
  'use strict';

  vega = vega && Object.prototype.hasOwnProperty.call(vega, 'default') ? vega['default'] : vega;
  vegaLite = vegaLite && Object.prototype.hasOwnProperty.call(vegaLite, 'default') ? vegaLite['default'] : vegaLite;
  vl = vl && Object.prototype.hasOwnProperty.call(vl, 'default') ? vl['default'] : vl;

  // Appearance customization to improve readability.
  // See https://vega.github.io/vega-lite/docs/
  const dark = '#3e3c38';
  const config = {
    axis: {
      domain: false,
      tickColor: 'lightGray'
    },
    style: {
      "guide-label": {
        fontSize: 10,
        fill: dark
      },
      "guide-title": {
        fontSize: 30,
        fill: dark
      }
    }
  };

  const csvUrl = 'https://gist.githubusercontent.com/TaylorW43/25908e7fbe9def43d82d879c774e531d/raw/6c9f5397be2e24ffc57e126a0036504948b9aa53/clean.csv';

  //var final_p={};

  const getData = async () => {
    const data = await d3.csv(csvUrl);
    
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

  //var data1=return_array[0];

  const viz = vl
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

  vl.register(vega, vegaLite, {
    view: { renderer: 'svg' },
    init: view => { view.tooltip(new vegaTooltip.Handler().call); }
  });

  const run = async () => {
    const marks = viz
      .data(await getData())
      .width(window.innerWidth)
      .height(window.innerHeight)
      .autosize({ type: 'fit', contains: 'padding' })
      .config(config);
    
    document.body.appendChild(await marks.render());
  };
  run();

}(vega, vegaLite, vl, vegaTooltip, d3));

//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW5kZXguanMiLCJzb3VyY2VzIjpbImNvbmZpZy5qcyIsImdldERhdGEuanMiLCJ2aXouanMiLCJpbmRleC5qcyJdLCJzb3VyY2VzQ29udGVudCI6WyIvLyBBcHBlYXJhbmNlIGN1c3RvbWl6YXRpb24gdG8gaW1wcm92ZSByZWFkYWJpbGl0eS5cbi8vIFNlZSBodHRwczovL3ZlZ2EuZ2l0aHViLmlvL3ZlZ2EtbGl0ZS9kb2NzL1xuY29uc3QgZGFyayA9ICcjM2UzYzM4JztcbmV4cG9ydCBjb25zdCBjb25maWcgPSB7XG4gIGF4aXM6IHtcbiAgICBkb21haW46IGZhbHNlLFxuICAgIHRpY2tDb2xvcjogJ2xpZ2h0R3JheSdcbiAgfSxcbiAgc3R5bGU6IHtcbiAgICBcImd1aWRlLWxhYmVsXCI6IHtcbiAgICAgIGZvbnRTaXplOiAxMCxcbiAgICAgIGZpbGw6IGRhcmtcbiAgICB9LFxuICAgIFwiZ3VpZGUtdGl0bGVcIjoge1xuICAgICAgZm9udFNpemU6IDMwLFxuICAgICAgZmlsbDogZGFya1xuICAgIH1cbiAgfVxufTsiLCJpbXBvcnQgeyBjc3YgfSBmcm9tICdkMyc7XG5cbmNvbnN0IGNzdlVybCA9ICdodHRwczovL2dpc3QuZ2l0aHVidXNlcmNvbnRlbnQuY29tL1RheWxvclc0My8yNTkwOGU3ZmJlOWRlZjQzZDgyZDg3OWM3NzRlNTMxZC9yYXcvNmM5ZjUzOTdiZTJlMjRmZmM1N2UxMjZhMDAzNjUwNDk0OGI5YWE1My9jbGVhbi5jc3YnXG4gICAgICBcbmNvbnN0IGNhbF9jc3YgPSAnaHR0cHM6Ly9naXN0LmdpdGh1YnVzZXJjb250ZW50LmNvbS9UYXlsb3JXNDMvMjU5MDhlN2ZiZTlkZWY0M2Q4MmQ4NzljNzc0ZTUzMWQvcmF3L2ExZmE1ZGEwZGJlZGQ3YmZiNjUzZDBlNzVkYTY2MGVhMGRiOTM4MzAvY2FsY3VsYXRlLmNzdidcblxuLy92YXIgZmluYWxfcD17fTtcblxuZXhwb3J0IGNvbnN0IGdldERhdGEgPSBhc3luYyAoKSA9PiB7XG4gIGNvbnN0IGRhdGEgPSBhd2FpdCBjc3YoY3N2VXJsKTtcbiAgXG4gIC8vY29uc3QgZGF0YTI9IGF3YWl0IGNzdihjYWxfY3N2KTtcbiAgXG4gIC8vIEhhdmUgYSBsb29rIGF0IHRoZSBhdHRyaWJ1dGVzIGF2YWlsYWJsZSBpbiB0aGUgY29uc29sZSFcbiAgY29uc29sZS5sb2coZGF0YVswXSk7XG4gIC8vY29uc29sZS5sb2coZGF0YVswXS5Db21wYW55X05hbWUpO1xuICAvKlxuICAvL2dyb3VwIGJ5IGNvbXBhbnkgY291bnRyeSBvZiBvcmlnaW4gdGhlbiBieSBQIG9yIFNcbiAgdmFyIG9yaWdpbl9ncm91cD1kMy5uZXN0KClcbiAgXHQua2V5KGZ1bmN0aW9uKGQpe3JldHVybiBkLlByaXZhdGVfb3JfU3RhdGVfUnVuO30pXG4gIFx0LmtleShmdW5jdGlvbihkKXtyZXR1cm4gZC5Db21wYW55c19Db3VudHJ5X29mX09yaWdpbjt9KVxuICBcdC5lbnRyaWVzKGRhdGEyKTtcbiAgLy9jb25zb2xlLmxvZyhKU09OLnN0cmluZ2lmeShvcmlnaW5fZ3JvdXApKTtcbiAgLy9lbmQgZ3JvdXBcbiAgKi9cbiAgXG4gIC8vY29uc29sZS5sb2coT2JqZWN0LnZhbHVlcyhvcmlnaW5fZ3JvdXBbMF0pWzFdKTsgXG4gIC8qXG4gIHZhciB0ZW1wPU9iamVjdC52YWx1ZXMob3JpZ2luX2dyb3VwWzBdKVsxXTtcbiAgXG4gIC8vY29uc29sZS5sb2codGVtcCk7XG4gIFxuICBcbiAgZm9yKHZhciBpPTA7aTx0ZW1wLmxlbmd0aDtpKyspXG4gIHtcbiAgICB2YXIgdGVtcF9jb3VudHJ5PU9iamVjdC52YWx1ZXModGVtcFtpXSlbMF07XG4gICAgdmFyIHRlbXBfcHJpdmF0ZT1PYmplY3QudmFsdWVzKHRlbXBbaV0pWzFdO1xuICAgIFxuICAgIGZpbmFsX3BbdGVtcF9jb3VudHJ5XT10ZW1wX3ByaXZhdGUubGVuZ3RoO1xuICB9XG4gIC8vY29uc29sZS5sb2coZmluYWxfcCk7XG4gIC8vY29uc29sZS5sb2coT2JqZWN0LmtleXMoZmluYWxfcCkpO1xuICAvL2NvbnNvbGUubG9nKE9iamVjdC52YWx1ZXMoZmluYWxfcCkpO1xuICAgICAgICAgICAgICAgXG4gIFxuICAvL3JldHVybiB2YWx1ZVxuICB2YXIgcmV0dXJuX2FycmF5PVtdO1xuICByZXR1cm5fYXJyYXkucHVzaChkYXRhLGZpbmFsX3ApO1xuICBjb25zb2xlLmxvZyhyZXR1cm5fYXJyYXkpO1xuICAvL2NvbnNvbGUubG9nKHJldHVybl9hcnJheVsxXSk7XG4gIGNvbnNvbGUubG9nKE9iamVjdC5rZXlzKHJldHVybl9hcnJheVsxXSkpO1xuICAqL1xuXG4gIHJldHVybiBkYXRhO1xuICAvL3JldHVybiByZXR1cm5fYXJyYXk7XG59OyIsImltcG9ydCB7IGdldERhdGEgfSBmcm9tICcuL2dldERhdGEnO1xuXG5pbXBvcnQgdmwgZnJvbSAndmVnYS1saXRlLWFwaSc7XG5cbi8vdmFyIGRhdGExPXJldHVybl9hcnJheVswXTtcblxuZXhwb3J0IGNvbnN0IHZpeiA9IHZsXG5cdC8vLmRhdGEoZGF0YTEpXG4gIC5tYXJrQmFyKClcbi8qXG5cdC50cmFuc2Zvcm0oXG4gIFx0dmwuZ3JvdXBieSgnQ29tcGFueXNfQ291bnRyeV9vZl9PcmlnaW4nKVxuICAgIFx0LmFnZ3JlZ2F0ZSh2bC5jb3VudCgpLmFzKCdUb3RhbENvdW50JykpLFxuICApXG4gICovXG4gIC5lbmNvZGUoXG4gICAgLypcbiAgICB2bC54KCkuZmllbGROKCdDb21wYW55c19Db3VudHJ5X29mX09yaWdpbicpLnRpdGxlKFwiQ291bnRyeVwiKVxuICAgIFx0LnNvcnQodmwuZmllbGQoJ1RvdGFsQ291bnQnKS5vcmRlcignYXNjZW5kaW5nJykpLFxuICAgIHZsLnkoKS5maWVsZFEoJ1RvdGFsQ291bnQnKS50aXRsZSgnVG90YWwgTnVtYmVyIG9mIFJvY2tldHMnKSxcbiAgICB2bC50b29sdGlwKCdUb3RhbENvdW50JyksXG4gICAgLy92bC5jb2xvcigpLmZpZWxkTignQ29tcGFueV9uYW1lJyksXG4gICAgLy92bC54KCkuZmllbGROKHJldHVybl9hcnJheVsxXSksXG4gICAgLy92bC55KCkuZmllbGRRKCdPYmplY3QudmFsdWVzKGZpbmFsX3ApJyksXG4gICAgKi9cbiAgICBcbiAgICB2bC54KCkuZmllbGROKCdDb21wYW55c19Db3VudHJ5X29mX09yaWdpbicpLnRpdGxlKFwiQ291bnRyeVwiKSxcbiAgICB2bC55KCkuY291bnQoKSxcbiAgICB2bC50b29sdGlwKCkuY291bnQoKSxcbiAgICB2bC5jb2xvcigpLmZpZWxkTignUHJpdmF0ZV9vcl9TdGF0ZV9SdW4nKS50aXRsZShcIlByaXZhdGUgb3IgU3RhdGUgUnVuXCIpLFxuICApO1xuICAiLCJpbXBvcnQgdmVnYSBmcm9tICd2ZWdhJztcbmltcG9ydCB2ZWdhTGl0ZSBmcm9tICd2ZWdhLWxpdGUnO1xuaW1wb3J0IHZsIGZyb20gJ3ZlZ2EtbGl0ZS1hcGknO1xuaW1wb3J0IHsgSGFuZGxlciB9IGZyb20gJ3ZlZ2EtdG9vbHRpcCc7XG5pbXBvcnQgeyBjb25maWcgfSBmcm9tICcuL2NvbmZpZyc7XG5pbXBvcnQgeyBnZXREYXRhIH0gZnJvbSAnLi9nZXREYXRhJztcbmltcG9ydCB7IHZpeiB9IGZyb20gJy4vdml6JztcblxudmwucmVnaXN0ZXIodmVnYSwgdmVnYUxpdGUsIHtcbiAgdmlldzogeyByZW5kZXJlcjogJ3N2ZycgfSxcbiAgaW5pdDogdmlldyA9PiB7IHZpZXcudG9vbHRpcChuZXcgSGFuZGxlcigpLmNhbGwpOyB9XG59KTtcblxuY29uc3QgcnVuID0gYXN5bmMgKCkgPT4ge1xuICBjb25zdCBtYXJrcyA9IHZpelxuICAgIC5kYXRhKGF3YWl0IGdldERhdGEoKSlcbiAgICAud2lkdGgod2luZG93LmlubmVyV2lkdGgpXG4gICAgLmhlaWdodCh3aW5kb3cuaW5uZXJIZWlnaHQpXG4gICAgLmF1dG9zaXplKHsgdHlwZTogJ2ZpdCcsIGNvbnRhaW5zOiAncGFkZGluZycgfSlcbiAgICAuY29uZmlnKGNvbmZpZyk7XG4gIFxuICBkb2N1bWVudC5ib2R5LmFwcGVuZENoaWxkKGF3YWl0IG1hcmtzLnJlbmRlcigpKTtcbn07XG5ydW4oKTsiXSwibmFtZXMiOlsiY3N2IiwiSGFuZGxlciJdLCJtYXBwaW5ncyI6Ijs7Ozs7OztFQUFBO0VBQ0E7RUFDQSxNQUFNLElBQUksR0FBRyxTQUFTLENBQUM7RUFDaEIsTUFBTSxNQUFNLEdBQUc7RUFDdEIsRUFBRSxJQUFJLEVBQUU7RUFDUixJQUFJLE1BQU0sRUFBRSxLQUFLO0VBQ2pCLElBQUksU0FBUyxFQUFFLFdBQVc7RUFDMUIsR0FBRztFQUNILEVBQUUsS0FBSyxFQUFFO0VBQ1QsSUFBSSxhQUFhLEVBQUU7RUFDbkIsTUFBTSxRQUFRLEVBQUUsRUFBRTtFQUNsQixNQUFNLElBQUksRUFBRSxJQUFJO0VBQ2hCLEtBQUs7RUFDTCxJQUFJLGFBQWEsRUFBRTtFQUNuQixNQUFNLFFBQVEsRUFBRSxFQUFFO0VBQ2xCLE1BQU0sSUFBSSxFQUFFLElBQUk7RUFDaEIsS0FBSztFQUNMLEdBQUc7RUFDSCxDQUFDOztFQ2hCRCxNQUFNLE1BQU0sR0FBRyx1SUFBc0k7QUFHcko7RUFDQTtBQUNBO0VBQ08sTUFBTSxPQUFPLEdBQUcsWUFBWTtFQUNuQyxFQUFFLE1BQU0sSUFBSSxHQUFHLE1BQU1BLE1BQUcsQ0FBQyxNQUFNLENBQUMsQ0FBQztFQUNqQztFQUNBO0VBQ0E7RUFDQTtFQUNBLEVBQUUsT0FBTyxDQUFDLEdBQUcsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQztFQUN2QjtFQUNBO0VBQ0E7RUFDQTtFQUNBO0VBQ0E7RUFDQTtFQUNBO0VBQ0E7RUFDQTtFQUNBO0VBQ0E7RUFDQTtFQUNBO0VBQ0E7RUFDQTtFQUNBO0VBQ0E7RUFDQTtFQUNBO0VBQ0E7RUFDQTtFQUNBO0VBQ0E7RUFDQTtFQUNBO0VBQ0E7RUFDQTtFQUNBO0VBQ0E7RUFDQTtFQUNBO0VBQ0E7RUFDQTtFQUNBO0VBQ0E7RUFDQTtBQUNBO0VBQ0EsRUFBRSxPQUFPLElBQUksQ0FBQztFQUNkO0VBQ0EsQ0FBQzs7RUNuREQ7QUFDQTtFQUNPLE1BQU0sR0FBRyxHQUFHLEVBQUU7RUFDckI7RUFDQSxHQUFHLE9BQU8sRUFBRTtFQUNaO0VBQ0E7RUFDQTtFQUNBO0VBQ0E7RUFDQTtFQUNBLEdBQUcsTUFBTTtFQUNUO0VBQ0E7RUFDQTtFQUNBO0VBQ0E7RUFDQTtFQUNBO0VBQ0E7RUFDQTtFQUNBO0VBQ0EsSUFBSSxFQUFFLENBQUMsQ0FBQyxFQUFFLENBQUMsTUFBTSxDQUFDLDRCQUE0QixDQUFDLENBQUMsS0FBSyxDQUFDLFNBQVMsQ0FBQztFQUNoRSxJQUFJLEVBQUUsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxLQUFLLEVBQUU7RUFDbEIsSUFBSSxFQUFFLENBQUMsT0FBTyxFQUFFLENBQUMsS0FBSyxFQUFFO0VBQ3hCLElBQUksRUFBRSxDQUFDLEtBQUssRUFBRSxDQUFDLE1BQU0sQ0FBQyxzQkFBc0IsQ0FBQyxDQUFDLEtBQUssQ0FBQyxzQkFBc0IsQ0FBQztFQUMzRSxHQUFHOztFQ3RCSCxFQUFFLENBQUMsUUFBUSxDQUFDLElBQUksRUFBRSxRQUFRLEVBQUU7RUFDNUIsRUFBRSxJQUFJLEVBQUUsRUFBRSxRQUFRLEVBQUUsS0FBSyxFQUFFO0VBQzNCLEVBQUUsSUFBSSxFQUFFLElBQUksSUFBSSxFQUFFLElBQUksQ0FBQyxPQUFPLENBQUMsSUFBSUMsbUJBQU8sRUFBRSxDQUFDLElBQUksQ0FBQyxDQUFDLEVBQUU7RUFDckQsQ0FBQyxDQUFDLENBQUM7QUFDSDtFQUNBLE1BQU0sR0FBRyxHQUFHLFlBQVk7RUFDeEIsRUFBRSxNQUFNLEtBQUssR0FBRyxHQUFHO0VBQ25CLEtBQUssSUFBSSxDQUFDLE1BQU0sT0FBTyxFQUFFLENBQUM7RUFDMUIsS0FBSyxLQUFLLENBQUMsTUFBTSxDQUFDLFVBQVUsQ0FBQztFQUM3QixLQUFLLE1BQU0sQ0FBQyxNQUFNLENBQUMsV0FBVyxDQUFDO0VBQy9CLEtBQUssUUFBUSxDQUFDLEVBQUUsSUFBSSxFQUFFLEtBQUssRUFBRSxRQUFRLEVBQUUsU0FBUyxFQUFFLENBQUM7RUFDbkQsS0FBSyxNQUFNLENBQUMsTUFBTSxDQUFDLENBQUM7RUFDcEI7RUFDQSxFQUFFLFFBQVEsQ0FBQyxJQUFJLENBQUMsV0FBVyxDQUFDLE1BQU0sS0FBSyxDQUFDLE1BQU0sRUFBRSxDQUFDLENBQUM7RUFDbEQsQ0FBQyxDQUFDO0VBQ0YsR0FBRyxFQUFFOzs7OyJ9