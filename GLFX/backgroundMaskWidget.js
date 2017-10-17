var noOfChromaBkMask = 0;

function CreateBackroundMaskWidgetObj ()
{
	newWidget = new WidgetObj ()
	
	//unique vars on this object
	newWidget.isSampling = false;
	newWidget.sampleImLo = [];
	newWidget.sampleImHi = [];
	
	//constructor
	newWidget.data.tolerance = 0;
	noOfChromaBkMask++;
	newWidget.data.label = "Backround Mask #" + noOfChromaBkMask;
	newWidget.data.type = 'backroundMask'

	//methods
	newWidget.buildDomElement = function (widget) {
		
		controlsDiv = widget.controlsDivDom
	
	
		newLabel = document.createElement('label');
		newLabel.innerHTML = 'Source Widget: ';
		controlsDiv.appendChild(newLabel);
		
		newSelect = document.createElement('select');
		controlsDiv.appendChild(newSelect);
		newSelect.value = widget.data.selectedDeviceId;
		widget.widgetSelectors.push(newSelect);
		widget.widgetSelectors.forEach (function(newSelect) {
			newSelect.addEventListener("change", chromaInputChange.bind(event, widget));
		})
				
		newLabel = document.createElement('label');
		newLabel.innerHTML = 'Tolerance:';
		controlsDiv.appendChild(newLabel);
	
		tolerance = document.createElement('input');
		tolerance.type = "text"
		tolerance.value = widget.data.tolerance ;
		controlsDiv.appendChild(tolerance);
		widget.toleranceDom = tolerance;
		tolerance.addEventListener("change", chromaSettingsChange.bind(event, widget));
		
		newbutton = document.createElement('button');
		newbutton.innerHTML = 'Sample Backround';
		controlsDiv.appendChild(newbutton);
		newbutton.addEventListener("click", sampleBkClick.bind(event, widget));
		
		newCanvas = document.createElement('canvas');
		widget.panelDom.appendChild(newCanvas);
		widget.canvasDom = newCanvas;
		
		var draw = function (widget) {
			if (widget.data.isActive != false )requestAnimationFrame(draw.bind(event, widget));
			
			// apply an image filter to the context
			applyBkMask(widget);
		}

		requestAnimationFrame(draw.bind(event, widget));
	}		
	
	newWidget.changeMethod = function (widget) {
		widget.sourceWidget = getWidgetById (widget.data.selectedDeviceId)
		tol = widget.toleranceDom.value //TODO check tol is loading correctly
		if(isNumeric(tol)){
			widget.data.tolerance = Number(widget.toleranceDom.value);
		}
		
	}
	return newWidget;	
}

function applyBkMask(widget) 
{	
	if(widget.sourceWidget == null || widget.sourceWidget.canvasDom == null ) return
	if (widget.isSampling){
		sampleBk(widget);
		return
	}
	readContext = widget.sourceWidget.canvasDom.getContext('2d')
	writeContext = widget.canvasDom.getContext('2d')

	width = widget.sourceWidget.canvasDom.width;
	height = widget.sourceWidget.canvasDom.height;
	
	widget.canvasDom.width = width;
	widget.canvasDom.height = height;
	
	// read pixels
	var imageDataIn = readContext.getImageData(0, 0, width, height);
	inputImData = imageDataIn.data; // data is an array of pixels in RGBA
	
	var imageDataOut =  writeContext.getImageData(0, 0, width, height);
	outImData = imageDataOut.data
	
	tol = widget.data.tolerance
	
	for (var i = 0; i < inputImData.length; i+=4) {
		r = inputImData[i]
		g = inputImData[i + 1]
		b = inputImData[i + 2]
		
		rHi = widget.sampleImHi[i]
		gHi = widget.sampleImHi[i+1]
		bHi = widget.sampleImHi[i+2]
		
		rLo = widget.sampleImLo[i]
		gLo = widget.sampleImLo[i+1]
		bLo = widget.sampleImLo[i+2]
	
		if (
			r >= rLo - tol &&
			g >= gLo - tol &&
			b >= bLo - tol &&
			r <= rHi + tol &&
			g <= gHi + tol &&
			b <= bHi + tol
		){
			outImData[i] = 0;
			outImData[i + 1] = 255;
			outImData[i + 2] = 255;
			outImData[i + 3] = 255;
			
		}else{
			outImData[i] = r;
			outImData[i + 1] = g;
			outImData[i + 2] = b;
			outImData[i + 3] = 255;
		}	
	}
	// render pixels back
	writeContext.putImageData(imageDataOut, 0, 0);
}
function sampleBkClick(widget, event)
{
	widget.sampleImLo = []
	widget.sampleImHi = []
	widget.isSampling = true;
	setTimeout(function(){ //TODO ensure widget is passed in
		widget.isSampling = false;
		alert("Background Sample Created"); 	
	}, 3000);
	
}

function sampleBk(widget)
{
	readContext = widget.sourceWidget.canvasDom.getContext('2d')
	width = widget.sourceWidget.canvasDom.width;
	height = widget.sourceWidget.canvasDom.height;
	
	var imageDataIn = readContext.getImageData(0, 0, width, height);
	inputImData = imageDataIn.data; // data is an array of pixels in RGBA
	
	//set initial values
	if (widget.sampleImLo.length == 0){
		for (var i = 0; i < inputImData.length; i++) {
			widget.sampleImLo[i] = inputImData[i];
			widget.sampleImHi[i] = inputImData[i];
		}	
	}else{
		for (var i = 0; i < inputImData.length; i++) {
			if (inputImData[i] > widget.sampleImHi[i]) {widget.sampleImHi[i] = inputImData[i]}
			if (inputImData[i] < widget.sampleImLo[i]) {widget.sampleImLo[i] = inputImData[i]}
		}
	}
}