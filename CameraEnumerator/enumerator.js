
	function createVideoWindow (iparentElement, iid)
	{
		parentElement = iparentElement;
		id = iid;
		webcamHTML = "<div class='select'>";
		webcamHTML = webcamHTML + "<label for='videoSource'>Video source: </label><select id='videoSource"+id+"'></select>";
		webcamHTML = webcamHTML + "</div>"
		webcamHTML = webcamHTML + "<video autoplay='true' class='videoWindow' id='videoElement"+id+"'/>"
		parentElement.innerHTML = webcamHTML
		video = document.querySelector('#videoElement' + id);
		videoSelect  = document.querySelector('select#videoSource' + id);
	}
