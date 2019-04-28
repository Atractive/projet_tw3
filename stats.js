window.onload = function() {

			var dataTournageReal = [];
			var dataTournageArdt = [];
			var dataTypeTournage = [];
			var dataTypeTournage2 = [];
			var dataTournageMois = [];
			var dataDureeTournage = [];
			var dataTournageOrga = [];
			var line;
			var mois = ["Janvier","Février","Mars","Avril","Mai","Juin","Juillet","Aout","Septembre","Octobre","Novembre","Décembre"];
			
			function numberLine(data){
				line = data.nb;
				document.getElementById("NombreTournage").innerHTML=line;
				
			}
			//  console.log(line); 
			
			$.getJSON('http://localhost:444/nombredeligne',numberLine);
			
			//Chart du nombre de tournage par Réalisateur
			var TournageReal = new CanvasJS.Chart("TournageReal", {
			animationEnabled: true, 
			zoomEnabled: true,
			title:{
				text: "Nombre de tournages par réalisateur"
			},
			axisY: {
				title: "Nombre de tournage",
				valueFormatString: "#",
			},
			data: [{
				click:ClickReal,
				type: "column",
				color: "rgba(54,158,173,.7)",
				markerSize: 5,
				xValueFormatString: "YYYY",
				yValueFormatString: "# tournages",
				dataPoints: dataTournageReal
			}]
			});
			
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
			TournageReal.render();
			}
			$.getJSON('http://localhost:444/tournagesparreal',DataTournageReal);
			
			
			//  Idée de statistiques: 
			// 	 - Nombre de tournages par film  Fait
			// 	 - Nombre de tournages par réalisateur  Fait
			// 	 - Nombre de tournages par mois  Fait
			// 	 - Nombre de tournages par arrondissement  Fait
			// 	 - Nombre de tournages par organisme demandeur  Fait
			// 	 Durée moyenne d'un tournage 
				
				

			
			//Nombre de tournages par arrondissement
			var TournageArrdt = new CanvasJS.Chart("TournageArrdt", {
				animationEnabled: true,
				title:{
					text:"Nombre de tournages par arrondissement"
				},
				axisX:{
					interval: 2
				},
				axisY2:{
					interlacedColor: "rgba(1,77,101,.2)",
					gridColor: "rgba(1,77,101,.1)",
					title: "Nombre de tournages"
				},
				data: [{
					click: ClickArrdt,
					type: "bar",
					name: "Arrondissement",
					axisYType: "secondary",
					color: "#014D65",
					dataPoints: dataTournageArdt
				}]
			});
			
			function ClickArrdt(e){
				console.log(e);
				console.log(e.dataPoint.label);
				document.getElementById('formLoaderFilter').reset();
				document.getElementById('formLoaderFilter__ardt').value=e.dataPoint.label;
				document.getElementById('sub').click();
			}
		
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
					TournageArrdt.render();
				}
			$.getJSON('http://localhost:444/tournagesparardt',DataTournageArdt);

		
		//Pourcentage de chaque type de tournage
		var TypeTournage = new CanvasJS.Chart("TypeTournage", {
			
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
		
		var TournageParMois = new CanvasJS.Chart("TournageMois", {
			animationEnabled: true,
			theme: "light2",
			title:{
				text: "Nombre de tournage par mois"
			},
			axisY:{
				includeZero: false
			},
			data: [{      
				click:ClickMois,
				type: "splineArea",       
				dataPoints: dataTournageMois
			}]
		});
		
		function ClickMois(e){
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
				document.getElementById('formLoaderFilter').reset();
				document.getElementById('formLoaderFilter__date_debut').value=debut;
				document.getElementById('formLoaderFilter__date_fin').value=fin;
				document.getElementById('sub').click();
			}
			
		function DataTournageMois(data) {
			var temp = (Object.getOwnPropertyNames(data.result))
				for (var i = 0; i < 12; i++) {
					dataTournageMois.push({
						y: data.result[temp[i]],
						label : mois[i]
					});
				}
				TournageParMois.render();
			}
			$.getJSON('http://localhost:444/tournagesparmois',DataTournageMois);
		
		var DureeTournage = new CanvasJS.Chart("TournageDuree", {
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
				var markers = L.markerClusterGroup();

					points = L.geoJSON(response, {
						pointToLayer: function (feature, latlng) {
							if (feature.properties.type_de_tournage == 'TELEFILM') {
								return L.marker(latlng, { icon: Icon_red });
							} if (feature.properties.type_de_tournage == 'LONG METRAGE') {
								return L.marker(latlng, { icon: Icon_green });
							} if (feature.properties.type_de_tournage == 'SERIE TELEVISEE') {
								return L.marker(latlng, { icon: Icon_blue });
							}
						},
						onEachFeature: function (feature, layer) {
							layer.bindPopup(
								'<div>'
								+ '<label>Longitude: ' + feature.properties.xy[0] + '</label>'
								+ '</br>'
								+ '<label>Latitude: ' + feature.properties.xy[1] + '</label>'
								+ '</div>'
							);

							layer.on("popupopen", onPopupOpen);

							layer.on('click', function (evt) {
								document.getElementById('divFloat').style.display = 'block';
								document.getElementById('formAff__id').value = feature.properties.id;
								document.getElementById('formAff__type_de_tournage').value = feature.properties.type_de_tournage;
								document.getElementById('formAff__titre').value = feature.properties.titre;
								document.getElementById('formAff__realisateur').value = feature.properties.realisateur;
								document.getElementById('formAff__organisme_demandeur').value = feature.properties.organisme_demandeur;
								document.getElementById('formAff__adresse').value = feature.properties.adresse;
								document.getElementById('formAff__ardt').value = feature.properties.ardt;
								document.getElementById('formAff__date_debut').value = feature.properties.date_debut;
								document.getElementById('formAff__date_fin').value = feature.properties.date_fin;
							});
						}, filter: function (feature, layer) {
							var val_tdt = document.getElementById('formLoaderFilter__type_de_tournage').value;
							if (val_tdt == 'NON RENSEIGNE') { var bool_tdp = true; } else { bool_tdp = (feature.properties.type_de_tournage == val_tdt); }
							var val_t = document.getElementById('formLoaderFilter__titre').value;
							if (val_t == '') { var bool_t = true; } else { bool_t = (feature.properties.titre == val_t); }
							var val_r = document.getElementById('formLoaderFilter__realisateur').value;
							if (val_r == '') { var bool_r = true; } else { bool_r = (feature.properties.realisateur == val_r); }
							var val_od = document.getElementById('formLoaderFilter__organisme_demandeur').value;
							if (val_od == '') { var bool_od = true; } else { bool_od = (feature.properties.organisme_demandeur == val_od); }
							var val_ad = document.getElementById('formLoaderFilter__adresse').value;
							if (val_ad == '') { var bool_ad = true; } else { bool_ad = (feature.properties.adresse == val_ad); }
							var val_ar = document.getElementById('formLoaderFilter__ardt').value;
							if (val_ar == '') { var bool_ar = true; } else { bool_ar = (feature.properties.ardt == val_ar); }
							var val_dd = document.getElementById('formLoaderFilter__date_debut').value;
							if (val_dd == '') { var bool_dd = true; } else { bool_dd = (feature.properties.date_debut >= val_dd); }
							var val_df = document.getElementById('formLoaderFilter__date_fin').value;
							if (val_df == '') { var bool_df = true; } else { bool_df = (feature.properties.date_fin <= val_df); }
							return (bool_tdp && bool_t && bool_r && bool_od && bool_ad && bool_ar && bool_dd && bool_df);

						}

					});

					console.log("markers", markers);
					mapMarkers.push(markers);
					for (var i = 0; i < mapMarkers.length; i++) {
						map.removeLayer(mapMarkers[i]);
					}
					markers.addLayer(points);
					map.addLayer(markers);
					// console.log(markers);
					

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
		
		
		
		var TournageOrga = new CanvasJS.Chart("TournageOrgaDemandeur", {
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
			click : clickOrga,
			type: "column",
			color: "rgba(54,158,173,.7)",
			markerSize: 5,
			xValueFormatString: "YYYY",
			yValueFormatString: "# tournages",
			dataPoints: dataTournageOrga
		}]
		});

		function clickOrga(e){
			console.log(e);
			console.log(e.dataPoint.label);
			document.getElementById('formLoaderFilter').reset();
			document.getElementById('formLoaderFilter__organisme_demandeur').value=e.dataPoint.label;
			document.getElementById('sub').click();
		}
		
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
				TournageOrga.render();
			}
			$.getJSON('http://localhost:444/tournagesparorga',DataTournageOrga);
		
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
		
		
		
	function choix(){
		var liste, texte;
		liste = document.getElementById("ChartChoice");
		texte = liste.options[liste.selectedIndex].text;
		console.log(texte);
		
		if(texte == 'Nombre de Tournage par Réalisateur'){
			document.getElementById('TournageReal').style.display='block';
			document.getElementById('TournageArrdt').style.display='none';
			document.getElementById('TypeTournage').style.display='none';
		}
		if(texte == 'Nombre de Tournage par Arrondissement'){
			document.getElementById('TournageArrdt').style.display='block';
			document.getElementById('TournageReal').style.display='none';
			document.getElementById('TypeTournage').style.display='none';
		}
		if(texte == 'Différents types de tournages'){
			document.getElementById('TypeTournage').style.display='block';
			document.getElementById('TournageReal').style.display='none';
			document.getElementById('TournageArrdt').style.display='none';
		}
	}
	
	function DataTypeTournage2(data) {
			var temp = (Object.getOwnPropertyNames(data.result));
				for (var i = 0; i < data.taille; i++) {
					dataTypeTournage2.push({
						y: (data.result[temp[i]]/line)*100,
						label : temp[i]
					});
				}
			chart.render();
			}
	$.getJSON('http://localhost:444/tournagespartype',DataTypeTournage2);
		
	var dataLongm=[];
	var dataTelef = [];
	var dataSerie = [];
	var dataSansType = [];
	var dataT= [dataLongm,dataTelef,dataSerie,dataSansType];
	
	
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
		
		}
	
	$.getJSON('http://localhost:444/tournagesparmoispartype', DataTypeParMois)		
			
	var totalVisitors = 883000;
	var visitorsData = {
		"TournageType2": [{
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
			dataPoints: dataTypeTournage2
		}],
		"LONG METRAGE": [{
			click:testclick,
			color: "#E7823A",
			name: "LONG METRAGE",
			type: "column",
			dataPoints: dataLongm
		}],
		"SERIE TELEVISEE": [{
			click:testclick,
			color: "#546BC1",
			name: "SERIE TELEVISEE",
			type: "column",
			dataPoints: dataSerie
		}],
		"TELEFILM": [{
			click:testclick,
			color: "#546BC1",
			name: "TELEFILM",
			type: "column",
			dataPoints: dataTelef
		}],
		"": [{
			click:testclick,
			color: "#546BC1",
			name: "",
			type: "column",
			dataPoints: dataSansType
		}]
	};
	
	function testclick(e){
		console.log(e);
		console.log("mois", e.dataPoint.label);
		console.log("rubrique", e.dataSeries.name);
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
		document.getElementById('formLoaderFilter__type_de_tournage').value=e.dataSeries.name;
		document.getElementById('sub').click();
	}
	var TypeTournageOptions = {
		animationEnabled: true,
		theme: "light2",
		title: {
			text: "Nombre de tournage par type"
		},
		subtitles: [{
			text: "Click on Any Segment to Drilldown",
			backgroundColor: "#2eacd1",
			fontSize: 16,
			fontColor: "white",
			padding: 5
		}],
		legend: {
			fontFamily: "calibri",
			fontSize: 14,
		},
		data: []
	};

	var visitorsDrilldownedChartOptions = {
		animationEnabled: true,
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
	chart.options.data = visitorsData["TournageType2"];
	

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
		chart.options.data = visitorsData["TournageType2"];
		chart.render();
	});

	}