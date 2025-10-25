// This is the main JavaScript file for the Energy Resources Profile of Virginia webmap application
// It utilizes the ESRI ArcGIS API for JavaScript to create an interactive map visualizing energy infrastructure and potential within the state of Virginia.
// The code sets up the map, layers, renderers, popups, and user interface components.
// Author: Edward Cronin
// Initially created: October 2024
require(["esri/views/MapView", "esri/request",
 "esri/Map", "esri/Basemap", "esri/PopupTemplate", 
 "esri/widgets/BasemapGallery", "esri/renderers/SimpleRenderer", 
 "esri/widgets/Home", "esri/widgets/LayerList", "esri/Graphic", 
 "esri/widgets/Legend", "esri/layers/FeatureLayer", "esri/renderers/ClassBreaksRenderer", 
 "esri/widgets/Search", "esri/symbols/SimpleFillSymbol", "esri/rest/support/Query", 
 "esri/widgets/Expand", "esri/layers/GroupLayer"], 
(MapView, esriRequest, 
Map, Basemap, PopupTemplate, 
BasemapGallery, SimpleRenderer, Home, 
LayerList, Graphic, Legend, 
FeatureLayer, ClassBreaksRenderer, Search, 
SimpleFillSymbol, Query, Expand,
GroupLayer) => {

// TABS


// Details for spatial queries
let utilityRenderer = {
	type: "simple",
	symbol: {
		type: "simple-fill",
		color: [0,38,12,0.3],
		outline: {
			width: 1,
			color: "black",
	}
}};

let transmissionRenderer = {
	type: "simple",
	symbol: {
		type: "simple-line",
		color: [34,0,25,0.3],
}};

let utilityPopup = new PopupTemplate({
	title: "{NAME}",
	content: "ELECTRICITY SERVICE TYPE: {TYPE}</br>CONTROL AREA: {CNTRL_AREA}</br>NUMBER OF CUSTOMERS: {CUSTOMERS}",
});

// Virginia Boundaries
const virginiaBoundary = new FeatureLayer({
	 portalItem: {
		 id: "774019f31f8549c39b5c72f149bbe74e",
	 },
	 title: "Virginia Boundary",
	 definitionExpression:"STATE_NAME = 'Virginia'",
 });
 
 const virginiaCounty = new FeatureLayer({
	 portalItem: {
		 id: "14c5450526a8430298b2fa74da12c2f4",
	 },
	 title: "Virginia Counties",
	 definitionExpression: "STATE_NAME = 'Virginia'",	
 });
	
//Energy Infrastructure//
  const powerPlants = new FeatureLayer({
	 portalItem: {
		 id: "bf5c5110b1b944d299bb683cdbd02d2a",
	 },
	 definitionExpression: "State = 'Virginia'"
 });
 
 const coalMines = new FeatureLayer({
	 portalItem: {
		 id: "9fea95bf1add412d88b246d121f3b8c7",
	 },
	 visible: false,
	 definitionExpression: "State = 'VIRGINIA'"
 });
 
 const biodieselPlants = new FeatureLayer({
	 portalItem: {
		 id: "79dad60ce89c47519452a2959d49acd8",
	 },
	 visible: false,
	 definitionExpression: "State = 'Virginia'"
 });
 
 const utilityTerritories = new FeatureLayer({
	 portalItem: {
		 id: "f4cd55044b924fed9bc8b64022966097",
	 },
	 visible: false,
	 geometry: virginiaBoundary,
	 spatialRelationship: "intersects",
 });
 
 powerPlants.when(function() {
	 const nameField = powerPlants.fieldsIndex.get("State");
 });
 
const transmissionLines = new FeatureLayer({
    portalItem: {
    id:"bd24d1a282c54428b024988d32578e59",
	},
	visible: false,
geometry: virginiaBoundary,
spatialRelationship: "intersects",
});
	const petroleumPipes = new FeatureLayer ({
		portalItem: {
			id: "b93f85a642b14dc6a46fe041c5dc2929",
		},
		visible: false,
		geometry: 'virginiaBoundary',
		spatialRelationship: "intersects",
	});
	
	const naturalGasPipes = new FeatureLayer ({
		portalItem: {
			id: "4a158d2113f145039f71b80d07e2c19c",
		},
		visible: false,
		geometry: virginiaBoundary,
		spatialRelationship: "intersects",
	});
	const naturalGasStorage = new FeatureLayer ({
		portalItem: {
			id: "beffe709475c45909ff7423426ccb220",
		},
		visible: false,
		definitionExpression: "State = 'VA'",
	});
	
	const oilWells = new FeatureLayer ({
		portalItem: {
			id: "d7a63292756e47f3a055d6beef831818",
		},
		visible: false,
		definitionExpression: "state = 'VA'",
	});
	
	const natGasWells = new FeatureLayer({
		portalItem: {
			id: "d42cd524e39047499899e93540a8ede9",
	},
	    visible: false,
		definitionExpression: "state = 'VA'",
	});

// ENERGY POTENTIAL
const coalFields = new FeatureLayer({
	portalItem: {
		id: "13ad01f317f74e5989c3ee199496fa32",
	},
	visible: false,
	where: "NAME IS NOT NULL",
	geometry: virginiaBoundary,
	spatialRelationship: "intersects",
	returnGeometry: true,
});

const oilShale = new FeatureLayer({
	portalItem: {
		id: "3f001fba00dc4add8dbd00542d61e4da",
	},
	visible: false,
	where:"NAME IS NOT NULL",
	geometry: virginiaBoundary,
	spatialRelationship: "intersects",
	returnGeometry: true,
});

const sedimentaryBasin = new FeatureLayer({
	portalItem:{
		id:"6542690951ca45f2a3c23a4325153d7d",
	},
	visible: false,
	where: "NAME IS NOT NULL",
	geometry: virginiaBoundary,
	spatialRelationship: "intersects",
	returnGeometry: true,
});

const biomass = new FeatureLayer({
	portalItem:{
		id:"8e88b6990bd24434b9e915db598cea06",
	},
	visible: false,
	definitionExpression: "STATE_NAME = 'VA'",
});

const geothermal = new FeatureLayer({
	portalItem:{
		id: "6515281935cc4cc1afdd585358d0aee3",
	},
	visible: false,
});

const solar = new FeatureLayer({
	portalItem:{
		id: "b3be0d7de6fa429d815a906aba84c4d7",
	},
	visible: false,
});

const onshoreWind = new FeatureLayer({
	portalItem:{
		id: "4d380293a7e54330b73a657212004e60",
	},
	visible: false,
});

const offshoreWind = new FeatureLayer({
	portalItem:{
		id: "ddc4fbdf89b54d63b24ad2f841bf1f86",
	},
	visible: false,
});

const uraniumFavorableAreas = new FeatureLayer({
	portalItem:{
		id:"f5107f2b16e644f4a866c3994d2824ee",
	},
	visible: false,
});


// MAP BASICS	
  const map = new Map({
	 basemap: "dark-gray"
 });
 
 const view = new MapView({
	 container: "viewDiv",
	 map: map,
	 zoom: 6,
	 center: [-79, 37]
 });
 
view.when(() => {
	const layerList = new LayerList({
		view: view
	});
	view.ui.add(layerList, "top-right");
	
	const locatorURL = "https://services.arcgis.com/P3ePLMYs2RVChkJx/arcgis/rest/services/USA_Census_Counties/FeatureServer/0/query?where=1%3D1&outFields=*&outSR=4326&f=json"
	const search = new Search({
		view: view,
		includeDefaultSources: true,
	});
	view.ui.add(search, "top-left");
});

const homeBtn = new Home({
	view: view
});

const layerList = new LayerList({
	view: view,
	dragEnabled: true,
	
});
const energyInfrastructure = new GroupLayer({
	title: "Energy Infrastructure",
	layers: [petroleumPipes, naturalGasPipes, naturalGasStorage, natGasWells, oilWells, coalMines, biodieselPlants, biomass, transmissionLines, powerPlants]
});

const energyPotential = new GroupLayer({
	title: "Energy Potential",
	layers: [coalFields, oilShale, sedimentaryBasin, uraniumFavorableAreas, biomass, geothermal, onshoreWind, offshoreWind, solar]
});

const administrativeBoundaries = new GroupLayer({
	title: "Administrative Boundaries",
	layers: [virginiaBoundary, virginiaCounty]
});
const legend = new Legend({
	view: view
});

const basemapGallery = new BasemapGallery({
	view: view,
	container: document.createElement("div")
});

const bgExpand = new Expand({
	view: view,
	content: basemapGallery
});

// ADDING MAP VISUALS
view.ui.add(homeBtn, "top-left");

view.ui.add(legend, "bottom-left");

view.ui.add(bgExpand, "bottom-right");

// SPATIAL QUERY 
let graphics = [];

map.addMany([administrativeBoundaries,energyPotential, energyInfrastructure]);

//map.addMany([virginiaBoundary, virginiaCounty, natGasWells, oilWells, coalMines, biodieselPlants, biomass, powerPlants]);

	virginiaBoundary.queryFeatures().then(function(vaFeatureSet){
		const vaGeometry = vaFeatureSet.features[0].geometry;
		const vaQuery = new Query({
			geometry: vaGeometry,
			spatialRelationship: "intersects",
			outFields: ["*"],
			returnGeometry: true
		});
		return vaQuery;
	})
	.then(filterLayer);

function filterLayer(inVAQuery){
	return utilityTerritories.queryFeatures(inVAQuery).then(displayResults);
}
function displayResults(results) {
	
	results.features.forEach(function (feature, index) {
		const utilityGraphic = new Graphic({
			geometry: feature.geometry,
			attributes: feature.attributes,
			popupTemplate: utilityPopup,
		});
			
		graphics.push(utilityGraphic);
	});

	
	const utilityLayer = new FeatureLayer({
		title: "Electric Retail Service Territories in Virginia",
		source: graphics,
		attributes: graphics.attributes,
		popupTemplate: utilityPopup,
		objectIdField: "OBJECTID",
		renderer: utilityRenderer,
		visible: false,
	});
	
map.addMany([utilityLayer]);
};

 
}); 