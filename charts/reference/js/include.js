$("#search.input").focus(function(e) {
	console.log("focus", e.target.defaultValue, e.target.value)
    if (e.target.value == e.target.defaultValue){
    	e.target.value = '';
	}
}).blur(function(e) {
	console.log("blur", e.target.defaultValue, e.target.value)
    if (e.target.value == ''){
        e.target.value = e.target.defaultValue;
    }
});

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

function indicator(x) {
	x = output(x,0);
	var style = '';
	if (x >= 0 && x <= 25) {
		style = 'low';
	} else if (x >= 26 && x <= 50) {
		style = 'medlow';
	} else if (x >= 51 && x <= 75) {
		style = 'medhigh';
	} else if (x >= 76 && x <= 100) {
		style = 'high';
	}
	return style;
}

function tableData(data){
	window.tableData = {fields:[], total:[], s:[], subfields:[], subfieldTH:[], fieldTH: []};
	var subtotal;

	var fullpercentage = '<div class="tddiv pcnt_container fullpercentage"><div class="tddiv data">${ fullpcnt }%</div><div class="tddiv percentage aleft" id="Ldiffpct_${ id }" style="width: ${ fullpcnt }%"></div></div>';
	var name = '<div class="tddiv title_container" id="item_${ id }">${ title }</div><span class="hide">@@${ id }</span><div class="info_container" id="ic_${ id }"><div class="info"></div></div>';

	var id = 0;
	total = {sum: [], fieldId: [], fieldName: []};
	$.each(data['d'], function(k,v){
		var i = 0, j = 0;
		td = {}, th = [], diff = [], s = {};
		td['title'] = v['a']['t']; // data_0
		td['id'] = +id;

		th.push({field: 'title', title: 'Title', template: kendo.template(name)});

		tableData['subfields'].push(data['d'][k]['s'][1]);

		$.each(v['s'], function(k2,v2){
			$.each(v2, function(k3,v3){ //  0 = discharge, 1 = death
				if(typeof v3[0][0] == 'undefined'){
				// console.log([k,k3],v3, [i,v3.sum()])
					td['data_'+i++] = v3.sum(); // data_1, data_2
					s[k3] = v3.sum(); // data_1, data_2
					diff[k3] = v3.sum();
					if(typeof total['sum'][k3] == 'undefined'){ total['sum'][k3] = []; }
					th.push({field: 'data_'+k3, title: data['h'][0][k3], template: kendo.template(rank(id,k3))});
					total['sum'][k3][id] = v3.sum();
				}
			});
		});

		max = (diff.max() == 0)? 1: diff.max();
		subtotal = diff.sum();
		diffPcnt = +output(((max/ subtotal)* 100),2);
		maxPcnt = (diffPcnt == Number.POSITIVE_INFINITY || diffPcnt == Number.NEGATIVE_INFINITY)? 0: diffPcnt;

		td['fullpcnt'] = maxPcnt;
		th.push({field: 'data_'+j++, title: 'Percentage', template: kendo.template(fullpercentage)});
		tableData['fields'].push(td);
		tableData['s'].push(s);
		id++;
	});

	$.each(tableData['fields'], function(k,v){
		$.each(total['sum'], function(k2,v2){
			temp = tableData['s'][k][k2];
			subtotal = v2.max();
			temp = (temp == 0)? 1: temp;
			diffPcnt = +output(((temp/ subtotal)* 100),0);
			tableData['fields'][k]['pcnt_'+k2] = diffPcnt;
		});
	});

	tableData['subfieldTH'] = data['h'];
	tableData['fieldTH']= data['e'];

	fields = [];
	$.each(tableData['fields'][0], function(key, val){
		fields.push({type: typeof val})
	});

	summarize(tableData['fields']);

	var grid = $("#compare").kendoGrid({
	    dataSource: {
	        data: tableData['fields'],
			autoBind: false,
	        schema: {
				model: {
					id: "id",
				    fields: fields
				}
			}
	    },
		change: subInfo,
		dataBound: onDataBound,
		dataBinding: onDataBinding,
		selectable: "row",
	    sortable:{
            mode: "single",
            allowUnsort: false
        },
        scrollable: false,
	    pageable: false,
	    columns: th
	});

	var autocompleteSymbol = $("#search").kendoAutoComplete({
	    dataTextField: "title",
	    dataValueField: "title",
	    dataSource: tableData['fields'],
	    change: function () {
	    	var filtered;
	        var value = this.value();
	        if (value) {
	            grid.data("kendoGrid").dataSource.filter({ field: "title", operator: "contains", value: value });
	        } else {
				grid.data("kendoGrid").dataSource.filter({});
	        }
		    filtered = grid.data("kendoGrid")["_data"];
	    	if(filtered.length){
				summarize(filtered);
				resetRank(filtered);
				grid.data("kendoGrid").dataSource.filter({ field: "title", operator: "contains", value: value });
	    	}   
	    }
	});
}

function rank(id, val){
	return '<div class="tddiv pcnt_container"><div class="tddiv data">${ data_'+val+' }</div><div class="tddiv percentage ${ pcnt_'+val+' } aleft" id="Lpcnt_" style="width: ${ pcnt_'+val+' }%"></div></div>';
}

function summarize(data){
	window.left = Array();
	window.right = Array();

	$.each(data, function(key, val){
		window.left[key] = (check(val['t']))? val['t'][0]['v'] : val['data_0'];
		window.right[key] = (check(val['t']))? val['t'][1]['v'] : val['data_1'];
    });

	$('.Bmean').text(output(window.left.mean(),2));
	$('.Bmode').text(output(window.left.sum(),0));
	$('.Bmedian').text(window.left.median());
	$('.Bmin').text(output(window.left.min(),0));
	$('.Bmax').text(output(window.left.max(),0));

	$('.Pmean').text(output(window.right.mean(),2));
	$('.Pmode').text(output(window.right.sum(),0));
	$('.Pmedian').text(window.right.median());
	$('.Pmin').text(output(window.right.min(),0));
	$('.Pmax').text(output(window.right.max(),0));
}

function resetRank(data){
	var left, right, Lrank, Rrank, total;
	var Lmax = window.left.max();
	var Rmax = window.right.max();
	$.each(data, function(key, val){
		left = (check(val['t']))? val['t'][0]['v'] : val['data_0'];
		right = (check(val['t']))? val['t'][1]['v'] : val['data_1'];
		Lrank = (left/ Lmax * 100);
		Rrank = (right/ Rmax * 100);
		data[key]['Lrank'] = Lrank;
		data[key]['Rrank'] = Rrank;
	});
}


function subInfo(arg) {
	$('.info').html('');
    var selected = $.map(this.select(), function(item) {
    	var el = $(item).html();
    	var result;
    	$(el, "td").each(function(index){
    		if(index == 0){
    			result = $(this).text().split("@@");
// console.log(result)
				var div = $('#ic_'+result[1]);
				var getTable;
				var series1 = Array();
				if(div.hasClass('active')){
					$('*').removeClass('active');
				} else {
					getTable = $(pushTable(result));
					$('.info', div).append(getTable);
					$('*').removeClass('active');
					div.addClass('active');
					$('#item_'+result[1]).addClass('active');
				}
    		}
    	});
    });
    return false;
}

function pushTable(result){
	var data = window.tableData['subfields'][result[1]];
	// console.log(data)

	var table = '<table class="subdata" cellspacing="1" cellpadding="0" width="100%">';

	$.each(tableData['subfieldTH'][1], function(k,v){

		if(k == 0){			
			table += '<tr>';

			$.each(data, function(k2,v2){ // death/ discharge
				table += '<th style="background-color: '+window.seriecolor[0][k2]+';" colspan="'+Object.keys(tableData['subfieldTH'][2]).length+'"><div class="tddiv title_container">'+tableData['subfieldTH'][0][k2]+'</div></th>';
				if(k2 == 0){			
					table += '<th style="background-color:#1c638d;"><div class="tddiv pcnt_container fullpercentage"><div class="tddiv data" style="">'+tableData['fields'][result[1]]['fullpcnt']+'%</div><div style="width:'+tableData['fields'][result[1]]['fullpcnt']+'%" id="Ldiffpct_21" class="tddiv percentage aleft"></div></div></th>';
					column = (Object.keys(v2).length * Object.keys(data).length)+1;
				}
			});

			table += '</tr>';
			table += '<tr>';

			$.each(data, function(k2,v2){
				$.each(tableData['subfieldTH'][2], function(k3,v3){
					table += '<th width="'+(100/column)+'%" class="clearHeader"><div class="tddiv">'+v3+'</div></th>';
				});		
				if(k2 == 0){ table += '<th width="'+(100/column)+'%" class="clearHeader"><div class="tddiv title_container">'+tableData['fieldTH'][1]+'</div></th>'; }
			});

			table += '</tr>';
		}
		table += '<tr>';

		$.each(data, function(k2,v2){ // death/ discharge
			$.each(v2, function(k3, v3){ // gender 
				max = (v3.max() == 0)? 1: v3.max();
				diffPcnt = +output(((v3[k]/ max)* 100),2);
				table += '<td><div class="tddiv pcnt_container"><div class="tddiv data">'+v3[k]+'</div><div style="width: '+diffPcnt+'%" class="tddiv percentage aleft"></div></div></td>';
			});
			if(k2 == 0){ table += '<td><div class="tddiv title_tdcontainer">'+v+'</div></td>'; }
		});

		table += '</tr>';
	});

	i = 0, j = 0;
	table += '<tr>';
	// Subtotal
	$.each(data, function(k,v){
		$.each(v, function(k2,v2){
			table += (i<k)? '<td><div class="tddiv total_tdcontainer">Subtotal</div></td>': '';
			table += '<td><div class="tddiv total_tdcontainer">'+v2.sum()+'</div></td>';
			i = k;
		});
	});
	table += '</tr>';
	table += '<tr>';


	colspan = Object.keys(data[0]).length;
	// Total
	$.each(data, function(k,v){
			table += (j<k)? '<td><div class="tddiv total_tdcontainer">Total</div></td>': '';
			table += '<td colspan="'+colspan+'"><div class="tddiv total_tdcontainer">'+tableData['fields'][result[1]]['data_'+k]+'</div></td>';
		j = k;
	});


	table += '</tr>';


	table += '</table>';
	return table;
}

function calc(data){
	var s = data.sum();
	var r = Array();

	$.each(data, function(key, val){
		r[key] = output(val/s*100,1);
	});
	return r;
}

function check(that){
	if (typeof that == 'undefined'){
		return false;
	} else {
		return true;
	}
}

function unique(array) {
	var unique = {};
	var distinct = [];
	for( var i in array ){
		if( typeof(unique[array[i]]) == "undefined"){
			distinct.push(array[i]);
		}
		unique[array[i]] = 0;
	}
	return distinct;
}

function onDataBound(arg) {
	// console.log("Grid data bound");
}

function onDataBinding(arg) {
	// console.log("Grid data binding");
}

function filterData(data){
	temp = [];
	i = 0;
	$.each(data['d'], function(k,v){
		temp[i++] = v;
	});
	data['d'] = temp;
	// console.log(data['d'][30]['a']['n'], data['d'][30]['s'][1])
	return data;

}

function action(id, data, type, index){
	if(type == 'onload'){
		// Load Table Chart
		var thatdata = filterData(data);
		tableData(thatdata);
	}
}