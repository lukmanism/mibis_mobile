(function() {  
  var app = window.app = window.app || {};
  // var crudServiceBaseUrl = "http://demos.kendoui.com/service";  
  // app.tags = new kendo.data.DataSource({
  //   transport: {
  //     read:  {
  //       url: crudServiceBaseUrl + "/Products",
  //       dataType: "jsonp"
  //     }
  //   }
  // });

  window.loaddata;

  $.ajax({
      async: false,
      url: "../api/", // fetching webservice
      beforeSend: function(xhr) {}
    }).done(function(data) {
      loaddata = data;
  });


  app.reports = ([{
    id: 1, // run loop if multiple
    name: loaddata['t'],
    url: loaddata['n'],
    datas: []
  }]);

  $.each(loaddata['d'], function(k2,v2){
    app.reports[0].datas.push({
      id: k2,
      name: v2['a']['t'],
      url: v2['a']['n'],
      fav: 0
    });
  });
  // console.log(app.reports);

 app.tags = ([
    {"id":1,"name":"Hospitals","url":"hospitals","datas":
      [
        {"id":1,"name":"Pandan Indah","url":"pandan_indah"},
        {"id":2,"name":"Putrajaya","url":"putrajaya"},
        {"id":3,"name":"Seremban","url":"seremban"},
        {"id":4,"name":"Selayang","url":"selayang"},
        {"id":5,"name":"Ampang","url":"ampang"}
      ]
  },
    {"id":2,"name":"Health Related","url":"health_related","datas":
      [
        {"id":1,"name":"Pandan Indah","url":"pandan_indah"},
        {"id":2,"name":"Putrajaya","url":"putrajaya"},
        {"id":3,"name":"Seremban","url":"seremban"},
        {"id":4,"name":"Selayang","url":"selayang"},
        {"id":5,"name":"Ampang","url":"ampang"}
      ]
  },
    {"id":3,"name":"Financial","url":"financial","datas":
      [
        {"id":1,"name":"Pandan Indah","url":"pandan_indah"},
        {"id":2,"name":"Putrajaya","url":"putrajaya"},
        {"id":3,"name":"Seremban","url":"seremban"},
        {"id":4,"name":"Selayang","url":"selayang"},
        {"id":5,"name":"Ampang","url":"ampang"}
      ]
  },
    {"id":4,"name":"KPIs","url":"kpis","datas":
      [
        {"id":1,"name":"Pandan Indah","url":"pandan_indah"},
        {"id":2,"name":"Putrajaya","url":"putrajaya"},
        {"id":3,"name":"Seremban","url":"seremban"},
        {"id":4,"name":"Selayang","url":"selayang"},
        {"id":5,"name":"Ampang","url":"ampang"}
      ]
  },
    {"id":5,"name":"Caused","url":"caused","datas":
      [
        {"id":1,"name":"Pandan Indah","url":"pandan_indah"},
        {"id":2,"name":"Putrajaya","url":"putrajaya"},
        {"id":3,"name":"Seremban","url":"seremban"},
        {"id":4,"name":"Selayang","url":"selayang"},
        {"id":5,"name":"Ampang","url":"ampang"}
      ]
  }
  ]);

  app.fav = [];
  
  app.events = {
    dragging: function(e) {
    console.log('dragging', e)
      var left = e.sender.element.position().left;
      if (left <= 0) {
        e.sender.element.css("left", left + e.touch.x.delta);
      }
    },
    dragend: function(e) {
    console.log('dragend', e)
      var el = e.sender.element;
      // get the listview width 
      var width = $("ul").width();
      // set a threshold of 75% of the width
      var threshold = (width * .25);          
      // if the item is less than 75% of the way across, slide it out
      if (Math.abs(el.position().left) > threshold) {
        kendo.fx(el).slideIn("right").duration(500).reverse();
      } else {
        el.animate({ left: 0 });
      }
    },
    swipe: function(e) {
    console.log('swipe', e)
      if (e.direction === "left") {
        var del = e.sender.element;
        kendo.fx(del).slideIn("right").duration(500).reverse();
      }
    },
    tap: function(e) { // make sure the initial touch wasn't on the archive button
    console.log('tap', e)
      var initial = e.touch.initialTouch;
      var target = e.touch.currentTarget; // if we are tapping outside the archive area, cancel the action
      if (initial === target) { // get the closest item and slide it back in
        var item = e.sender.element.siblings();
        item.css({ left: 0 });
        kendo.fx(item).slideIn("right").duration(500).play();
      } else { // else we are archiving so remove it
        e.sender.element.closest("li").addClass("collapsed");
      }
    }
  };

  $.each(app, function(k,v){
    if(k != 'events'){
      var template = kendo.template($("#listItemNoAction").html());
      var result = template(v); //Execute the template
      $("body").append(result); //Append the result
    }
  });
  new kendo.mobile.Application(document.body, { platform: "ios7" }); 

}());

function loadSubMenus(e) {
  console.log('loadSubMenus')
    e.view.element.find("[data-role=backbutton]").show();
    e.view.element.find("[href=#my-drawer]").hide();
}

function loadDashMenus(e) {
    e.view.element.find("[data-role=backbutton]").hide();
    e.view.element.find("[href=#my-drawer]").show();
}
function loadfav(e){
  loadSubMenus(e);

  $.each($(".listFav"), function(k,v){
    console.log(k,v)

  })
  var listView = $(".listFav").data("kendoMobileListView");
  listView.dataSource.data(app.fav);
  console.log('loadfav')
  // var template = kendo.template($("#favItemTemplate").html());
  // $("#favourites").html(kendo.render(template, app.fav));
}

function loadChart(e){
}

function addToFav(e){
  var fav = $(e.button[0]);
  var newIcon = 'star';
  var oldIcon = 'star-disabled';

  // console.log(app.reports)
  if(fav.attr('data-icon') == oldIcon){
    $('span', fav).removeClass('km-'+oldIcon).addClass('km-'+newIcon);
    fav.attr('data-icon', newIcon);

    $.each(app.reports[0].datas, function(k, v){
      if(v['id'] == fav.attr('data-id')){
        app.reports[0].datas[k]['fav'] = 1;
        app.fav.push(app.reports[0].datas[k]);
      }
    });
  } else {

    $('span', fav).removeClass('km-'+newIcon).addClass('km-'+oldIcon);
    fav.attr('data-icon', oldIcon);

    for (var i = app.fav.length - 1; i >= 0; i--) {
      if(app.fav[i]['id'] == fav.attr('data-id')){
        app.fav.splice(i,1);
      }
    };


  }
}


// setTimeout(function(){
// }, 500);


// reset global drawer instance, for demo purposes
// kendo.mobile.ui.Drawer.current = null;