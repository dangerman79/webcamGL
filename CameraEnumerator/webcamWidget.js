var widgets = []

var noOfCams = 0;

function createWebcamWidget()
{
		var widget = new webcam();
		
		noOfCams++;
		label = "Webcam #" + noOfCams;
		
		widget.data.label = label
		
		
		// Maybe split out from here for save load?
		addWidgetAccordionSegment(widget);
		addWebcamPanel(widget)
		
		
		// I AM HERE
		widgets.push(widget);
		//createCam (viewports[widget.data.viewportId]);

		
		setupAccordion ()
	
	
}

function addWebcamPanel(widget)
{
	
	
	
}