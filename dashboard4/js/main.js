'use strict';
var gainOrLossChart = dc.rowChart('#gain-loss-chart');
var fluctuationChart = dc.barChart('#fluctuation-chart');
var quarterChart = dc.pieChart('#quarter-chart');
var dayOfWeekChart = dc.rowChart('#day-of-week-chart');
var volumeChart = dc.barChart('#monthly-volume-chart');
var highlowChart = dc.barChart('#high-low-chart');
var nasdaqCount = dc.dataCount('.dc-data-count');
var nasdaqTable = dc.dataTable('.dc-data-table');


d3.csv('data.csv', function (data) {
    // Since its a csv file we need to format the data a bit.
    var dateFormat = d3.time.format('%m/%d/%Y');
    var numberFormat = d3.format('.2f');

    data.forEach(function (d) {
        d.dd = dateFormat.parse(d.date);
        d.month = d3.time.month(d.dd); // pre-calculate month for better performance
        d.close = +d.close; // coerce to number
        d.open = +d.open;
    });

    //### Create Crossfilter Dimensions and Groups

    //See the [crossfilter API](https://github.com/square/crossfilter/wiki/API-Reference) for reference.
    var ndx = crossfilter(data);
    var all = ndx.groupAll();
   
    // Dimension by full date
    var dateDimension = ndx.dimension(function (d) { return d.dd;  });

    // Dimension by month
    var moveMonths = ndx.dimension(function (d) { return d.month;});
    // Group by total movement within month
    var monthlyMoveGroup = moveMonths.group().reduceSum(function (d) {return Math.abs(d.close - d.open); });
    // Group by total volume within move, and scale down result
    var volumeByMonthGroup = moveMonths.group().reduceSum(function (d) {
        return d.volume / 500000;
    });

    // Create categorical dimension
    var gainOrLoss = ndx.dimension(function (d) {
        return d.open > d.close ? 'Loss' : 'Gain';
    });
    // Produce counts records in the dimension
    var gainOrLossGroup = gainOrLoss.group();

    // Determine a histogram of percent changes
    var fluctuation = ndx.dimension(function (d) {
        return Math.round((d.close - d.open) / d.open * 100);
    });
    var fluctuationGroup = fluctuation.group();

    var highlowfluctuation = ndx.dimension(function (d){
        return Math.round((d.high - d.low) / d.high * 100);
    })

    var highlowfluctuationGroup = highlowfluctuation.group();
    // Summarize volume by quarter
    var quarter = ndx.dimension(function (d) {
        var month = d.dd.getMonth();
        if (month <= 2) {
            return 'Q1';
        } else if (month > 2 && month <= 5) {
            return 'Q2';
        } else if (month > 5 && month <= 8) {
            return 'Q3';
        } else {
            return 'Q4';
        }
    });
    var quarterGroup = quarter.group().reduceSum(function (d) {
        return d.volume/50000;
    });

    // Counts per weekday
    var dayOfWeek = ndx.dimension(function (d) {
        var day = d.dd.getDay();
        var name = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
        return day + '.' + name[day];
    });
    var dayOfWeekGroup = dayOfWeek.group();



    gainOrLossChart /* dc.pieChart('#gain-loss-chart', 'chartGroup') */
        .width(200)
        .height(200)
        //.radius(80)
        .dimension(gainOrLoss)
        .group(gainOrLossGroup)
        .renderLabel(true)
        .elasticX(true)
        .xAxis().ticks(4);

   

    quarterChart /* dc.pieChart('#quarter-chart', 'chartGroup') */
        .width(200)
        .height(200)
        .radius(80)
        .innerRadius(30)
        .dimension(quarter)
        .group(quarterGroup)
        .renderLabel(true)
        .transitionDuration(400);

    
    dayOfWeekChart /* dc.rowChart('#day-of-week-chart', 'chartGroup') */
        .width(200)
        .height(200)
        .margins({top: 20, left: 10, right: 10, bottom: 20})
        .group(dayOfWeekGroup)
        .dimension(dayOfWeek)
        // Assign colors to each value in the x scale domain
        .ordinalColors(['#3182bd', '#6baed6', '#9ecae1', '#c6dbef', '#dadaeb'])
        .label(function (d) {
            return d.key.split('.')[1];
        })
        // Title sets the row text
        .title(function (d) {
            return d.value;
        })
        .elasticX(true)
        .xAxis().ticks(4);

  
    fluctuationChart /* dc.barChart('#volume-month-chart', 'chartGroup') */
        .width(420)
        .height(200)
        .margins({top: 10, right: 50, bottom: 30, left: 40})
        .dimension(fluctuation)
        .group(fluctuationGroup)
        .elasticY(true)
        // (_optional_) whether bar should be center to its x value. Not needed for ordinal chart, `default=false`
        .centerBar(true)
        // (_optional_) set gap between bars manually in px, `default=2`
        .gap(1)
        // (_optional_) set filter brush rounding
        .round(dc.round.floor)
        .alwaysUseRounding(true)
        .x(d3.scale.linear().domain([-25, 25]))
        .renderHorizontalGridLines(true)
        // Customize the filter displayed in the control span
        .filterPrinter(function (filters) {
            var filter = filters[0], s = '';
            s += numberFormat(filter[0]) + '% -> ' + numberFormat(filter[1]) + '%';
            return s;
        });


    highlowChart /* dc.barChart('#volume-month-chart', 'chartGroup') */
        .width(420)
        .height(200)
        .margins({top: 10, right: 50, bottom: 30, left: 40})
        .dimension(highlowfluctuation)
        .group(highlowfluctuationGroup)
        .elasticY(true)
        // (_optional_) whether bar should be center to its x value. Not needed for ordinal chart, `default=false`
        .centerBar(true)
        // (_optional_) set gap between bars manually in px, `default=2`
        .gap(1)
        // (_optional_) set filter brush rounding
        .round(dc.round.floor)
        .alwaysUseRounding(true)
        .x(d3.scale.linear().domain([-25, 25]))
        .renderHorizontalGridLines(true)
        // Customize the filter displayed in the control span
        .filterPrinter(function (filters) {
            var filter = filters[0], s = '';
            s += numberFormat(filter[0]) + '% -> ' + numberFormat(filter[1]) + '%';
            return s;
        });

    // Customize axes
    fluctuationChart.xAxis().tickFormat(
        function (v) { return v + '%'; });
    fluctuationChart.yAxis().ticks(5);

    volumeChart.width(990) /* dc.barChart('#monthly-volume-chart', 'chartGroup'); */
        .height(200)
        .margins({top: 0, right: 50, bottom: 20, left: 40})
        .dimension(moveMonths)
        .group(volumeByMonthGroup)
        .centerBar(true)
        .gap(1)
        .x(d3.time.scale().domain([new Date(1985, 0, 1), new Date(2012, 11, 31)]))
        .round(d3.time.month.round)
        .alwaysUseRounding(true)
        .xUnits(d3.time.months);


    nasdaqCount /* dc.dataCount('.dc-data-count', 'chartGroup'); */
        .dimension(ndx)
        .group(all)
        .html({
            some: '<strong>%filter-count</strong> selected out of <strong>%total-count</strong> records' +
                ' | <a href=\'javascript:dc.filterAll(); dc.renderAll();\'\'>Reset All</a>',
            all: 'All records selected. Please click on the graph to apply filters.'
        });

    nasdaqTable /* dc.dataTable('.dc-data-table', 'chartGroup') */
        .dimension(dateDimension)
        .group(function (d) {
            var format = d3.format('02d');
            return d.dd.getFullYear() + '/' + format((d.dd.getMonth() + 1));
        })
        .size(30)
        .columns([
            'date',
            'open',
            'close',
            'high',
            'low',
            {
                label: 'Change',
                format: function (d) {
                    return numberFormat(d.close - d.open);
                }
            },
            'volume'
        ])
        .sortBy(function (d) {
            return d.dd;
        })
        .order(d3.ascending)
        .on('renderlet', function (table) {
            table.selectAll('.dc-table-group').classed('info', true);
        });

    dc.renderAll();
    

});


