window.onload = function() {

	//TODO : 
	// Remplacer la chart par mois par nombre de film par mois !

			var dataTournageReal = [];
			var dataTournageArdt = [];
			var dataTypeTournage = [];
			var dataTypeTournage2 = [];
			var dataTournageMois = [];
			var dataDureeTournage = [];
			var dataTournageOrga = [];
			var dataTournageProd = [];
			var line;
			var mois = ["Janvier","Février","Mars","Avril","Mai","Juin","Juillet","Aout","Septembre","Octobre","Novembre","Décembre"];
			var dataLongm=[];
			var dataTelef = [];
			var dataSerie = [];
			var dataSansType = [];
			var dataT= [dataLongm,dataTelef,dataSerie,dataSansType];
			var dataArdtLongM = [];
			var dataArdtSerie = [];
			var dataArdtTelef = [];
			var dataA= [dataArdtTelef,dataArdtSerie,dataArdtLongM]
	
			function numberLine(data){
				line = data.nb;
				document.getElementById("NombreTournage").innerHTML=line;
				
			}
			//  console.log(line); 
			
			$.getJSON('http://localhost:444/nombredeligne',numberLine);
			
			
			
		function ClickReal(e){
			console.log(e);
			console.log(e.dataPoint.label);
			document.getElementById('formLoaderFilter').reset();
			document.getElementById('formLoaderFilter__realisateur').value=e.dataPoint.label;
			document.getElementById('sub').click();
		}
		
		function compareNombres(a, b) {
			return a[0] - b[0];
		}
		 
		function DataTournageReal(data) {
			var result = Object.keys(data.result).map(function(key) { 
				return [data.result[key],(key)]; });

			var tab = result.sort(compareNombres);
			// console.log(tab);
			for (var i = 0; i < tab.length; i++) {
				dataTournageReal.push({
					y : tab[i][0],
					label : tab[i][1]
				});
			}
			// TournageReal.render();
			}
			$.getJSON('http://localhost:444/tournagesparreal',DataTournageReal);
					
			//Nombre de tournages par arrondissement
	
			function DataTournageArdt(data) {
				var result = Object.keys(data.result).map(function(key) { 
					return [data.result[key],(key)]; });

				var tab = result.sort(compareNombres);
				// console.log(tab);
					for (var i = 0; i < tab.length; i++) {
					dataTournageArdt.push({
						y : tab[i][0],
						label : tab[i][1]
					});
				}
					// TournageArrdt.render();
				}
			$.getJSON('http://localhost:444/tournagesparardt',DataTournageArdt);

		
		//Pourcentage de chaque type de tournage
		var TypeTournage = new CanvasJS.Chart("TypeTournage", {
			width:868.01,
			height: 500,
			theme: "light2",
			animationEnabled: true,
			title: {
				text: "Type de Tournage"
			},
			data: [{
				click: ClickType,
				type: "pie",
				startAngle: 240,
				yValueFormatString: "##0.00\"%\"",
				indexLabel: "{label} {y}",
				dataPoints: dataTypeTournage
			}]
		});
		
		function ClickType(e){
			console.log(e);
			console.log(e.dataPoint.label);
			document.getElementById('formLoaderFilter').reset();
			document.getElementById('formLoaderFilter__type_de_tournage').value=e.dataPoint.label;
			document.getElementById('sub').click();
		}
		
		function DataTypeTournage(data) {
			var temp = (Object.getOwnPropertyNames(data.result))
				for (var i = 0; i < data.taille; i++) {
					dataTypeTournage.push({
						y: (data.result[temp[i]]/line)*100,
						label : temp[i]
					});
				}
				TypeTournage.render();
			}
			$.getJSON('http://localhost:444/tournagespartype',DataTypeTournage);
	
//Partie correspondant à la chart Tournage par mois par les stackedColumn
		var TournageParMois = new CanvasJS.Chart("TournageMois", {
			width:868.01,
			height: 500,
			animationEnabled: true,
			theme: "light2",
			title:{
				text: "Nombre de tournage par mois"
			},
			axisX: {
				interval: 1,
				intervalType: "month"
				},
			axisY:{
				includeZero: false
			},
			toolTip: {
				shared: true,
				content: toolTipContent
			},
			data: [{
				click: ClickMois, 
				type: "stackedColumn",
				showInLegend: true,
				color: "green",
				name: "LONG METRAGE",
				dataPoints: dataLongm
				},
				{        
					click: ClickMois,
					type: "stackedColumn",
					showInLegend: true,
					name: "TELEFILM",
					color: "red",
					dataPoints: dataTelef
				},
				{        
					click: ClickMois,
					type: "stackedColumn",
					showInLegend: true,
					name: "SERIE TELEVISEE",
					color: "blue",
					dataPoints: dataSerie
				}]
		});

//Récupération des données pour la chart Tournage par mois par type	
	function DataTypeParMois(data){
		var temp = (Object.getOwnPropertyNames(data));
		for (var i=0;i<temp.length;i++){
			var result = temp[i];
			var temp2 = (Object.getOwnPropertyNames(data[result]));
			for (j=0;j<temp2.length;j++){
				dataT[i].push({
					y:data[result][temp2[j]],
					label: mois[j]
					});
			}
			                       
			}
		TournageParMois.render();
		}
	
	$.getJSON('http://localhost:444/tournagesparmoispartype', DataTypeParMois)	
	

		function ClickMois(e){
				console.log(e);
				console.log(e.dataPoint.label);
				console.log(e.dataSeries.name);
				var mois = e.dataPoint.x + 1;
				var maxDay= new Date(2016,mois,0).getDate();
				if (mois<10){
					var debut="2016-0"+mois+"-01";
					var fin="2016-0"+mois+"-"+maxDay;
				}
				else{
					var debut="2016-"+mois+"-01";
					var fin="2016-"+mois+"-"+maxDay;
				}
				document.getElementById('formLoaderFilter').reset();
				document.getElementById('formLoaderFilter__type_de_tournage').value=e.dataSeries.name;
				document.getElementById('formLoaderFilter__date_debut').value=debut;
				document.getElementById('formLoaderFilter__date_fin').value=fin;
				document.getElementById('sub').click();
			}
			
		function toolTipContent(e) {
			var str = "";
			var total = 0;
			var str2, str3;
			for (var i = 0; i < e.entries.length; i++){
				var  str1 = "<span style= \"color:"+e.entries[i].dataSeries.color + "\"> "+e.entries[i].dataSeries.name+"</span>: <strong>"+e.entries[i].dataPoint.y+"</strong> Tournages <br/>";
				total = e.entries[i].dataPoint.y + total;
				str = str.concat(str1);
			}
			str2 = "<span style = \"color:DodgerBlue;\"><strong>"+mois[e.entries[0].dataPoint.x]+"</strong></span><br/>";
			total = Math.round(total * 100) / 100;
			str3 = "<span style = \"color:Tomato\">Total:</span><strong>"+total+"</strong> Tournages<br/>";
			return (str2.concat(str)).concat(str3);
		}
	
//Récupération des données pour la chart Tournage par Mois
	function DataTournageMois(data) {
			var temp = (Object.getOwnPropertyNames(data.result))
				for (var i = 0; i < 12; i++) {
					dataTournageMois.push({
						y: data.result[temp[i]],
						label : mois[i]
					});
				}
				
			}
			$.getJSON('http://localhost:444/tournagesparmois',DataTournageMois);

//Partie correspondant au chart de la durée des tournages
		var DureeTournage = new CanvasJS.Chart("TournageDuree", {
			width:868.01,
			height: 500,
			animationEnabled: true, 
			zoomEnabled: true,
			title:{
				text: "Durée des tournages par nombre de jours"
			},
			axisY: {
				title: "Nombre de tournage",
				valueFormatString: "#",
			},
			axisX: {
				title : "Nombre de Jours",
				valueFormatString: "#",
			},
			data: [{
				click:ClickDuree,
				type: "column",
				color: "rgba(54,158,173,.7)",
				markerSize: 5,
				xValueFormatString: "YYYY",
				yValueFormatString: "# tournages",
				dataPoints: dataDureeTournage
			}]
			});

			var dataDuree2=[];	
			
			function ClickDuree(e){
				//console.log(e);
				var response = (dataDuree2[e.dataPoint.x]);
				console.log(response);
				loadPoint(response);
			}

			function DataDureeTournage(data) {
			var temp = (Object.getOwnPropertyNames(data.result))
				for (var i = 0; i < temp.length; i++) {
					if (temp[i]==6){
						dataDureeTournage.push({
							y : data.result[temp[i]],
							label : temp[i]+"+"
					});
					}
					else{
						dataDureeTournage.push({
							y : data.result[temp[i]],
							label : temp[i]
					});
					}
				}
				DureeTournage.render();
			}
			$.getJSON('http://localhost:444/dureepartournage',DataDureeTournage);
			
			function DataDureeTournage2(data) {
			var temp = (Object.getOwnPropertyNames(data.listTournage));
				console.log(temp);
				console.log(data.listTournage[5]);
				for(var i = 0; i< data.listTournage.length;i++){
					dataDuree2.push(data.listTournage[i]);;
				}
			}
			$.getJSON('http://localhost:444/dureepartournage2',DataDureeTournage2);

			
			
//Récupération des données pour la chart Tournage par organisme
		function DataTournageOrga(data) {
			var result = Object.keys(data.result).map(function(key) { 
				return [data.result[key],(key)]; });

			var tab = result.sort(compareNombres);
			// console.log(tab);
				for (var i = 0; i < tab.length; i++) {
				dataTournageOrga.push({
					y : tab[i][0],
					label : tab[i][1]
				});
			}
			}
			$.getJSON('http://localhost:444/tournagesparorga',DataTournageOrga);

//Récupération des données pour la chart Tournage par production
		function DataTournageProd(data) {
			var result = Object.keys(data.result).map(function(key) { 
				return [data.result[key],(key)]; });

			var tab = result.sort(compareNombres);
			// console.log(tab);
				for (var i = 0; i < tab.length; i++) {
				dataTournageProd.push({
					y : tab[i][0],
					label : tab[i][1]
				});
			}
			}
			$.getJSON('http://localhost:444/tournagesparprod',DataTournageProd);
	
//Récupération des données pour la chart Tournage par Type
		function DataTypeTournage2(data) {
				var temp = (Object.getOwnPropertyNames(data.result));
					for (var i = 0; i < data.taille; i++) {
						dataTypeTournage2.push({
							y: (data.result[temp[i]]/line)*100,
							label : temp[i]
						});
					}
				}
		$.getJSON('http://localhost:444/tournagespartype',DataTypeTournage2);
		

// Fonctions permettant d'afficher le nombre de film, realisateur, organisme et de tournage
		function NombreFilm(data){
		   document.getElementById("NombreDeFilm").innerHTML=data.nb;
		}
		$.getJSON('http://localhost:444/allTitre',NombreFilm);
		
		function NombreOrga(data){
		   document.getElementById("NombreOrganisme").innerHTML=data.nb;
		}
		$.getJSON('http://localhost:444/allorga',NombreOrga);
		
		function NombreReal(data){
		   document.getElementById("NombreReal").innerHTML=data.nb;
		}
		$.getJSON('http://localhost:444/allreal',NombreReal);
		
	

			
//Chart correspondant au drilldown avec lequel il y a les réalisateur, le mois, les organisme et arrondissement.
	var visitorsData = {
		"MultiData": [{
			click: visitorsChartDrilldownHandler,
			cursor: "pointer",
			explodeOnClick: false,
			innerRadius: "75%",
			legendMarkerType: "square",
			name: "Nombre de Tournage par Type",
			radius: "100%",
			showInLegend: true,
			startAngle: 90,
			type: "doughnut",
			dataPoints: [{ y: 20.00, label : "Arrondissement" },
						{y: 20.00, label : "Organisme"},
						{y: 20.00, label : "Production"},
						{y: 20.00, label : "Réalisateur"},
						{y: 20.00, label : "Mois"}]
		}],
		"Réalisateur": [{
			click:ClickReal,
			type: "column",
			color: "rgba(54,158,173,.7)",
			name: "Réalisateur",
			markerSize: 5,
			xValueFormatString: "YYYY",
			yValueFormatString: "# tournages",
			dataPoints: dataTournageReal
		}],
		"Organisme": [{
			click:clickOrga,
			type: "column",
			color: "rgba(54,158,173,.7)",
			markerSize: 5,
			xValueFormatString: "YYYY",
			yValueFormatString: "# tournages",
			dataPoints: dataTournageOrga
		}],
		"Production": [{
			click : clickProd,
			type: "column",
			color: "rgba(54,158,173,.7)",
			markerSize: 5,
			xValueFormatString: "YYYY",
			yValueFormatString: "# tournages",
			dataPoints: dataTournageProd
		}],
		"Mois": [{
			click:ClickMois2,
			color: "#546BC1",
			name: "",
			type: "column",
			dataPoints: dataTournageMois
		}],
		"Arrondissement":[{
			click: ClickArrdt,
			type: "bar",
			name: "Arrondissement",
			axisYType: "secondary",
			color: "#014D65",
			dataPoints: dataTournageArdt
	}]
	};
	
	function ClickArrdt(e){
				console.log(e);
				console.log(e.dataPoint.label);
				document.getElementById('formLoaderFilter').reset();
				document.getElementById('formLoaderFilter__ardt').value=e.dataPoint.label;
				document.getElementById('sub').click();
			}
			
	function clickOrga(e){
		console.log(e);
		console.log(e.dataPoint.label);
		document.getElementById('formLoaderFilter').reset();
		document.getElementById('formLoaderFilter__organisme_demandeur').value=e.dataPoint.label;
		document.getElementById('sub').click();
	}
	
	function ClickMois2(e){
		console.log(e);
		console.log(e.dataPoint.label);
		console.log(e.dataSeries.name);
		var mois = e.dataPoint.x + 1;
		var maxDay= new Date(2016,mois,0).getDate();
		if (mois<10){
			var debut="2016-0"+mois+"-01";
			var fin="2016-0"+mois+"-"+maxDay;
		}
		else{
			var debut="2016-"+mois+"-01";
			var fin="2016-"+mois+"-"+maxDay;
		}
		document.getElementById('formLoaderFilter').reset();
		document.getElementById('formLoaderFilter__date_debut').value=debut;
		document.getElementById('formLoaderFilter__date_fin').value=fin;
		document.getElementById('sub').click();
	}	
		
	function clickProd(e){
			console.log(e);
			console.log(e.dataPoint.label);
			document.getElementById('formLoaderFilter').reset();
			document.getElementById('formLoaderFilter__titre').value=e.dataPoint.label;
			document.getElementById('sub').click();
		}
			
	var TypeTournageOptions = {
		width:868.01,
		animationEnabled: true,
		theme: "light2",
		title: {
			text: "Nombre de tournage par type"
		},
		
		subtitles: [{
			text: "Veuillez sélectionner un attribut",
			backgroundColor: "#2eacd1",
			fontSize: 16,
			fontColor: "white",
			padding: 5
		}],
		legend: {
			fontFamily: "calibri",
			fontSize: 14,
			cursor:"pointer",
			itemclick : toggleDataSeries
		},
		data: []
	};

	var visitorsDrilldownedChartOptions = {
		width:868.01,
		animationEnabled: true,
		zoomEnabled:true,
		theme: "light2",
		axisX: {
			labelFontColor: "#717171",
			lineColor: "#a2a2a2",
			tickColor: "#a2a2a2"
		},
		axisY: {
			gridThickness: 0,
			includeZero: false,
			labelFontColor: "#717171",
			lineColor: "#a2a2a2",
			tickColor: "#a2a2a2",
			lineThickness: 1
		},
		data: []
	};

	var chart = new CanvasJS.Chart("chartContainer", TypeTournageOptions);
	chart.options.data = visitorsData["MultiData"];
	chart.render();

	function visitorsChartDrilldownHandler(e) {
		//console.log(e);
		chart2 = new CanvasJS.Chart("chartContainer", visitorsDrilldownedChartOptions);
		chart2.options.data = visitorsData[e.dataPoint.label];
		//console.log(e.name);
		chart2.options.title = { text: e.dataPoint.label }
		chart2.render();
		$("#backButton").toggleClass("invisible");
	}

	$("#backButton").click(function() { 
		$(this).toggleClass("invisible");
		chart = new CanvasJS.Chart("chartContainer", TypeTournageOptions);
		chart.options.data = visitorsData["MultiData"];
		chart.render();
	});

	
//Partie correspondant au chart des Arrondissements par type	
	
var ArdtParType = new CanvasJS.Chart("TournageArdtParType", {
	width:868.01,
	height: 500,
	animationEnabled: true,
	zoomEnabled: true,
	title:{
		text: "Nombre de tournage par arrondissement par type"
	},
	axisY: {
		title: "Nombre de tournage"
	},
	legend: {
		cursor:"pointer",
		itemclick : toggleDataSeries
	},
	toolTip: {
		shared: true,
		content: toolTipFormatter
	},
	data: [{
		click:ClickArdt,
		type: "bar",
		showInLegend: true,
		name: "LONG METRAGE",
		color: "green",
		dataPoints: dataArdtLongM
	},
	{
		click:ClickArdt,
		type: "bar",
		showInLegend: true,
		name: "TELEFILM",
		color: "red",
		dataPoints: dataArdtTelef
	},
	{
		click:ClickArdt,
		type: "bar",
		showInLegend: true,
		name: "SERIE TELEVISEE",
		color: "blue",
		dataPoints: dataArdtSerie
	}]
});

function ClickArdt(e){
		document.getElementById('formLoaderFilter').reset();
		document.getElementById('formLoaderFilter__type_de_tournage').value=e.dataSeries.name;
		document.getElementById('formLoaderFilter__ardt').value=e.dataPoint.label;
		document.getElementById('sub').click();
	}

function DataTypeParArdt(data){
		var temp = (Object.getOwnPropertyNames(data.result));
		console.log("temp1",temp);
		var temp2 = (Object.getOwnPropertyNames(data.result["75001"]))
		console.log(temp2);
		for (var i = 0 ; i<temp.length;i++){
			// var result = temp[i];
			// var temp2 = (Object.getOwnPropertyNames(data[result]));
			// console.log("temp2",temp2);
			for (j=0;j<temp2.length;j++){
				dataA[j].push({
					y:data.result[temp[i]][temp2[j]],
					label: temp[i]
					 });
			 }
			                       
		 }
		//console.log(dataA);
		ArdtParType.render();
		}
	
	$.getJSON('http://localhost:444/tournagespararrdtpartype', DataTypeParArdt)	

function toolTipFormatter(e) {
	var str = "";
	var total = 0 ;
	var str3;
	var str2 ;
	for (var i = 0; i < e.entries.length; i++){
		var str1 = "<span style= \"color:"+e.entries[i].dataSeries.color + "\">" + e.entries[i].dataSeries.name + "</span>: <strong>"+  e.entries[i].dataPoint.y + "</strong> <br/>" ;
		total = e.entries[i].dataPoint.y + total;
		str = str.concat(str1);
	}
	str2 = "<strong>" + e.entries[0].dataPoint.label + "</strong> <br/>";
	str3 = "<span style = \"color:Tomato\">Total: </span><strong>" + total + "</strong><br/>";
	return (str2.concat(str)).concat(str3);
}

function toggleDataSeries(e) {
	if (typeof (e.dataSeries.visible) === "undefined" || e.dataSeries.visible) {
		e.dataSeries.visible = false;
	}
	else {
		e.dataSeries.visible = true;
	}
	ArdtParType.render();
}
	
	
}