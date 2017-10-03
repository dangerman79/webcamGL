var noOfWigets = 0;

function setupAccordion ()
{
	var acc = document.getElementsByClassName("accordion");
	var i;

	for (i = 0; i < acc.length; i++) {
	  acc[i].onclick = function() {
		this.classList.toggle("active");
		var panel = this.nextElementSibling;
		if (panel.style.maxHeight){
		  panel.style.maxHeight = null;
		} else {
		  panel.style.maxHeight = panel.scrollHeight + "px";
		} 
	  }
	}
}

function addWidgetAccordionSegment(widget)
{
	noOfWigets++
	panelId = "widgetPanel" + noOfWigets;
	domObjs = addAccordionSegment(mainDomElement, widget.data.label, panelId);
	widget.panelDom = domObjs.panelDom;
	widget.labelDom = domObjs.labelDom;

	widget.labelDom.addEventListener("change", updateWidgetLabel.bind(this, widget));
}

function expandWidget(widget)
{
		widget.panelDom.style.maxHeight = widget.panelDom.scrollHeight + "px";
}


function addAccordionSegment(parentElement, label, id)
{
	currentHTML = parentElement.innerHTML
	labelId = id+"Label"
	newHTML = '<button class="accordion"><input class="accordionLabel" type="text" id="' + labelId + '" value="' + label + '"></button>'
	newHTML = newHTML + '<div class="panel" id="' + id + '">'
	newHTML = newHTML + '</div>'
	parentElement.innerHTML = newHTML + currentHTML
	
	var retObj = {}
	retObj.panelDom = document.querySelector('#' + id)
	retObj.labelDom = document.querySelector('#' + labelId)
	
	return retObj
	//setupAccordion ()
}