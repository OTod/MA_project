function finance_visual(result) {
    console.log(result);
    var graph = [

    ];
    result.forEach(function (order) {
        console.log(order.time);
        if (order.time) {
            var time = new Date(order.time);
            console.log(month_func(time.getMonth()));
            if(graph.length >0){
            graph.forEach(function(month){
                console.log(month.label);
                if(month.label == month_func(time.getMonth())){
                    month.y += order.total_price;
                }else{
                    graph.push({
                        label: month_func(time.getMonth()),
                        y:order.total_price
                    })
                }
            })}else{
                graph.push({
                    label: month_func(time.getMonth()),
                    y:order.total_price
                })
            }
        }

    });
    console.log(graph);
    function month_func(time_month) {
        switch (time_month) {
            case 0: return 'January'; break;
            case 1: return 'February'; break;
            case 2: return 'March'; break;
            case 3: return 'April'; break;
            case 4: return 'May'; break;
            case 5: return 'June'; break;
            case 6: return 'July'; break;
            case 7: return 'August'; break;
            case 8: return 'September'; break;
            case 9: return 'October'; break;
            case 10: return 'November'; break;
            case 11: return 'December'; break;
        }
    }
    var total_orders = document.getElementById('total_orders');
    total_orders.innerText = "Overall amount of orders is - " + Object.keys(result).length;
    var total_profit = document.getElementById('total_profit');
    function profit(result){
        var sum = 0;
        result.forEach(function(item){
            console.log(item.total_price);
            console.log(item);
            
            sum +=item.total_price;
            
        })
        return sum;
    }
    total_profit.innerText = "Overall profit is - " + profit(result);

    var chart = new CanvasJS.Chart("chartContainer", {
        title: {
            text: "Gross profit, per month"
        },
        data: [
            {
                // Change type to "doughnut", "line", "splineArea", etc.
                type: "area",
                color: "rgba(0,75,141,0.7)",
                dataPoints: graph
            }
        ]
    });
    chart.render();

}
