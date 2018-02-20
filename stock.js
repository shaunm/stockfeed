$(document).ready(function() {
	console.log("ready!");
	ticker = location.search.split('t=')[1];
	summary(ticker);
	times = quote(ticker);
	financials(ticker);
	refresher = setInterval(function() {
		
			quote(ticker);
		
	}, 1500);
	rss(ticker);
});

function summary(ticker) {
	var statUrl = 'https://api.iextrading.com/1.0/stock/' + ticker + '/stats';
	$.getJSON(statUrl, function(data) {
		$("#shortInterest").text(data.shortInterest.toLocaleString('en-US'));
		$("#dividendYield").text(data.dividendYield + "%");
		$("#institutionPercent").text(data.institutionPercent + "%");
		$("#beta").text(data.beta);
		image = 'https://storage.googleapis.com/iex/api/logos/' + ticker.toUpperCase() + '.png'
		$("#companyImage").attr("src", image);
		$("#chart").attr("src", "https://finviz.com/chart.ashx?t=" + ticker.toUpperCase() + "&ty=c&ta=0&p=d&s=l");
	});
	var descUrl = 'https://api.iextrading.com/1.0/stock/' + ticker + '/company';
	$.getJSON(descUrl, function(data) {
		$("#sector").text(data.sector);
		$("#industry").text(data.industry);
		$("#description").text(data.description);
		$("#url").text(data.website);
		$("#url").attr("href", data.website)
	});
}

function quote(ticker) {
	times = [];
	var statUrl = 'https://api.iextrading.com/1.0/stock/' + ticker + '/quote?displayPercent=true';
	$.getJSON(statUrl, function(data) {
		console.log("refresh")
		$("#price").text(data.latestPrice.toLocaleString('en-US'));
		$("#symbol").text('(' + data.symbol + ')')
		$("#companyName").text(data.companyName);
		$("#change").text(data.change);
		$("#changePercent").text('(' + data.changePercent.toLocaleString('en-US') + '%)');
		$("#exchange").text(data.primaryExchange);
		$("#latestSource").text(data.latestSource);
		$("#latestTime").text(data.latestTime);
		$("#open").text(data.open);
		$("#high").text(data.high);
		$("#low").text(data.low);
		$("#marketCap").text(data.marketCap.toLocaleString('en-US'));
		$("#avgTotalVolume").text(data.avgTotalVolume.toLocaleString('en-US'));
		$("#latestVolume").text(data.latestVolume.toLocaleString('en-US'));
		$("#week52High").text(data.week52High);
		$("#week52Low").text(data.week52Low);
		if (Math.sign(data.change) == 1) {
			$("#changePercent").css('color', '#4CAF50');
			$("#change").css('color', '#4CAF50');
		} else if (Math.sign(data.change) == -1) {
			$("#changePercent").css('color', '#F44336');
			$("#change").css('color', '#F44336');
		}
		times.push(data.openTime);
		times.push(data.closeTime);
	});
	return times;
}

function financials(ticker) {
	var statUrl = 'https://api.iextrading.com/1.0/stock/' + ticker + '/financials';
	$.getJSON(statUrl, function(data) {
		data = data.financials;
		for (var i = 0; i < data.length; i++) {
			entry = data[i];
			console.log(entry);
			column = ("<td><p><b>" + entry.reportDate + "<\/b><\/p> <p>" + entry.grossProfit + "<\/p> <p>" + entry.costOfRevenue + "<\/p> <p>" + entry.operatingRevenue + "<\/p> <p>" + entry.totalRevenue + "<\/p> <p>" + entry.operatingIncome + "<\/p> <p>" + entry.netIncome + "<\/p> <p>" + entry.researchAndDevelopment + "<\/p> <p>" + entry.operatingExpense + "<\/p> <p><b>---<\/b><\/p> <p> <p>" + entry.currentAssets + "<\/p> <p>" + entry.totalAssets + "<\/p> <p>" + entry.totalLiabilities + "<\/p> <p>" + entry.currentCash + "<\/p> <p>" + entry.currentDebt + "<\/p> <p>" + entry.totalCash + "<\/p> <p>" + entry.totalDebt + "<\/p> <p>" + entry.shareholderEquity + "<\/p> <p><b>---<\/b><\/p> <p>" + entry.cashChange + "<\/p> <p>" + entry.cashFlow + "<\/p> <p>" + entry.operatingGainsLosses + "<\/p><td>");
			$("#finRow").append(column);
		}
	});
}

function rss(ticker){
	var url = "//whatever-origin.herokuapp.com/get?url=" + encodeURIComponent("http://finance.google.com/finance/company_news?q="+ ticker +"&output=rss")
	$.getJSON(url, function(data){
		data = data.contents;
		var $XML = $(data);
		$XML.find("item").each(function() {
				var $this = $(this),
						item = {
								title:       $this.find("title").text(),
								link:        $this.find("link").text(),
								pubDate:     $this.find("pubDate").text(),
						};
				entry = '<a href="'+ item.link + '"><span class="rss-title>'+item.title+'</span></a><span class="grey-text">'+ pubDate + '</span></br>';
				$("#feed").append(entry);

		});

	});

}
/*
TODO:
	Similar Stocks:
	https://api.iextrading.com/1.0/stock/aapl/peers

	Dividends:
	https://api.iextrading.com/1.0/stock/aapl/dividends/5y

	Previous Split(5y):
	https://api.iextrading.com/1.0/stock/aapl/splits/5y
*/
