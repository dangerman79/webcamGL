var noOfChroma = 0;

function CreateChromaMaskWidgetObj ()
{
	newWidget = new WidgetObj ()
	
	//unique vars on this object
	newWidget.data.tolerance = 0;
	newWidget.data.showSamplePx = true
	newWidget.data.liveSampling = true
	newWidget.data.samplePx = [];
	
	//constructor
	noOfChroma++;
	newWidget.data.label = "Chroma Mask #" + noOfChroma;
	newWidget.data.type = 'chromaMask'

	
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
	
		newLabel = document.createElement('label');
		newLabel.innerHTML = 'Live Sampling:';
		controlsDiv.appendChild(newLabel);	
		
		newCheck = document.createElement('input');
		newCheck.type = "checkbox"
		controlsDiv.appendChild(newCheck);
		newCheck.addEventListener("change", chromaSettingsChange.bind(event, widget));
		controlsDiv.appendChild(newCheck);
		widget.liveSampleDom = newCheck;
		widget.liveSampleDom.checked = widget.data.liveSampling 
	
		newLabel = document.createElement('label');
		newLabel.innerHTML = 'Show Sample Pixels:';
		controlsDiv.appendChild(newLabel);
	
		showSamplePxCheck = document.createElement('input');
		showSamplePxCheck.type = "checkbox"
		controlsDiv.appendChild(showSamplePxCheck);
		widget.samplePxDom = showSamplePxCheck;
		widget.samplePxDom.checked = widget.data.showSamplePx
		showSamplePxCheck.addEventListener("change", chromaSettingsChange.bind(event, widget));
	
		newbutton = document.createElement('button');
		newbutton.innerHTML = 'Clear Sample Pixels';
		controlsDiv.appendChild(newbutton);
	
		newbutton.addEventListener("click", clearSamplePx.bind(event, widget));
		
		newCanvas = document.createElement('canvas');
		widget.panelDom.appendChild(newCanvas);
		widget.canvasDom = newCanvas;
		widget.canvasDom.addEventListener("click", addSamplePx.bind(event, widget));
		
		var draw = function (widget) {
			if (widget.data.isActive != false )requestAnimationFrame(draw.bind(event, widget));
			
			// apply an image filter to the context
			applyChromaMask(widget);
		}

		requestAnimationFrame(draw.bind(event, widget));
	}
	
	return newWidget;
}

function applyChromaMask(widget) 
{	
	if(widget.sourceWidget.canvasDom == null) return
	
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
	
	if (widget.data.liveSampling == true) 
	{
		setChromaRangeFromSamples(widget, width, height, inputImData)
	}
	  // modify pixels applying a simple effect
	  for (var i = 0; i < inputImData.length; i+=4) {
		r = inputImData[i]
		g = inputImData[i + 1]
		b = inputImData[i + 2]
		
		if (
			r >= widget.colLo.r &&
			g >= widget.colLo.g &&
			b >= widget.colLo.b &&
			r <= widget.colHi.r &&
			g <= widget.colHi.g &&
			b <= widget.colHi.b
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
		
		// note: i+3 is the alpha channel, we are skipping that one
	  }
	  
	if (widget.data.showSamplePx == true)
	{
	  widget.data.samplePx.forEach (function(px) 
	  {
		  for(var q = -5; q<=5; q++)
		  {
			dataLoc = getPointLocationInData(px.x+q, px.y+q, width, height)
			outImData[dataLoc] = 255;
			outImData[dataLoc + 1] = 0;
			outImData[dataLoc + 2] = 0;
			
			dataLoc = getPointLocationInData(px.x-q, px.y+q, width, height)
			outImData[dataLoc] = 255;
			outImData[dataLoc + 1] = 0;
			outImData[dataLoc + 2] = 0;
		  }
	  })
	}
	
	// render pixels back
	writeContext.putImageData(imageDataOut, 0, 0);
}

function setChromaRangeFromSamples(widget, width, height, data)
{
	colLo = new Col(255,255,255,0);
	colHi = new Col(0,0,0,0);
	widget.data.samplePx.forEach (function(px) 
	{
		sampleCol = getCol(px.x, px.y, width, height, data)
		if (sampleCol.r > colHi.r) {colHi.r = sampleCol.r}
		if (sampleCol.g > colHi.g) {colHi.g = sampleCol.g}
		if (sampleCol.b > colHi.b) {colHi.b = sampleCol.b}
		
		if (sampleCol.r < colLo.r) {colLo.r = sampleCol.r}
		if (sampleCol.g < colLo.g) {colLo.g = sampleCol.g}
		if (sampleCol.b < colLo.b) {colLo.b = sampleCol.b}
	})
	
	colHi.r = colHi.r + widget.data.tolerance;
	colHi.g = colHi.g + widget.data.tolerance;
	colHi.b = colHi.b + widget.data.tolerance;
	
	colLo.r = colLo.r - widget.data.tolerance;
	colLo.g = colLo.g - widget.data.tolerance;
	colLo.b = colLo.b - widget.data.tolerance;
	
	widget.colHi = colHi
	widget.colLo = colLo

}

function chromaInputChange(widget, event)
{
	var newSrcStr = event.target.value;
	widget.data.selectedDeviceId = newSrcStr;
	widget.sourceWidget = getWidgetById (newSrcStr)
}

function chromaSettingsChange(widget, event)
{
	widget.data.showSamplePx = widget.samplePxDom.checked;
	widget.data.liveSampling = widget.liveSampleDom.checked
	tol = widget.toleranceDom.value
	if(isNumeric(tol)){
		widget.data.tolerance = Number(widget.toleranceDom.value);
	}
}

function addSamplePx(widget, event)
{
	var px= new Point(event.offsetX, event.offsetY);
	widget.data.samplePx.push(px);
}
function clearSamplePx(widget, event)
{
	widget.data.samplePx = [];
}