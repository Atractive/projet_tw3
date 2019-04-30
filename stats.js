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
			var dataA= [dataArdtTelef,dataArdtSerie,dataArdtLongM];
			var dataTempReal = [];
			var dataTempOrga = [];
			var dataTempProd = [];
			var dataTempMois = [];
			var dataTempArdt = [];
			
			var real = {};
			var orga = {};
			var mois = {};
			var ardt = {};
			var prod = {};
	
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
				// console.log(temp);
				// console.log(data.listTournage[5]);
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
	var PieChoix = {
		"MultiData": [{
			click: ChangementCharts,
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
	}],
	"RéalisateurTemp": [{
		click:ClickRealTemp,
		type: "column",
		color: "rgba(54,158,173,.7)",
		name: "Réalisateur",
		markerSize: 5,
		xValueFormatString: "YYYY",
		yValueFormatString: "# tournages",
		dataPoints: dataTempReal
	}],
	"OrganismeTemp": [{
		click:clickTempOrga,
		type: "column",
		color: "rgba(54,158,173,.7)",
		markerSize: 5,
		xValueFormatString: "YYYY",
		yValueFormatString: "# tournages",
		dataPoints: dataTempOrga
	}],
	"ProductionTemp": [{
		click : ClickProdTemp,
		type: "column",
		color: "rgba(54,158,173,.7)",
		markerSize: 5,
		xValueFormatString: "YYYY",
		yValueFormatString: "# tournages",
		dataPoints: dataTempProd
	}],
	"MoisTemp": [{
		click:clickMoisTemp,
		color: "#546BC1",
		name: "",
		type: "column",
		dataPoints: dataTempMois
	}],
	"ArrondissementTemp":[{
		click: clickTempArrdt,
		type: "bar",
		name: "Arrondissement",
		axisYType: "secondary",
		color: "#014D65",
		dataPoints: dataTempArdt
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
	
	function clickTempArrdt(e){
		console.log(e);
		console.log(e.dataPoint.label);
		document.getElementById('formLoaderFilter__ardt').value=e.dataPoint.label;
		document.getElementById('sub').click();
	}
	
	function clickTempOrga(e){
		console.log(e);
		console.log(e.dataPoint.label);
		document.getElementById('formLoaderFilter__organisme_demandeur').value=e.dataPoint.label;
		document.getElementById('sub').click();
		}
		
	function clickMoisTemp(e){
		// console.log(e);
		// console.log(e.dataPoint.x + 1);
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
		document.getElementById('formLoaderFilter__date_debut').value=debut;
		document.getElementById('formLoaderFilter__date_fin').value=fin;
		document.getElementById('sub').click();
		}
		
	function ClickRealTemp(e){
		console.log(e);
		console.log(e.dataPoint.label);
		document.getElementById('formLoaderFilter__realisateur').value=e.dataPoint.label;
		document.getElementById('sub').click();
	}
	
	function ClickProdTemp(e){
		console.log(e);
		console.log(e.dataPoint.label);
		document.getElementById('formLoaderFilter__titre').value=e.dataPoint.label;
		document.getElementById('sub').click();
	}
						
	var TypeTournageOptions = {
		width:868.01,
		height:500,
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

	var secondChartsOptions = {
		width:868.01,
		height:500,
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
	chart.options.data = PieChoix["MultiData"];
	chart.render();

	function ChangementCharts(e) {
		console.log(e);
		var id = e.chart._containerId;
		if (id=="chartContainer"){
			chart2 = new CanvasJS.Chart(id, secondChartsOptions);
			chart2.options.data = PieChoix[e.dataPoint.label];
			//console.log(e.name);
			chart2.options.title = { text: e.dataPoint.label }
			$("#backButton").toggleClass("invisible");
		}
		else{
			chart2 = new CanvasJS.Chart(id, secondChartsOptions);
			chart2.options.data = PieChoix[e.dataPoint.label+"Temp"];
			//console.log(e.name);
			chart2.options.title = { text: e.dataPoint.label }
			$("#backButton2").toggleClass("invisible");
		}
		chart2.render();
		
	}

	$("#backButton").click(function() {
		$(this).toggleClass("invisible");
		chart = new CanvasJS.Chart("chartContainer", TypeTournageOptions);
		chart.options.data = PieChoix["MultiData"];
		chart.render();
	});

	$("#backButton2").click(function() {
		$(this).toggleClass("invisible");
		chart = new CanvasJS.Chart("chartTemp", TypeTournageOptions);
		chart.options.data = PieChoix["MultiData"];
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
		// console.log("temp1",temp);
		var temp2 = (Object.getOwnPropertyNames(data.result["75001"]))
		// console.log(temp2);
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
	
//////////////////////////////////////////////////////////////////////////:

$("#formLoaderFilter").on("submit", function (evt) {
				$("#statstemp_li").removeClass("disabled");
				evt.preventDefault();
				loadMap();
				var reponse = $(this).serialize();
				var l_rep = reponse.split("&");
				toSend = {}
				for (var i = 0; i < l_rep.length; i++) {
					var temp = l_rep[i].split("=");
					toSend[temp[0]] = temp[1];
				}
				$.ajax({
					type: "POST",
					url: 'http://localhost:444/filterform',
					data: { data: toSend },
					success: function (response) {
						mapMarkersTemp = response.data;
						// <!-- console.log("succes", response.data); -->
						$("#NombreTournageTemp").text(response.data.length.toString());

						// calcul et update du nombre de realisateurs présent a l'écran
						var s = new Set();
						for (var i = 0; i < response.data.length; i++) {
							// console.log(response.data)
							s.add(response.data[i].realisateur);
						}
						// console.log({ nb: s.size, info: Array.from(s) });
						$("#NombreRealTemp").text(s.size.toString());

						// calcul et update du nombre d'ogr demandeur présent a l'écran
						var s = new Set();
						for (var i = 0; i < response.data.length; i++) {
							s.add(response.data[i].organisme_demandeur);
						}
						// console.log({ nb: s.size, info: Array.from(s) });
						$("#NombreOrgTemp").text(s.size.toString());

						// calcul et update du nombre de films présent a l'écran
						var s = new Set();
						for (var i = 0; i < response.data.length; i++) {
							s.add(response.data[i].titre);
						}
						// console.log({ nb: s.size, info: Array.from(s) });
						$("#NombreFilmTemp").text(s.size.toString());

						$("#multiTemp").on("click", function () {
							
							var moisS = ["Janvier", "Février", "Mars", "Avril", "Mai", "Juin", "Juillet", "Aout", "Septembre", "Octobre", "Novembre", "Décembre"];

							for (var i = 0; i < 12; i++) {
								mois[i] = 0;
							}
							<!-- console.log(response.data); -->
							for (var i = 0; i < response.data.length; i++) {
								var mois_debut = response.data[i].date_debut.split("-")[1];
								var mois_fin = response.data[i].date_fin.split("-")[1];
								if (typeof date_debut != undefined && typeof date_fin != undefined) {
									mois_debut = parseInt(mois_debut);
									mois_fin = parseInt(mois_fin);
									// console.log(mois_fin, mois_debut, mois_fin - mois_debut);
									if (mois_fin - mois_debut == 0) {
										mois[mois_debut - 1] += 1;
									} else {
										for (var j = mois_debut; j < mois_fin - mois_debut; j++) {
											mois[j - 1] += 1;
										}
									}
								}
								if (typeof real[response.data[i].realisateur] == 'undefined') {
									real[response.data[i].realisateur] = 1;
								} 
								else{
									real[response.data[i].realisateur] += 1;

								}
								if (typeof prod[response.data[i].titre] == 'undefined') {
									prod[response.data[i].titre] = 1;
								}
								else{
									prod[response.data[i].titre] += 1;								
								}
								if (typeof orga[response.data[i].organisme_demandeur] == 'undefined') {
									orga[response.data[i].organisme_demandeur] = 1;
								} 
								else{
									orga[response.data[i].organisme_demandeur] += 1;
								}
								if (typeof ardt[response.data[i].ardt] == 'undefined') {
									ardt[response.data[i].ardt] = 1;
								} 
								else {
									ardt[response.data[i].ardt] += 1;

								}
							}
							var data = { real: real, ardt: ardt, mois : mois, prod: prod, orga: orga };
							// console.log(data);
							
							var resultReal = Object.keys(data.real).map(function(key) { 
								return [data.real[key],(key)]; });
							var tabReal = resultReal.sort(compareNombres); 
							
							var resultArdt = Object.keys(data.ardt).map(function(key) { 
								return [data.ardt[key],(key)]; });
							var tabArdt = resultArdt.sort(compareNombres);
							
							var resultMois = Object.keys(data.mois).map(function(key) { 
								return [(key),data.mois[key]]; });
							var tabMois = resultMois.sort(compareNombres);
							
							// console.log(tabMois);
							
							var resultProd = Object.keys(data.prod).map(function(key) { 
								return [data.prod[key],(key)]; });
							var tabProd = resultProd.sort(compareNombres);
							
							var resultOrga = Object.keys(data.orga).map(function(key) { 
								return [data.orga[key],(key)]; });
							var tabOrg = resultOrga.sort(compareNombres);
							
							for (var i = 0; i < tabReal.length; i++) {
								dataTempReal.push({
									y : tabReal[i][0],
									label : tabReal[i][1]
								});
							}
							
							for (var i = 0; i < tabOrg.length; i++) {
								dataTempOrga.push({
									y : tabOrg[i][0],
									label : tabOrg[i][1]
								});
							}
							
							for (var i = 0; i < tabArdt.length; i++) {
								dataTempArdt.push({
									y : tabArdt[i][0],
									label : tabArdt[i][1]
								});
							}
							

							for (var i = 0; i < tabMois.length; i++) {
								dataTempMois.push({
									y : tabMois[i][1],
									label : moisS[parseInt(tabMois[i][0])]
								});
							}
							
							for (var i = 0; i < tabProd.length; i++) {
								dataTempProd.push({
									y : tabProd[i][0],
									label : tabProd[i][1]
								});
							}


							var chart = new CanvasJS.Chart("chartTemp", TypeTournageOptions);
							chart.options.data = PieChoix["MultiData"];
							chart.render();
						
						});
						
						$("#moisTemp").on("click",function(){
						
							var longm = {};
							var telef = {};
							var serie = {};
							
							var dataLongm=[];
							var dataTelef = [];
							var dataSerie = [];
							var dataT= [dataLongm,dataTelef,dataSerie];
							// fill m
							for (var i = 0; i < 12; i++) {
								longm[i] = telef[i] = serie[i]  = 0;
							}
							for (var i = 0; i < response.data.length; i++) {
								// console.log(parseInt(m[docs[i].properties.date_debut].split("-")[1]));
								var type = response.data[i].type_de_tournage;
								var mois_debut = response.data[i].date_debut.split("-")[1];
								var mois_fin = response.data[i].date_fin.split("-")[1];
								if (typeof date_debut != undefined && typeof date_fin != undefined && typeof type != undefined) {
									mois_debut = parseInt(mois_debut);
									mois_fin = parseInt(mois_fin);
									// console.log(mois_fin, mois_debut, mois_fin - mois_debut);
									if (type == "LONG METRAGE") {
										if (mois_fin - mois_debut == 0) {
											longm[mois_debut - 1] += 1;
										} else {
											for (var j = mois_debut; j < mois_fin - mois_debut; j++) {
												longm[j - 1] += 1;
											}
										}
									}
									else if (type == "SERIE TELEVISEE") {
										if (mois_fin - mois_debut == 0) {
											serie[mois_debut - 1] += 1;
										} else {
											for (var j = mois_debut; j < mois_fin - mois_debut; j++) {
												serie[j - 1] += 1;
											}
										}
									}
									else if (type == "TELEFILM") {
										if (mois_fin - mois_debut == 0) {
											telef[mois_debut - 1] += 1;
										} else {
											for (var j = mois_debut; j < mois_fin - mois_debut; j++) {
												telef[j - 1] += 1;
											}
										}
									}
								}
							}
							var data = {resultlongm: longm, resulttelef: telef, resultserie: serie};
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
								
							var TournageParMois = new CanvasJS.Chart("chartTemp", {
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
									<!-- content: toolTipContent -->
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
									document.getElementById('formLoaderFilter__type_de_tournage').value=e.dataSeries.name;
									document.getElementById('formLoaderFilter__date_debut').value=debut;
									document.getElementById('formLoaderFilter__date_fin').value=fin;
									document.getElementById('sub').click();
								}
			
							TournageParMois.render();
						
						});
						
						$("#typeTemp").on("click", function () {
							var dataTemp = [];
							var m = {};

							for (var i = 0; i < response.data.length; i++) {
								if (typeof m[response.data[i].type_de_tournage] == 'undefined') {
									m[response.data[i].type_de_tournage] = 1;
								} else {
									m[response.data[i].type_de_tournage] += 1;
								}
							}
							var data = { result: m, taille: Object.keys(m).length };

							var temp = (Object.getOwnPropertyNames(data.result))
							for (var i = 0; i < data.taille; i++) {
								dataTemp.push({
									y: (data.result[temp[i]] / response.data.length) * 100,
									label: temp[i]
								});
							}

							var TournageTypeTemp = new CanvasJS.Chart("chartTemp", {
								width:868.01,
								height: 500,
								theme: "light2",
								animationEnabled: true,
								title: {
									text: "Type de Tournage"
								},
								data: [{
									click : clickTempType,
									type: "pie",
									startAngle: 240,
									yValueFormatString: "##0.00\"%\"",
									indexLabel: "{label} {y}",
									dataPoints: dataTemp
								}]
							});
							
							function clickTempType(e){
								console.log(e);
								console.log(e.dataPoint.label);
								document.getElementById('formLoaderFilter__type_de_tournage').value=e.dataPoint.label;
								document.getElementById('sub').click();
							}
							
							TournageTypeTemp.render();
						});
						
						$("#ardtTemp").on("click", function() {
						
						var dataArdtLongM = [];
						var dataArdtSerie = [];
						var dataArdtTelef = [];
						var dataA= [dataArdtTelef,dataArdtSerie,dataArdtLongM];
						m = {};
						for (var i = 0; i < response.data.length; i++) {
							var type = response.data[i].type_de_tournage;
							var ardt = response.data[i].ardt;
							// console.log(type);
							if (typeof m[ardt] == 'undefined' && type != "" && ardt != "" ) {
								m[ardt]={"TELEFILM":0,"SERIE TELEVISEE":0,"LONG METRAGE":0};
								m[ardt][type]= 1;
							}
							else if (type != "" && ardt != ""){
								m[ardt][type]= m[ardt][type]+1;
								
							} 
						}
				 
						var data = {result : m };
						
						var ArdtParType = new CanvasJS.Chart("chartTemp", {
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
						
						var temp = (Object.getOwnPropertyNames(data.result));
						console.log("temp1",temp);
						//var temp2 = (Object.getOwnPropertyNames(data.result["75001"]))
						//console.log(temp2);
						for (var i = 0 ; i<temp.length;i++){
							var result2 = temp[i];
							var temp2 = (Object.getOwnPropertyNames(data.result[result2]));
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
		});
						
						$("#duréeTemp").on("click", function () {
							var dataTemp = [];
							var dataDuree2 = [];
							var m = {};
							var j1 = [];
							var j2 = [];
							var j3 = [];
							var j4 = [];
							var j5 = [];
							var j6 = [];
							
							var t = [j1,j2,j3,j4,j5,j6];
							
							for (var i = 0; i < response.data.length; i++) {
								// <!-- console.log(response.data[i]); -->
								var debut = response.data[i].date_debut;
								var fin = response.data[i].date_fin;
								if (typeof date_debut != undefined && typeof date_fin != undefined && typeof response.data[i].xy != undefined) {
									var diff = {}                           // Initialisation du retour
									var tmp = new Date(fin) - new Date(debut);

									tmp = Math.floor(tmp / 1000);             // Nombre de secondes entre les 2 dates
									diff.sec = tmp % 60;                    // Extraction du nombre de secondes

									tmp = Math.floor((tmp - diff.sec) / 60);    // Nombre de minutes (partie entière)
									diff.min = tmp % 60;                    // Extraction du nombre de minutes

									tmp = Math.floor((tmp - diff.min) / 60);    // Nombre d'heures (entières)
									diff.hour = tmp % 24;                   // Extraction du nombre d'heures

									tmp = Math.floor((tmp - diff.hour) / 24);   // Nombre de jours restants
									diff.day = tmp + 1;

									// console.log(diff.day);
									if (isNaN(diff.day) == false) {
										console.log(diff.day);
										if (isNaN(m[diff.day])) {
											m[diff.day] = 1;
										}
										else {
											m[diff.day] = m[diff.day] + 1;
										}
									}
									if (diff.day>=6){
										day = 5
									}
									else{
										day=diff.day-1
									}
									var tab = t[day];
									if (isNaN(diff.day) == false) {
										tab.push(response.data[i]);
									}
								}
							}
							l = {}
							for (const key in m) {
								// <!-- console.log(key); -->
								if (key > 6) {
									l[6] = l[6] + m[key]
								}
								else {
									l[key] = m[key]
								}
							}
							// <!-- console.log(l); -->
							// <!-- console.log(Object.keys(l).length); -->
							var data = { result: l, taille: Object.keys(l).length };

							var temp = (Object.getOwnPropertyNames(data.result))
							for (var i = 0; i < data.taille; i++) {
								if (temp[i] == 6) {
									dataTemp.push({
										y: data.result[temp[i]],
										label: temp[i] + "+"
									});
								}
								else {
									dataTemp.push({
										y: data.result[temp[i]],
										label: temp[i]
									});
								}
							}
							
							for(var i = 0; i< t.length;i++){
								dataDuree2.push(t[i]);;
							}
						
							var TournageDureeTemp = new CanvasJS.Chart("chartTemp", {
								width:868.01,
								height: 500,
								animationEnabled: true,
								zoomEnabled: true,
								title: {
									text: "Durée des tournages par nombre de jours"
								},
								axisY: {
									title: "Nombre de tournage",
									valueFormatString: "#",
								},
								axisX: {
									title: "Nombre de Jours",
									valueFormatString: "#",
								},
								data: [{
									click:clickDureeTemp, 
									type: "column",
									color: "rgba(54,158,173,.7)",
									markerSize: 5,
									xValueFormatString: "YYYY",
									yValueFormatString: "# tournages",
									dataPoints: dataTemp
								}]
							});

							// function clickDureeTemp(e){ 
								// //console.log(e); -->
								// var response = (dataDuree2[e.dataPoint.x]); 
								// console.log(response); 
								// loadPoint(response); 
							 // }
							TournageDureeTemp.render();
						});

					}
				});
			});	
	
	
	
	
	
	
}