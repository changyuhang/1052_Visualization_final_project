var data_types_arr = [ "car_accident", "drunk", "car_accident_diff","drunk_diff","drunk_rate"];
var data_types = "car_accident";
var data_types_id = 0;
var data_years = 103;
function change_data(){

	if(data_years == 104)data_years = 103;
	else data_years = 104;
	//alert(data_years);
}

function change_data_type(){
	data_types_id++;
	if(data_types_id > 1)data_types_id = 0;
	data_types = data_types_arr[data_types_id];
	//alert(data_types);
}

function normlizion_city_name(city_name){
	city_name = city_name.replace("臺", "台");
	if(city_name=="台北縣")return "新北市";
	if(city_name=="台中縣")return "台中市";
	if(city_name=="台中")return "台中市";
	if(city_name=="基隆")return "基隆市";
	return city_name;
}
function formatFloat(num, pos)
{
  var size = Math.pow(10, pos);
  return Math.round(num * size) / size;
}
$(document).ready(function() {
    // var accident_data = $.getJSON("final.json");
    var accident_data = [];
    $.getJSON("final.json", function(data){
        accident_data = data;
        console.log(accident_data);
    });
    d3.json("county.json", function(topodata) {
        var features = topojson.feature(topodata, topodata.objects.county).features;
        var prj = function(v) {
            var ret = d3.geo.mercator().center([122, 23.25]).scale(4000)(v);
            return [ret[0], ret[1]];
        };

		for(i=features.length - 1; i >= 0; i-- ) {
			features[i].properties.car_accident = [];
			features[i].properties.car_accident_diff;
			features[i].properties.drunk = [];
			features[i].properties.drunk_diff;
			features[i].properties.drunk_rate = [];
			for(j=features.length - 1; j >= 0; j-- ) {
				if(normlizion_city_name(features[i].properties.C_Name) == normlizion_city_name(accident_data[j].city)){
					features[i].properties.car_accident[103] = accident_data[j].car_accident103;
					features[i].properties.drunk[103] = accident_data[j].drunk103;
					features[i].properties.car_accident[104] = accident_data[j].car_accident104;
					features[i].properties.drunk[104] = accident_data[j].drunk104;

					features[i].properties.car_accident_diff = accident_data[j].car_accident104 - accident_data[j].car_accident103;
					features[i].properties.drunk_diff= accident_data[j].drunk104 - accident_data[j].drunk103;
					features[i].properties.drunk_rate[103] =formatFloat(accident_data[j].drunk103/ accident_data[j].car_accident103,3);
					features[i].properties.drunk_rate[104] =formatFloat(accident_data[j].drunk104/ accident_data[j].car_accident104,3);
				}
			}
		}

       var path = d3.geo.path().projection(prj);
	   var color = d3.scale.linear().domain([0,10000]).range(["#090","#f00"]);
        d3.select("svg").selectAll("path").data(features).enter().append("path").attr({
			"d": path,
				"fill": function(d) {
					console.log("d.properties." + data_types + "[data_years]");
					return color(parseInt(eval("d.properties." + data_types + "[data_years]")));
				}
			}
		);

		d3.select("body").append("button")
                .text("切換年份")
                .on("click",function(){
					change_data();
					if(data_types!="car_accident"&&data_types!="drunk")
					{
						data_types = data_types_arr[data_types_id];
					}
					var show_data;
					if(data_types=="car_accident")
					{
						show_data = "交通事故";
					}
					else
					{
						show_data = "酒駕";
					}
					document.getElementById("data_type").innerHTML = "民國 "+data_years+ "年 "+ show_data+"數量";
					d3.select("svg").selectAll("path").attr({
						"d": path,
						"fill": function(d) {
						if(data_types=="drunk")
							return color(parseInt(eval("d.properties." + data_types + "[data_years]"))*10);
						else
							return color(parseInt(eval("d.properties." + data_types + "[data_years]")));
					},
					"stroke": 'green'
					});

				});
		d3.select("body").append("button")
                .text("切換資料")
                .on("click",function(){
					change_data_type();
					var show_data;
					if(data_types=="car_accident")
					{
						show_data = "交通事故";
					}
					else
					{
						show_data = "酒駕";
					}
					document.getElementById("data_type").innerHTML = "民國 "+data_years+ "年 "+ show_data+"數量";
					d3.select("svg").selectAll("path").attr({
						"d": path,
						"fill": function(d) {
							if(data_types=="drunk")
								return color(parseInt(eval("d.properties." + data_types + "[data_years]"))*10);
							else
								return color(parseInt(eval("d.properties." + data_types + "[data_years]")));
					},
					"stroke": 'green'
					});
				});
		d3.select("body").append("button")
										.text("前後比較")
										.on("click",function(){
							data_types = data_types_arr[data_types_id+2];
							if(data_types == "car_accident_diff"){
								document.getElementById("data_type").innerHTML = "修法前後 交通事故數量比較";
							}
							else{
								document.getElementById("data_type").innerHTML = "修法前後 酒駕數量比較";
							}
							d3.select("svg").selectAll("path").attr({
								"d": path,
								"fill": function(d) {
								return color(parseInt(eval("d.properties." + data_types))*10);
							},
							"stroke": 'green'
						});
				});
				d3.select("body").append("button")
												.text("酒駕比率")
												.on("click",function(){
									change_data();
									data_types="drunk_rate";
									if(data_years == 103){
										document.getElementById("data_type").innerHTML = "民國 103年 酒駕比率";
									}
									else{
										document.getElementById("data_type").innerHTML = "民國 104年 酒駕比率";
									}
									d3.select("svg").selectAll("path").attr({
										"d": path,
										"fill": function(d) {
										return color(eval("d.properties." + data_types + "[data_years]")*75000);
									},
									"stroke": 'green'
								});
						});
        function update() {
            d3.select("svg").selectAll("path").attr({
                "d": path,
                "fill": function(d) {
					return color(parseInt(eval("d.properties." + data_types + "[data_years]")));
				},
                "stroke": 'green'
            }).on("mouseover", function(d,evnt) {
							var myX = evnt.clientX;
							var	myY = evnt.clientY;

                $(this).attr('fill', 'White');
                $("#info").show().css('top',myX - 10).css('left', myY + 25);
                $("#name").text(d.properties.C_Name);
								if(data_types=="car_accident_diff" || data_types=="drunk_diff")
								{
									var data_in = eval("d.properties." + data_types);
									if(parseInt(data_in)>=0)
									$("#case").text("事件增加 "+ data_in +"件");
									else
									{
										data_in = data_in *-1;
										$("#case").text("事件減少 "+ data_in +"件");
									}
								}
								else if(data_types=="drunk_rate")
								{
									$("#case").text("酒駕比率" + formatFloat(eval("d.properties." + data_types + "[data_years]")*100,1)+"%");
								}
								else
								{
									$("#case").text("總共 "+ eval("d.properties." + data_types + "[data_years]") +"件");
								}
						}).on("mouseleave", function(d) {
							if(data_types=="car_accident_diff" || data_types=="drunk_diff")
							{
								$(this).attr('fill', color(parseInt(eval("d.properties." + data_types))*10));
							}
							else if(data_types=="drunk")
							{
								$(this).attr('fill', color(parseInt(eval("d.properties." + data_types + "[data_years]"))*10));
							}
							else if(data_types=="drunk_rate")
							{
								$(this).attr('fill', color(eval("d.properties." + data_types + "[data_years]")*75000));
							}
							else
							{
								$(this).attr('fill', color(parseInt(eval("d.properties." + data_types + "[data_years]"))));
							}

                $("#info").hide();
            });
        }
        update();
    });


});
