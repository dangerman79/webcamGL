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

function addAccordionSegment(parentElement, label, id)
{
	currentHTML = parentElement.innerHTML
	newHTML = '<button class="accordion">'+ label +'</button>'
	newHTML = newHTML + '<div class="panel" id="' + id + '">'
	newHTML = newHTML + '</div>'
	parentElement.innerHTML = newHTML + currentHTML

	
	
	//setupAccordion ()
}