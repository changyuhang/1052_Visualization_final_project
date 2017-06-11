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
        var path = d3.geo.path().projection(prj);
        d3.select("svg").selectAll("path").data(features).enter().append("path");

        function update() {
            d3.select("svg").selectAll("path").attr({
                "d": path,
                "fill": '#fff',
                "stroke": 'green'
            }).on("mouseover", function(d) {
                $(this).attr('fill', 'green');
                // console.log($(this).position());
                $("#info").show().css('top', $(this).position().top - 10).css('left', $(this).position().left + 10);
                $("#name").text(d.properties.C_Name);
            }).on("mouseleave", function(d) {
                $(this).attr('fill', '#fff');
                $("#info").hide();
            });
        }
        update();
    });
});
