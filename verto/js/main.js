(function() {
  var vertoHandle, vertoCallbacks, currentCall;

	var curCallStatus = JSON.parse(localStorage.getItem('call_status'));
	if(curCallStatus == null || curCallStatus == 'hangup' || curCallStatus == 'destroy') {
		$.verto.init({}, bootstrap);
	} else {
		alert('Is In Call Now');
	}

  function bootstrap(status) {
    vertoHandle = new jQuery.verto({
      login: '1001@verto.pesoq.com',
      passwd: 'tangbull',
      socketUrl: 'wss://verto.pesoq.com:8082',
      ringFile: 'sounds/bell_ring2.wav',
      tag: "audio-container",
      deviceParams: {
      useMic: true,
      useSpeak: true,
        useCamera: false,
	      useMic: 'any',
	      useSpeak: 'any',
      },
      iceServers: false
    }, vertoCallbacks);

    document.getElementById("make-call").addEventListener("click", makeCall);
    document.getElementById("hang-up-call").addEventListener("click", hangupCall);
    document.getElementById("answer-call").addEventListener("click", answerCall);
  };

  function makeCall() {
//	 vertoHandle.videoParams({
//	    // Dimensions of the video feed to send.
//	    minWidth: 320,
//	    minHeight: 240,
//	    maxWidth: 640,
//	    maxHeight: 480,
//	    // The minimum frame rate of the client camera, Verto will fail if it's
//	    // less than this.
//	    minFrameRate: 15,
//	    // The maximum frame rate to send from the camera.
//	    vertoBestFrameRate: 30,
//	  });
  	
	  currentCall = vertoHandle.newCall({
	    destination_number: '1001',
	    caller_id_name: 'Test Guy',
	    caller_id_number: '1000',
	    outgoingBandwidth: 'default',
	    incomingBandwidth: 'default',
	    useStereo: true,
	    useVideo: false,
	    mirrorInput: true,
	    userVariables: {
	    	avatar: "",
	      email: 'test@test.com',
	    },
	    dedEnc: false,
	  });
	};
	
	function onDialogState(dialog) {
		if(!currentCall) {
	    currentCall = dialog;
	  }
		
	  switch (dialog.state.name) {
	  	case "ringing":
	    	alert('Someone is calling you, answer!');
	    	localStorage.setItem('call_status', JSON.stringify(dialog.state.name));
	      break;
	    case "trying":
	    	console.log('Call Status: ' + dialog.state.name)
	    	console.log('Is try to call now');
	    	localStorage.setItem('call_status', JSON.stringify(dialog.state.name));
	      break;
	    case "answering":
	    	console.log('Call Status: ' + dialog.state.name)
	    	console.log('Is Answer call');
	    	localStorage.setItem('call_status', JSON.stringify(dialog.state.name));
	      break;
	    case "active":
	    	console.log('Call Status: talking')
	    	console.log('Is talking to' + 'telephone number’');
	    	localStorage.setItem('call_status', JSON.stringify('talking'));
	      break;
	    case "hangup":
	      console.log("Call ended with cause: " + dialog.cause);
	      console.log('Call Status: ' + dialog.state.name)
	    	console.log('Hang Up');
	    	localStorage.setItem('call_status', JSON.stringify(dialog.state.name));
	      break;
	    case "destroy":
	      // Some kind of client side cleanup...
	      break;
	  }
	};

	
  function hangupCall() {
    currentCall.hangup();
  };
  
  function answerCall() {
	  currentCall.answer();
	};

  vertoCallbacks = {
  	onMessage: onMessage,
    onWSLogin: onWSLogin,
    onWSClose: onWSClose,
    onDialogState: onDialogState,
  };
  
//function onDialogState(dialog) {
//	  console.debug('onDialogState', dialog);
//	
//	  if(!currentCall) {
//	    currentCall = dialog;
//	  }
//	
//	  if(dialog.state.name == 'ringing') {
//	    alert('Someone is calling you, answer!');
//	  }
//	};

  function onWSLogin(verto, success) {
    console.log('onWSLogin', success);
  };

  function onWSClose(verto, success) {
    console.log('onWSClose', success);
  };
  
  function onMessage(verto, dialog, message, data) {
  	console.log(message,dialog)
  };
})();
