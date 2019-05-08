//<!--XXXXXXXXXXXXXXXXXXXXXXXXXX-->
//<!--Copyright 2016 Matt Bognar-->
//<!--XXXXXXXXXXXXXXXXXXXXXXXXXXX-->

//<!--Written by:-->
//<!--Matt Bognar-->
//<!--Department of Statistics and Actuarial Science-->
//<!--University of Iowa-->
//<!--Iowa City, IA 52242-->
//<!--This software may not be re-distributed without the authors consent.-->


function chisqDistribution (df) 
{
	this.df=eval(df);
	this.mean=mean;
	this.variance=variance;
	this.sd=sd;
	this.pdf=pdf;
	this.cdf=cdf;
	this.percentile=percentile;
	this.printMoments=printMoments;
	this.printPdf=printPdf;


	function mean() 
	{
 		return jStat.chisquare.mean(this.df);
	}


	function variance() 
	{
		return jStat.chisquare.variance(this.df);
	}


	function sd() 
	{
		return Math.sqrt(this.variance());
	}


	function pdf(x)
	{
  		return jStat.chisquare.pdf(x,this.df);
	}


	function cdf(x) 
	{ 
		x=eval(x);

		if(!isNaN(x))
		{
			return jStat.chisquare.cdf(x,this.df);
		}

		return '';
	}


	function percentile(p)
	{
		p = eval(p);

		if(!isNaN(p)) return jStat.chisquare.inv(p,this.df);
// 		if(!isNaN(p)) return AChiSq(1-p, this.df);

		return '';
	}


	function printMoments() 
	{
		var txt="";

		txt += '$ \\mu = E(X) = ' + roundNumber(this.mean(),3) + '\\hspace{0.5cm}$';
		txt += '$ \\sigma = SD(X) = ' + roundNumber(this.sd(),3) + '\\hspace{0.5cm}$';
		txt += '$ \\sigma^2 = Var(X) = ' + roundNumber(this.variance(),3) + '$';

		document.getElementById("moments").innerHTML=txt; 
		MathJax.Hub.Queue(["Typeset",MathJax.Hub,"moments"]); 
	}


	function printPdf(x, direction) {

		var data = new google.visualization.DataTable();

		// Create the data table.
		data.addColumn('number', 'x');
		data.addColumn('number', 'f(x)');
		data.addColumn('number', 'f(x)');
		data.addColumn('number', 'f(x)');

		x = eval(x);

		var lo = Math.max(0, this.mean() - 4*this.sd());
		var hi = this.mean() + 4*this.sd();

//		var lo = this.percentile(0.0001);
//		var hi = this.percentile(0.9999);

		data.addRows(401);

		var i, grd;
		for(i=0; i<401; i++)
		{
			grd = lo + (hi-lo)*i/400;
			data.setCell(i, 0, grd);
 			data.setCell(i, 1, this.pdf(grd));

			if(!isNaN(x)) {
				if(grd < x) {
					if(direction == 'less')
						data.setCell(i, 2, this.pdf(grd));
				}
				else {
					if(direction == 'greater')
						data.setCell(i, 2, this.pdf(grd));
				}
			}

			var xdelta = (hi-lo)/140;
			if(grd > x-xdelta && grd < x+xdelta) {
				data.setCell(i, 3, this.pdf(grd));
			}
		}

		var options = {
			backgroundColor:'transparent',
			areaOpacity: 0,
			hAxis: {title: 'x',  titleTextStyle: {color: '#000000'}, 
				min: lo,
				max: hi,
				gridlines: {color: 'transparent', count: 7},
				baseline: lo},
			vAxis: {title: 'f(x)',  titleTextStyle: {color: '#000000'}, 
				gridlines: {count: 5, color: 'transparent'},
				viewWindow: {min: 0},
				viewWindowMode: 'explicit'},
			legend: {position: 'none'},
			series: {0:{color: 'black', areaOpacity: 0, lineWidth: 1.2}, 
				1:{color: '#e7b0b0', areaOpacity: 1, lineWidth: 0},
				2:{color: '#83aaf1', areaOpacity: 1, lineWidth: 0},
				3:{color: '#E8E8E8', areaOpacity: 1, lineWidth: 0}},
			tooltip: {trigger: 'none'}
		};

		var chart = new google.visualization.AreaChart(document.getElementById('pdfPlot'));
		chart.draw(data, options);
	}

}



