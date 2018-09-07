/*
 * Licensed to the Apache Software Foundation (ASF) under one
 * or more contributor license agreements.  See the NOTICE file
 * distributed with this work for additional information
 * regarding copyright ownership.  The ASF licenses this file
 * to you under the Apache License, Version 2.0 (the
 * "License"); you may not use this file except in compliance
 * with the License.  You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing,
 * software distributed under the License is distributed on an
 * "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
 * KIND, either express or implied.  See the License for the
 * specific language governing permissions and limitations
 * under the License.
 */
var app = {
    // Application Constructor
    initialize: function() {
        this.bindEvents();
    },
    // Bind Event Listeners
    //
    // Bind any events that are required on startup. Common events are:
    // 'load', 'deviceready', 'offline', and 'online'.
    bindEvents: function() {
        document.addEventListener('deviceready', this.onDeviceReady, false);
    
    },
    // deviceready Event Handler
    //
    // The scope of 'this' is the event. In order to call the 'receivedEvent'
    // function, we must explicitly call 'app.receivedEvent(...);'
    // app.receivedEvent('deviceready');
    onDeviceReady: function() {
      
    	var networkState = navigator.connection.type;
    	document.addEventListener("offline", app.onOffline, false);
    	
    	var states = {};
    	    states[Connection.UNKNOWN]  = 'Unknown connection';
    	    states[Connection.ETHERNET] = 'Ethernet connection';
    	    states[Connection.WIFI]     = 'WiFi connection';
    	    states[Connection.CELL_2G]  = 'Cell 2G connection';
    	    states[Connection.CELL_3G]  = 'Cell 3G connection';
    	    states[Connection.CELL_4G]  = 'Cell 4G connection';
    	    states[Connection.CELL]     = 'Cell generic connection';
    	    states[Connection.NONE]     = 'No network connection';

    	if (states[networkState] === 'No network connection' ) {
			alert('Please connect your device to the Internet');
			
	    	var infoElement = document.getElementById('info');
	    	infoElement.innerHTML= 'Please connect your device to the Internet';

		}else {
			
			window.FirebasePlugin.getToken(function(token) {
				// save this server-side and use it to push notifications to
				// this device
				console.log("getToken : " + token);
				localStorage.setItem('firebase_token', token);
			}, function(error) {
				console.error(error);
			});
			

			window.FirebasePlugin.onTokenRefresh(function(token) {
				// save this server-side and use it to push notifications to
				// this device
				console.log("onTokenRefresh : " + token);
				localStorage.setItem('firebase_token', token);

			}, function(error) {
				console.error(error);
			});
			
			app.browser = cordova.InAppBrowser.open('http://opencarwash.com/admin/', '_blank', 'location=no');
			app.browser.addEventListener('loadstart', app.onLoadstart);
			
		}
    },
    browser:{
    	
    },
    onOffline:function (){
    	var infoElement = document.getElementById('info');
    	infoElement.innerHTML= 'Please connect your device to the Internet';
    	
    	alert('Please connect your device to the Internet');
    	
    	app.browser.close();
    },
    onLoadstart:function ( event ){
    	
    	var token = localStorage.getItem("firebase_token");
    	
    	if ( token != null && token != undefined ) {
    		app.browser.executeScript({
    			code : "localStorage.setItem( 'firebase_token', \'" + token + "\' );"
    		});
		}
    	
    	if ( event.url === 'http://scanner.opencarwash.com/progress.html') {
    		cordova.plugins.barcodeScanner.scan(
		      function (result) {
		    	  
					var code = '';
					if (result.text != null
							&& result.text != undefined) {
						code = "window.location = '"
								+ 'http://opencarwash.com/admin/appointments/in-progress-tickets/modal/'
								+ result.text + "';"
					} else {
						code = "window.location = '"
								+ 'http://opencarwash.com/admin/appointments/in-progress-tickets/modal/'
								+ "';"
					}
		    	  
		    	  app.browser.executeScript({
		    	        code: code
		    	    }, function() {
		    	    	console.log('Redirected!');
		    	  });
		      },
		      function (error) {
		          alert("Scanning failed: " + error);
		      },
		      {
		          "preferFrontCamera" : false, 
		          "showFlipCameraButton" : true, 
		          "prompt" : "Place a barcode inside the scan area", 
		          "orientation" : "landscape" 
		      }
		   );
		} else {
			
			if ( event.url === 'http://scanner.opencarwash.com/paid.html') {
	    		cordova.plugins.barcodeScanner.scan(
			      function (result) {
			    	  

					  var code = '';
					  if (result.text != null
								&& result.text != undefined) {
							code = "window.location = '"
									+ 'http://opencarwash.com/admin/appointments/paid-tickets/modal/'
									+ result.text + "';"
						} else {
							code = "window.location = '"
									+ 'http://opencarwash.com/admin/appointments/paid-tickets/modal/'
									+ "';"
					  }
			    	  
			    	  app.browser.executeScript({
			    	        code: code
			    	    }, function() {
			    	    	console.log('Redirected!');
			    	  });
			      },
			      function (error) {
			          alert("Scanning failed: " + error);
			      },
			      {
			          "preferFrontCamera" : false, 
			          "showFlipCameraButton" : true, 
			          "prompt" : "Place a barcode inside the scan area", 
			          "orientation" : "landscape" 
			      }
			   );
			}
		}
    }
};

app.initialize();

//Plugins 
//cordova plugin add cordova-plugin-inappbrowser
//cordova plugin add cordova-plugin-crosswalk-webview
//cordova plugin add phonegap-plugin-barcodescanner
//cordova plugin add cordova-plugin-network-information

//hellofdf
//Update DOM on a Received Event
//receivedEvent: function(id) {
	//var parentElement = document.getElementById(id);
    //var listeningElement = parentElement.querySelector('.listening');
    //var receivedElement = parentElement.querySelector('.received');

    //listeningElement.setAttribute('style', 'display:none;');
    //    receivedElement.setAttribute('style', 'display:block;');

//    console.log('Received Event: ' + id);
//}

//"preferFrontCamera" : false, // iOS and Android
//"showFlipCameraButton" : true, // iOS and Android
//"prompt" : "Place a barcode inside the scan area", // supported on Android only
//"orientation" : "landscape" // Android only (portrait|landscape), default unset so it rotates with the device
//"formats" : "QR_CODE,PDF_417", // default: all but PDF_417 and RSS_EXPANDED
	
//var ref = cordova.InAppBrowser.open('https://opencarwash.com/admin/appointments/detail/57abb405e4b0e0010a1d7639', '_blank', 'location=no');
//ref.addEventListener('loadstart', app.onLoadstart);
//app.browser.open('https://opencarwash.com/admin/appointments/detail/57abb405e4b0e0010a1d7639', '_blank', 'location=no');
 
 //alert("We got a barcode\n" +
 //      "Result: " + result.text + "\n" +
 //      "Format: " + result.format + "\n" +
 //      "Cancelled: " + result.cancelled);