// window.seriecolor = {
// 	0: ["#D8D7DA", "#4DA3D5", "#1c638d"],
// 	1: ["#D8D7DA", "#bcbcbc", "#979797"],
// 	2: ["#4DA3D5", "#2b87bc", "#0c6ba3"],
// };

// if(loaddata){
// 	// window.loadId = [11]; // Single Serie
// 	window.loadId = [11,8,13]; // Multiple Series
// 	var test = action(loadId, loaddata, 'onload');
// } else {
// 	alert('Data not loaded!');
// }  

// -------STARTS FUNCTION-----------------------------------------------------------------------

function pie(data, target) {
	var options = {		
		segmentShowStroke : false,	
		segmentStrokeColor : "#fff",	
		segmentStrokeWidth : 20,	
		animation : true,	
		animationSteps : 60,	
		animationEasing : "easeOutBounce",	
		animateRotate : true,
		animateScale : true,	
		onAnimationComplete : null
	}
	new Chart(document.getElementById(target).getContext("2d")).Pie(data, options);	
	$('#'+target).attr("width","100").attr("height","100"); //forced size
}


function linechart(datas){
	window.labels = new Array;
	window.data1 = new Array;
	window.data2 = new Array;
	$.each(datas, function(key, val){
		// datas[key]= [{data: val.penduduk}, {data: val.belia}, {district: val.district}, {state: val.state}, {datas: val.datas}];
		labels[key] = val[2]['district'];
		data1[key] = val[0]['data'][5];
		data2[key] = val[1]['data'][5];
		// console.log(val[3]['state']);

	});
	// console.log(data1);

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
		scaleFontColor : "#666",				
		scaleShowGridLines : false,			
		scaleGridLineColor : "rgba(0,0,0,.05)",	
		scaleGridLineWidth : 1,				
		bezierCurve : true,			
		pointDot : true,			
		pointDotRadius : 3,			
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
		labels : labels,
		datasets : [
			{
				fillColor : "#1c638d",
				strokeColor : "#454447",
				pointColor : "#ffffff",
				pointStrokeColor : "#454447",
				data : data1
			},
			{
				fillColor : "#4DA3D5",
				strokeColor : "#454447",
				pointColor : "#ffffff",
				pointStrokeColor : "#454447",
				data : data2
			}
		]			
	}
	var myLine = new Chart(document.getElementById("linechart").getContext("2d")).Line(lineChartData,options);
	window.slideval = lineChartData.datasets;
}

function loadDiffHome(penduduk,belia,belia_diff,belia_diff_pcnt,belia_diff_bfr,belia_diff_bfr_pcnt,belia_diff_aft,belia_diff_aft_pcnt,district){
	$(".belia_total").text(output(belia,0));
	$(".pop_total").text(output(penduduk,0));
	$(".belia_pcnt").text(output(belia_diff_pcnt,0)+'%');
	$(".pop_pcnt").text(output((100 - belia_diff_pcnt),0)+'%');

	$(".belia_diff").text(output(belia_diff,0));
	$(".belia_diff_pcnt").text(output(belia_diff_pcnt,0)+'%');

	$(".belia_diff_bfr").text(output(belia_diff_bfr,0));
	$(".belia_diff_bfr_pcnt").text(output(belia_diff_bfr_pcnt,0)+'%');

	$(".belia_diff_aft").text(output(belia_diff_aft,0));
	$(".belia_diff_aft_pcnt").text(output(belia_diff_aft_pcnt,0)+'%');

	if(belia_diff_bfr < 0){
		$('.home .belia_diff_bfr_pcnt').removeClass('up').addClass('down');
	} else {
		$('.home .belia_diff_bfr_pcnt').removeClass('down').addClass('up');
	}
	if(belia_diff_aft < 0){
		$('.home .belia_diff_aft_pcnt').removeClass('up').addClass('down');
	} else {
		$('.home .belia_diff_aft_pcnt').removeClass('down').addClass('up');
	}	
	$(".thisdistrict").text(district);
}


function calculate(min, yearindex, dataset){
	window.labels;
	window.data1;
	window.data2;

	// console.log(window.labels,window.data1,window.data2);

	var newData = new Array;

	$.each(labels, function(key,val){
		newData[key] = {district: val, data1: data1[key], data2: data2[key]};
	});
	newData.sort(function(a, b){ return b.data2-a.data2 });


	var index = yearindex - min;

	var penduduk, penduduk_bfr, penduduk_aft, belia_diff, belia_diff_pcnt, belia_diff_bfr, belia_diff_bfr_pcnt, belia_diff_aft, belia_diff_aft_pcnt;

	penduduk 	= newData[0]['data1'];
	belia 		= newData[0]['data2'];
	// penduduk_bfr 		= newData[0]['data'][index-1];
	// window.belia_bfr 	= newData[1]['data'][index-1];
	// penduduk_aft 		= newData[0]['data'][index+1];
	// window.belia_aft 	= newData[1]['data'][index+1];

	// console.log(dataset);

	// $.each(dataset, function(key, val){
	// 	penduduk		= dataset[0]['data'][index];
	// 	window.belia	= dataset[1]['data'][index];		
	// });

	belia_diff = penduduk - belia;
	belia_diff_pcnt = (belia/penduduk) * 100;
	// belia_diff_bfr = belia_bfr-belia;
	// belia_diff_bfr_pcnt = ((belia_bfr/belia) * 100)-100;
	// belia_diff_aft = belia_aft - belia;
	// belia_diff_aft_pcnt = ((belia_aft/belia) * 100)-100;

	var piedata = [
		{value: belia_diff, color: "#1c638d"},
		{value: belia, color:"#4DA3D5"}
	];
	pie(piedata, 'pie');

	loadDiffHome(penduduk,belia,belia_diff,belia_diff_pcnt,belia_diff_bfr,belia_diff_bfr_pcnt,belia_diff_aft,belia_diff_aft_pcnt,newData[0]['district']);
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

function bar(stats_set,datas,thisyear){
	window.labels;
	window.data1;
	window.data2;

	// console.log(window.labels,window.data1,window.data2);

	var newData = new Array;

	$.each(labels, function(key,val){
		newData[key] = {district: val, data1: data1[key], data2: data2[key]};
		// datas[key]= [{data: val.penduduk}, {data: val.belia}, {district: val.district}, {state: val.state}, {datas: val.datas}];
	});
	newData.sort(function(a, b){ return b.data2-a.data2 });
	// console.log(newData[0]['district']);


	var cat = Array();
	var Bbelia = Array();
	var Bpenduduk = Array();

	var index = (typeof thisyear != 'undefined')? ((thisyear-window.min_year)): (window.year-window.min_year);
	var bardata = Array();

	for (var i = 0; i < 5; i++) {
		cat.push(newData[i]['district']);
		Bbelia.push(newData[i]['data2']);
		Bpenduduk.push(newData[i]['data1']);
	};

	$("#compare").kendoChart({
	    axisDefaults: {
	        majorGridLines: { visible: false },
	        majorTicks: { visible: false }
	    },
		legend: {
		    visible: false
		},
		seriesDefaults: {
		    type: "column",
	        stack: true,
	        border: {
	            width: 0
	        },
	        overlay: {
	            gradient: "none"
	        }
		},
		series: [{
		    name: "Belia",
		    data: Bbelia,
	        color: "#4DA3D5"
		}, {
	        name: "Penduduk",
	        data: Bpenduduk,
	        color: "#1C638D"
	    }],
		valueAxis: {
		    max: 140000,
		    line: {
		        visible: false
		    },
		    minorGridLines: {
		        visible: false
		    }
		},
		categoryAxis: {
		    categories: cat,
		    majorGridLines: {
		        visible: false
		    }
		},
	    tooltip: {
	        visible: true,
			template: function(e){
				window.comparex = 0;
				setSparklines(e.category);
	      		return e.series['name'] + ': ' + output(e.value,0); 
			}
	    },
	    valueAxis: {
	        visible: false
	    },
	    legend: { visible: false }
	});		
}



function setSparklines(getData){
	window.labels;
	window.data1;
	window.data2;

	var newData = new Array;

	$.each(labels, function(key,val){
		newData[key] = {district: val, data1: data1[key], data2: data2[key]};
		// datas[key]= [{data: val.penduduk}, {data: val.belia}, {district: val.district}, {state: val.state}, {datas: val.datas}];
	});
	newData.sort(function(a, b){ return b.data2-a.data2 });
	// console.log(newData);




	var pushdata;
	window.pushdatas = [];
	pushdata = newData.filter(function (d) {
		return d['district'] == getData;
	});

	$.each(pushdata, function(key, val){
		pushdatas[key]= [{data: val.data1}, {data: val.data2}, {district: val.district}, {state: 'Johor'}];
	});

	pushSparklines1(window.stats_set, window.pushdatas, window.min_year, window.selected_year);
}

function pushSparklines1(stats_set, getdata, min_year, thisyear){

	var thisdata = getdata[0];

	var Bbelia = thisdata[1]['data'];
	var BPenduduk = thisdata[0]['data'];
	// var index = (typeof thisyear != 'undefined')? ((thisyear-window.min_year)): (window.year-window.min_year);

	var piedata = [
		{value: (BPenduduk-Bbelia), color: "#1c638d"},
		{value: Bbelia, color:"#4DA3D5"}
	];

	pie(piedata, 'cpie');

	var title = (thisdata[2]['district'])? thisdata[2]['district'] : thisdata[3]['state'];
	$('.thatdistrict').text(title);

	// var belia = Bbelia[index];
	// var belia_bfr = Bbelia[index-1];
	// var belia_aft = Bbelia[index+1];

	// var belia_diff_bfr = veriNum(belia_bfr-belia);
	// var belia_diff_aft = veriNum(belia_aft-belia);
	// var belia_diff_bfr_pcnt = veriNum(((belia_bfr/belia) * 100)-100);
	// var belia_diff_aft_pcnt = veriNum(((belia_aft/belia) * 100)-100);

	var belia_diff_pcnt = (Bbelia/BPenduduk) * 100;

	$(".Bbelia_total").text(output(Bbelia));
	$(".Bpop_total").text(output(BPenduduk));
	$(".Bbelia_pcnt").text(output(belia_diff_pcnt,0)+'%');
	$(".Bpop_pcnt").text(output((100 - belia_diff_pcnt),0)+'%');

	// $(".Bbelia_diff_bfr").text(output(belia_diff_bfr));
	// $(".Bbelia_diff_aft").text(output(belia_diff_aft));
	// $(".Bbelia_diff_bfr_pcnt").text(output(belia_diff_bfr_pcnt)+'%');
	// $(".Bbelia_diff_aft_pcnt").text(output(belia_diff_aft_pcnt)+'%');


	var home_total = window.belia;
	var away_total = Bbelia;
	var home_pcnt = (home_total/(home_total + away_total)) * 100;
	var away_pcnt = (away_total/(home_total + away_total)) * 100;

	var Dpiedata = [
		{value: away_total, color:"#103636"},
		{value: home_total, color: "#108F97"}
	];

	pie(Dpiedata, 'Dpie');

	$(".home_diff .Dbelia_diff_total").text(output(home_total));
	$(".away_diff .Dbelia_diff_total").text(output(away_total));
	$(".home_diff .Dbelia_diff_pcnt").text(output(home_pcnt)+'%');
	$(".away_diff .Dbelia_diff_pcnt").text(output(away_pcnt)+'%');

	// if(belia_diff_bfr < 0){
	// 	$('.away .Bbelia_diff_bfr_pcnt').removeClass('up').addClass('down');
	// } else {
	// 	$('.away .Bbelia_diff_bfr_pcnt').removeClass('down').addClass('up');
	// }
	// if(belia_diff_aft < 0){
	// 	$('.away .Bbelia_diff_aft_pcnt').removeClass('up').addClass('down');
	// } else {
	// 	$('.away .Bbelia_diff_aft_pcnt').removeClass('down').addClass('up');
	// }	
}

function pushSparklines(stats_set, getdata, min_year, thisyear){
	window.labels;
	window.data1;
	window.data2;

	var newData = new Array;

	$.each(labels, function(key,val){
		newData[key] = {district: val, data1: data1[key], data2: data2[key], state: 'Johor'};
		// newData[key]= [{data: data1[key}, {data: data2[key]}, {district: val}, {state: 'Johor'}];
	});
	newData.sort(function(a, b){ return b.data2-a.data2 });



	console.log(newData[1]);



	var thisdata = newData[1];

	var Bbelia = thisdata['data2'];
	var BPenduduk = thisdata['data1'];
	// var index = (typeof thisyear != 'undefined')? ((thisyear-window.min_year)): (window.year-window.min_year);

	var piedata = [
		{value: (BPenduduk-Bbelia), color: "#1c638d"},
		{value: Bbelia, color:"#4DA3D5"}
	];

	pie(piedata, 'cpie');

	var title = thisdata['district'];
	$('.thatdistrict').text(title);

	// var belia = Bbelia[index];
	// var belia_bfr = Bbelia[index-1];
	// var belia_aft = Bbelia[index+1];

	// var belia_diff_bfr = veriNum(belia_bfr-belia);
	// var belia_diff_aft = veriNum(belia_aft-belia);
	// var belia_diff_bfr_pcnt = veriNum(((belia_bfr/belia) * 100)-100);
	// var belia_diff_aft_pcnt = veriNum(((belia_aft/belia) * 100)-100);

	var belia_diff_pcnt = (Bbelia/BPenduduk) * 100;

	$(".Bbelia_total").text(output(Bbelia));
	$(".Bpop_total").text(output(BPenduduk));
	$(".Bbelia_pcnt").text(output(belia_diff_pcnt,0)+'%');
	$(".Bpop_pcnt").text(output((100 - belia_diff_pcnt),0)+'%');

	// $(".Bbelia_diff_bfr").text(output(belia_diff_bfr));
	// $(".Bbelia_diff_aft").text(output(belia_diff_aft));
	// $(".Bbelia_diff_bfr_pcnt").text(output(belia_diff_bfr_pcnt)+'%');
	// $(".Bbelia_diff_aft_pcnt").text(output(belia_diff_aft_pcnt)+'%');


	var home_total = window.belia;
	var away_total = Bbelia;
	var home_pcnt = (home_total/(home_total + away_total)) * 100;
	var away_pcnt = (away_total/(home_total + away_total)) * 100;

	var Dpiedata = [
		{value: away_total, color:"#103636"},
		{value: home_total, color: "#108F97"}
	];

	pie(Dpiedata, 'Dpie');

	$(".home_diff .Dbelia_diff_total").text(output(home_total));
	$(".away_diff .Dbelia_diff_total").text(output(away_total));
	$(".home_diff .Dbelia_diff_pcnt").text(output(home_pcnt)+'%');
	$(".away_diff .Dbelia_diff_pcnt").text(output(away_pcnt)+'%');

	// if(belia_diff_bfr < 0){
	// 	$('.away .Bbelia_diff_bfr_pcnt').removeClass('up').addClass('down');
	// } else {
	// 	$('.away .Bbelia_diff_bfr_pcnt').removeClass('down').addClass('up');
	// }
	// if(belia_diff_aft < 0){
	// 	$('.away .Bbelia_diff_aft_pcnt').removeClass('up').addClass('down');
	// } else {
	// 	$('.away .Bbelia_diff_aft_pcnt').removeClass('down').addClass('up');
	// }	
}

function veriNum(z){
	return (z != 'Infinity')? z: 0;
}

function summary(stats_set,datas,val){
	bar(stats_set,datas,val);
	pushSparklines(window.stats_set, datas, window.min_year, val);

	if(typeof val != 'undefined'){
		$('.widget_tahun').html(val);
		$('.widget_tahun_prev').html(val-1);
		$('.widget_tahun_aft').html(val+1);		
	}
}

function getYearBfr(){
	$('.getYearBfr').tooltip({ content: "Awesome title!" });
}
function getYearAft(){
	$('.getYearAft').tooltip({ content: "Awesome title!" });

}

