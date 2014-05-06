window.seriecolor = {
	0: ["#D8D7DA", "#4DA3D5", "#1c638d"],
	1: ["#D8D7DA", "#bcbcbc", "#979797"],
	2: ["#4DA3D5", "#2b87bc", "#0c6ba3"],
};

if(loaddata){
	// window.loadId = [11]; // Single Serie
	window.loadId = [11,8,13]; // Multiple Series
	var test = action(loadId, loaddata, 'onload');
} else {
	alert('Data not loaded!');
}  

// -------STARTS FUNCTION-----------------------------------------------------------------------

function pieChart(data,target) {
	var options = {
		segmentShowStroke : false,	
		segmentStrokeColor : "#fff",	
		segmentStrokeWidth : 20,	
		animation : true,	
		animationSteps : 60,	
		animationEasing : "easeOutBounce",	
		animateRotate : true,
		animateScale : false,	
		onAnimationComplete : null
	}
	new Chart(document.getElementById(target).getContext("2d")).Pie(data, options);	
	$('#'+target).attr("width","100").attr("height","100"); //forced size
}

function lineChart(datas){
	var datasets = [];
	var strokeColor = "#ababab";
	var pointColor = "#ECEBEE";
	var pointStrokeColor = "#ababab";

	var i = 0;
	var legend = '';

	$.each(datas['dd'], function(key,val){
		datasets[key] = {
			fillColor: window.seriecolor[0][key],
			strokeColor: strokeColor,
			pointColor: pointColor,
			pointStrokeColor: pointStrokeColor,
			data: val	
		}
		legend += '<dl class="column" style="border-bottom: 4px solid '+window.seriecolor[0][key]+';"><dt class="grey50 left">'+datas['x'][key]+'</dt><dd class="ilegend small left">'+val[val.length - 1]+'</dd></dl>';
		i++;
	});

	legend = legend.replace(/column/g, 'col'+i);
	$('.legend').html(legend);
	$('.stats_title').html(datas['x'].join(' vs. '));

	var options = {	
		scaleOverlay : false,
		scaleOverride : false,
		scaleSteps : window.scaleSteps,
		scaleStepWidth : window.scaleStepWidth,
		scaleStartValue : window.scaleStartValue,
		scaleLineColor : "rgba(0,0,0,0)",			
		scaleLineWidth : 1,
		scaleShowLabels : true,			
		scaleLabel : "<%=value%>",			
		scaleFontFamily : "'Helvetica'",			
		scaleFontSize : 12,			
		scaleFontStyle : "normal",			
		scaleFontColor : "#838285",				
		scaleShowGridLines : false,			
		scaleGridLineColor : "rgba(0,0,0,.05)",	
		scaleGridLineWidth : 1,				
		bezierCurve : true,
		pointDot : true,			
		pointDotRadius : 2,			
		pointDotStrokeWidth : 1,			
		datasetStroke : true,			
		datasetStrokeWidth : 2,			
		datasetFill : true,			
		animation : true,
		animationSteps : 60,			
		animationEasing : "easeOutQuart",
		onAnimationComplete : null			
	}
	var lineChartData = {
		labels : datas['y'],
		datasets : datasets			
	}
	var myLine = new Chart(document.getElementById("linechart").getContext("2d")).Line(lineChartData,options);
	window.slideval = lineChartData.datasets;
}

function barChart(datas){
	$("#compare").kendoChart({
	    axisDefaults: {
	        majorGridLines: {visible: false}, majorTicks: {visible: false}},
		legend: {visible: false},
		seriesDefaults: {
		    type: "column",
	        stack: true,
	        border: {width: 0},
	        overlay: {gradient: "none"}
		},
		series: datas['data'],
		valueAxis: {
		    max: 140000,
		    line: {visible: false},
		    minorGridLines: {visible: false}
		},
		categoryAxis: {
		    categories: datas['cat'],
		    majorGridLines: {visible: false}
		},
	    tooltip: {
	        visible: true,
			template: function(e){
	      		return e.series['name'] + ': ' + output(e.value,0); 
			}
	    },
		seriesClick: function (e) {
			var data = e.series.data;
			for (var i = 0; i < data.length ; i++) {
			if (e.dataItem === data[i]) {
				if(i!=0){
					action(i, loaddata, 'bar');
				}
			}
		}},
	    valueAxis: {visible: false},
	    legend: {visible: false}
	});		
}

function output(number, dec)	{
	number = (isNaN(number))? 0 : number;
    number = number.toFixed(dec) + '';
    x = number.split('.');
    x1 = x[0];
    x2 = x.length > 1 ? '.' + x[1] : '';
    var rgx = /(\d+)(\d{3})/;
    while (rgx.test(x1)) {
        x1 = x1.replace(rgx, '$1' + ',' + '$2');
    }
    return x1 + x2;
}

function setArrow(that, data){
	data = output(data, 0);
	$(that).removeClass('down').removeClass('up').removeClass('green');
	if (data <= -1){			
		$(that).addClass('down');
	} else if (data >= 1 && data <= 99.9){			
		$(that).addClass('up');
	} else {		
		$(that).addClass('green');
	}
}

function setTitle(data,single){
	if(single){
		$('.main_title').text(data['cat']);		
		$('.sub_title').text(data['title']);
	} else {
		$('.main_title').text(data['title']);		
		$('.sub_title').text(data['title']);
	}
}

function filterData(data, id, single){
	temp = {h: data['h'],  d:[]};

	if(single){ // single series
		temp['n'] = data['d'][id]['a']['n'];
		temp['t'] = data['d'][id]['a']['t'];

		d = data['d'][id]['s'][1];
		a = data['h'][2];
		i = 0;				
		temp4 = [];

		// swap sub series to main
		$.each(d[0], function(k,v){ // 0,1,92,97 gender
			temp4[i] = {
				a: {
					n: a[k], t: a[k]
				},
				s: {
					0: []
				}
			};
			temp2 = [];
			$.each(d, function(k2,v2){ // 0,1 discharge/death
				temp2[k2] = v2[k];
			});	

			temp4[i]['s'][0] = temp2;
			i++;
		});	
		temp['d'] = temp4;		
	} else { // multiple series
		temp['n'] = data['n'];
		temp['t'] = data['t'];
		$.each(id, function(k,v){
			temp['d'][k] = data['d'][v];
			i = k;
		});		
	}
	return temp;
}

function truncate(str, n, useWordBoundary) {
    var singular, tooLong = str.length > n;
    useWordBoundary = useWordBoundary || true;
    // Edge case where someone enters a ridiculously long string.
    str = tooLong ? str.substr(0, n-1) : str;
    singular = (str.search(/\s/) === -1) ? true : false;
    if(!singular) {
      str = useWordBoundary && tooLong ? str.substr(0, str.lastIndexOf(' ')) : str;
    }
    str = str.replace(',','');
    return  tooLong ? str + '...' : str;
}

function toTitleCase(str) {
    return str.replace(/\w\S*/g, function(txt){return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();});
}

function pieCompare(data){
// console.log(data)
	config = {
		id:['Lpie', 'Rpie'],
		pcnt:['.Lpcnt', '.Rpcnt'],
		target:['.home', '.away']
	};

	temp = [];
	pcntContainer = '';

	$.each(data, function(k,v){
		var total = data['total'][k].sum();
			pieChart(v, config['id'][k]);
			pcntContainer = '';
			$.each(v, function(k2,v2){
				diffPcnt = (v2['value']/total) * 100;
				pcntContainer += '<dl class="column"><dt class="grey50">'+v2['title']+'</dt><dd class="pcnt large" style="color: '+v2['color']+';">'+output(diffPcnt)+'%</dd><dd class="small">'+output(v2['value'])+'</dd></dl>';
				$(config['target'][k]+'.title').text(v2['cat']);
				$(config['target'][k]+'.subtitle').text(v2['cat']);
				temp[k2] = v2['title'];
			});		
			$(config['pcnt'][k]).html(pcntContainer);
		
	});
	slider(temp, "vertical", 'vslider'); // Load Slider
	// console.log($('.Lpcnt').height());		
}

function pieSummary(data, index){
	index = (typeof index != 'undefined')? index: 0;
	var c = pusher.color(window.seriecolor[0][index]);
	filter = data[index]; // filter by cat
	config = {
		id:['Bpie', 'Rpie'],
		pcnt:['.BLpcnt', '.BRpcnt'],
		totalc:['.BLtotal', '.BRtotal'],
		target:['.home_diff ', '.away_diff ']
	};
	var total = data['total'][index].sum();
	temp = [];
	$.each(filter, function(k,v){
		color = c.tint(-(k*0.5)).hex6();
		filter[k]['color'] = color;
		diffPcnt = (v['value']/total) * 100;
		pcntContainer = '<dl class="column"><dt class="grey50"><span class="home subtitle">'+v['title']+'</span></dt><dd class="'+config['pcnt'][k]+' large" style="color: '+color+';">'+output(diffPcnt)+'%</dd><dd class="'+config['totalc'][k]+' small">'+output(v['value'])+'</dd></dl>';
		$(config['target'][k]).html(pcntContainer);
	});
	pieChart(filter, config['id'][0]);
}

function projection(data, index){
	target = ['.home', '.away'];
	index = (typeof index != 'undefined')? index: 0; // discharge = 0, death = 1
	$.each(data, function(k,v){
		if(typeof v == 'object'){
			dt = v['dataset'][index];
			now = dt['now'];
			bfr = dt['bfr'];
			aft = dt['aft'];
			diffBfr = bfr+now;
			diffBfrPcnt = ((bfr/now) * 100)-100;
			diffAft = aft - now;
			diffAftPcnt = ((aft/now) * 100)-100;

			$.each(v, function(k2,v2){
// title
				if(typeof(v2) == 'object'){
					$.each(v2[index], function(k3,v3){
						$(target[k]+" ."+k3).text(v3);
						if(k3 == 'now'){ // 100% marker
							diff = now;
							diffPcnt = (now/now) * 100;
						} else {
							if(v3 == 0){
								diffPcnt = 0;
							} else {
								diff = now-v3;
								diffPcnt = ((diff/now) * 100);								
							}
						}

						diffPcnt = (diffPcnt == Number.POSITIVE_INFINITY || diffPcnt == Number.NEGATIVE_INFINITY)? 0: diffPcnt; // infinity assign to zero value
						var push = $(target[k]+" ."+k3+"_pcnt"); // left / right
						$(push).text(output(diffPcnt, 0)+"%");
						setArrow(push, diffPcnt);
					});
				} 
			});
		} else {
			$(".index_after").text(data['indexAft']);
			$(".index_current").text(data['index']);
			$(".index_before").text(data['indexBfr']);
		}
		$('.year_timeline span').css("color", window.seriecolor[0][index]);
	});
}



function slider(data, orientation, type){
	orientation = (orientation)? orientation: "horizontal";
	var list = '';
	index = [];
	$.each(data, function(k,v){
		list += '<li data-index="'+k+'">'+v+'</li>';
		index[k] = k;
	});
	$('.'+orientation+' .marker').html(list);			

	var slider = $('.'+orientation+" .slider" ).slider({
		orientation: orientation,
		value: index.max(), //slider default value
		min: index.min(),
		max: index.max(),
		step: 1,
		slide: function( event, ui ) {
			if(type == 'onload') {
				action(window.loadId, loaddata, 'slider', ui.value);
			} 
			if(type == 'vslider') {
				var getpushid = (typeof window.pushId != 'undefined')? window.pushId: 1;
				window.vertIndex =  index.max() - ui.value;
				action(getpushid, window.dataFilter, 'vslider', window.vertIndex);
			}
		}
	});
}


function populate(data, id, type, index){	// populate for pie, line, bar, summary
	// console.log(data)
	// console.log(data['d'][0]['s'][0][0].length-1)
	indexid = (id.length > 1)? id[0]: id;
	index = (typeof index != 'undefined')? index : data['d'][0]['s'][0][0].length-1;

	switch(type){
		case 'line':
			var series = data['d'][0];
			var datas = {
				cat: data['t'], catName: data['n'], name: series['a']['n'], title: series['a']['t'], x: data['h'][0], y: data['h'][1], dd: {0: series['s'][0][0], 1: series['s'][0][1]}
			}
		break;
		case 'pie':
		// console.log(data)
			temp= [], temp3= [], cat= [];
			$.each(data['d'], function(k,v){
				// var series = data['d'][v];
				temp[k]= [], temp2= [];
				cat[k] = truncate(v['a']['t'],30,true);
				$.each(data['h'][0], function(k2,v2){
					temp2[k2] = v['s'][0][k2][index];
					temp[k][k2] =  {
						value: v['s'][0][k2][index], color: window.seriecolor[0][k2], cat: cat[k], title: v2
					}
				});
				temp3[k] = temp2;
			});
			temp['total'] = temp3;
			datas = temp;
		break;
		case 'bar':
			temp= [], cat= [], ids= [], dataset= [];
			$.each(data['h'][0], function(k2,v2){
				temp[k2] = [];
				$.each(data['d'], function(k,v){
					temp[k2][k] = v['s'][0][k2][index];
					cat[k] = toTitleCase(truncate(v['a']['t'],30,true));
					ids[k] = k;
				});
				dataset[k2] = {
					color: window.seriecolor[0][k2], data: temp[k2], name: v2, ids: ids
				}
			});
			datas = {data: dataset, cat: cat};
		break;
		case 'projection':
			temp = {
				index: data['h'][1][index],
				indexAft: (typeof data['h'][1][index+1] != 'undefined')? data['h'][1][index+1]: 'NA',
				indexBfr: (typeof data['h'][1][index-1] != 'undefined')? data['h'][1][index-1]: 'NA'
			}
			$.each(data['d'], function(k,v){
				// var series = data['d'][v];
				cat[k] = truncate(v['a']['t'],30,true);
				var dataset = {title: data['h'][0]}
				$.each(v['s'][0], function(k2,v2){
					now = v2[index];
					aft = (typeof v2[index+1] != 'undefined')? v2[index+1]: 0;
					bfr = (typeof v2[index-1] != 'undefined')? v2[index-1]: 0;
					dataset[k2] = {now: now, bfr: bfr, aft: aft}
				});
				temp[k] = {cat: cat[k], dataset: dataset}
			});
			datas = temp;
		break;
		case 'pieSummary':	
			temp= [], temp3= [], cat= [];
			$.each(data['h'][0], function(k2,v2){
				temp[k2] = [], temp2 = [];
				$.each(data['d'], function(k,v){
					// var series = data['d'][v];
					cat[k2] = truncate(v['a']['t'],30,true);
					temp2[k] = v['s'][0][k2][index];
					temp[k2][k] =  {
						value: v['s'][0][k2][index], cat: v2, title: cat[k2]
					}
				});
				temp3[k2] = temp2;
			});
			temp['total'] = temp3;
			datas = temp;
		break;
		default:
		break;
	}
	// calculate here!
	return datas;
}

function action(id, data, type, index){
	if(type == 'onload'){
		// data = $.parseJSON(data);
		getLevel = (id.length <= 1); // single or multiple series
		window.dataFilter = filterData(data, id, getLevel);
		var linedata = populate(dataFilter, 0, 'line');
		setTitle(linedata,getLevel);
		lineChart(linedata); // Load Line Chart
		slider(linedata['y'], "horizontal", type); // Load Slider

		var bardata = populate(dataFilter, 0, 'bar');
		barChart(bardata); // Load Bar Charts

		var getfilter = filterData(dataFilter, [0,1]);
		var piedata = populate(getfilter, 0, 'pie');
		pieCompare(piedata); // Load Pie Chart
		
		var projectdata = populate(getfilter, 0, 'projection');
		projection(projectdata); //load report projection summary

		var pieSdata = populate(getfilter, 0, 'pieSummary');
		pieSummary(pieSdata); // Load Pie Chart		
	}
	if(type == 'slider'){
		// Load Bar Chart
		var bardata = populate(dataFilter, id, 'bar', index);
		barChart(bardata);

		// Load Pie Chart
		var getfilter = filterData(dataFilter, [0,1]);
		var piedata = populate(getfilter, 0, 'pie', index);
		pieCompare(piedata);

		var projectdata = populate(getfilter, 0, 'projection', index);
		projection(projectdata); //load report projection summary

		var pieSdata = populate(getfilter, 0, 'pieSummary', index);
		pieSummary(pieSdata); // Load Pie Chart

		window.hIndex =  index;
	}
	if(type == 'vslider'){
		var getfilter = filterData(data, [0, id]);

// index vs vindex
		var projectdata = populate(getfilter, 0, 'projection', window.hIndex);
		projection(projectdata, index); //load report projection summary

		var pieSdata = populate(getfilter, 0, 'pieSummary', window.hIndex);
		pieSummary(pieSdata, index); // Load Pie Chart
	}
	if(type == 'bar'){
		var getfilter = filterData(dataFilter, [0, id]);

		var piedata = populate(getfilter, 0, 'pie', window.hIndex);
		pieCompare(piedata);

// index vs vindex
		var projectdata = populate(getfilter, 0, 'projection', window.hIndex);
		projection(projectdata, index); //load report projection summary

		var pieSdata = populate(getfilter, 0, 'pieSummary', index);
		pieSummary(pieSdata); // Load Pie Chart

		window.pushId = id; //parse to vslider
	}
	
}