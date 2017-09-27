
	function createVideoWindow (iparentElement, iid)
	{
		parentElement = iparentElement
		id = iid
		parentElement.innerHTML = "Hello"
		/*	<div class='select'>
				<label for='videoSource'>Video source: </label><select id='videoSource'+id+''></select>
			</div>
			<video autoplay='true' id='videoElement'+id+''/>
		";*/
		
		video = document.querySelector('#videoElement' + id);
		videoSelect  = document.querySelector('select#videoSource' + id);
	}
