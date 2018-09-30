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

    tokenReceived: "",

    browser: null,

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
    onOffline:function (){
        var infoElement = document.getElementById('info');
        infoElement.innerHTML= 'Please connect your device to the Internet';
        alert('Please connect your device to the Internet');
        app.browser.close();
        if (document.app) {
         document.app.exitApp();
        } else if (document.device) {
          document.device.exitApp();
        } else {
          window.close();
        }
    },
    onLoadstart:function ( event ){
        app.storeToken();
    },
    updateInfo:function(data){

        var info = document.getElementById('info');
        info.innerHTML = data;
    },
    // deviceready Event Handler
    //
    // The scope of 'this' is the event. In order to call the 'receivedEvent'
    // function, we must explicitly call 'app.receivedEvent(...);'
    // app.receivedEvent('deviceready');
    onDeviceReady: function() {

        var networkState = navigator.connection.type;
    	document.addEventListener("offline", app.onOffline, false);
    	
        // gfb #1719
         FCMPlugin.getToken(function(token) {
              if(token) {
                app.tokenReceived = token;
                app.storeToken();
              } else {
              	console.log('[GET] Token has not been established yet');
                //alert('[GET] Token has not been established yet');

                // gfb #1719
	    		FCMPlugin.onTokenRefresh(function(token) {
	            // save this server-side and use it to push notifications to this device
	            	if(token) {
		                app.tokenReceived = token;
		                app.storeToken();
	            	} else {
	            		console.log('[REFRESH] Token has not been established yet');
	            		//alert('[REFRESH] Token has not been established yet');
	            	}
	            }, function(error) {
	            	console.log(error);
	              //alert(error);
	            });
              }
          }, function(error) {
            	console.log(error);
              //alert(error);
          });
          
         // gfb #1719
         FCMPlugin.onNotification(function(notification) {
              //alert(JSON.stringify(notification));
               //if(notification.wasTapped){
                 //Notification was received on device tray and tapped by the user.
                  //app.browser.executeScript({
                  //    code: "handleNotificationMessage('"+JSON.stringify(notification)+"');"
                  //    }, function() {
                  //    });

               //} else {
                  //Notification was received in foreground. 
                  //Maybe the user needs to be notified.

                  app.browser.executeScript({
                     code: "handleNotificationMessageFromMobile('"+JSON.stringify(notification)+"');"
                    }, function() {
                    });
               //}
            }, function(msg) {
              console.log(msg);
            
            }, function(error) {
            	console.log(error);
             
            });

            //http://cordova-plugin-integration.s3-website-us-west-2.amazonaws.com/
            //https://frontend.develop.prevvy.co
            app.browser = cordova.InAppBrowser.open('http://cordova-plugin-integration.s3-website-us-west-2.amazonaws.com', '_blank', 'location=no,zoom=no,hidden=yes,clearsessioncache=yes,clearcache=yes');
            app.browser.hide();

            var getParams = function(url) {
                  var params = {};
                  var parser = document.createElement('a');
                  parser.href = url;
                  var query = parser.search.substring(1);
                  var vars = query.split('&');
                  for (var i = 0; i < vars.length; i++) {
                    var pair = vars[i].split('=');
                    params[pair[0]] = decodeURIComponent(pair[1]);
                  }
                  return params;
                };


                var onLoadstart = function(event) {
                  if (event.url.includes("/plugin1")) {
                    var srcType = Camera.PictureSourceType.CAMERA;
                    var options = {
                      // Some common settings are 20, 50, and 100
                      quality: 100,
                      destinationType: Camera.DestinationType.DATA_URL,
                      // In this app, dynamically set the picture source, Camera or photo gallery
                      sourceType: srcType,
                      encodingType: Camera.EncodingType.JPEG,
                      mediaType: Camera.MediaType.PICTURE,
                      allowEdit: true,
                      correctOrientation: true //Corrects Android orientation quirks
                    };

                    TesseractPlugin.loadLanguage("eng", function(response) {
                      navigator.camera.getPicture(function(imageData) {
                        TesseractPlugin.recognizeText(imageData, "eng", function(recognizedText) {
                          alert(recognizedText);
                          var val = app.b64EncodeUnicode(recognizedText);
                          app.browser.executeScript({
                            code: "localStorage.setItem( 'recognizedText', '" + val + "' );"
                          });

                        }, function(reason) {
                          alert('Error on recognizing text from image. ' + reason);
                        });
                      }, function(error) {
                        alert("Unable to obtain picture: " + error, "app");
                      }, options);
                    }, function(reason) {
                      alert('Error on loading OCR file for your language. ' + reason);
                    });

                  } else if (event.url.includes("/plugin2")) {
                    window.plugins.launcher.launch({
                      packageName: 'com.facebook.katana'
                    }, function(data) {
                      alert("Success!");
                      // if calling canLaunch() with getAppList:true, data will contain an array named "appList" with the package names of          applications that can handle the uri specified.
                    }, function(errMsg) {
                      alert("Error! " + errMsg);
                    });
                  } else if (event.url.includes("/plugin3")) {

                    var params = getParams(event.url);

                    navigator.health.requestAuthorization([
                      'steps', 'distance', 'appleExerciseTime', 'calories', 'calories.active', 'calories.basal', 'activity', 'height', 'weight', 'heart_rate', 'fat_percentage', 'blood_glucose', 'insulin', 'blood_pressure', 'gender', 'date_of_birth', 'nutrition', 'nutrition.calories', 'nutrition.fat.total', 'nutrition.fat.saturated', 'nutrition.fat.unsaturated', 'nutrition.fat.polyunsaturated', 'nutrition.fat.monounsaturated', 'nutrition.fat.trans', 'nutrition.cholesterol', 'nutrition.sodium', 'nutrition.potassium', 'nutrition.carbs.total', 'nutrition.dietary_fiber', 'nutrition.sugar', 'nutrition.protein', 'nutrition.vitamin_a', 'nutrition.vitamin_c', 'nutrition.calcium', 'nutrition.iron', 'nutrition.water', 'nutrition.caffeine'
                    ], function(data) {

                      var dataTypes = params["dataType"].split(',');

                      app.result = {};
                      app.cont = 0;
                      for (var i = 0; i < dataTypes.length; i++) {
                          app.cont++;
                          app.query(dataTypes[i].trim(), params["startDate"].toDate("mm/dd/yyyy hh:ii:ss"), params["endDate"].toDate("mm/dd/yyyy hh:ii:ss"));
                      }
                      // if calling canLaunch() with getAppList:true, data will contain an array named "appList" with the package names of          applications that can handle the uri specified.
                    }, function(errMsg) {
                      alert("Error1! " + errMsg);
                    });
                  }
                }

            app.browser.addEventListener('loadstart', onLoadstart);

            //app.browser.addEventListener('loadstart', onLoadstart);
            //app.browser.addEventListener('loadstop', app.onLoadstart);
            //app.browser.addEventListener('loaderror', app.onLoaderror);
                             
    },
    storeToken: function() {
    	// gfb #1719
    	//alert("Token received: " + app.tokenReceived);
        app.browser.executeScript({
            code: "if (typeof(Storage) !== 'undefined') { localStorage.setItem('firebase_token', '" + app.tokenReceived + "'); } else { alert('This browser does not support local storage!');};"
        }, function() {

        });
    },
    onLoadstart: function () {
        app.browser.show();
    },
    onLoaderror: function () {
      var infoElement = document.getElementById('info');
      infoElement.innerHTML= 'Prevvy servers are unreacheable';
      alert('Prevvy servers are unreacheable');
      app.browser.close();
      if (document.app) {
         document.app.exitApp();
      } else if (document.device) {
          document.device.exitApp();
      } else {
          window.close();
      }
   }
      
};

String.prototype.toDate = function(format)
{
  var normalized      = this.replace(/[^a-zA-Z0-9]/g, '-');
  var normalizedFormat= format.toLowerCase().replace(/[^a-zA-Z0-9]/g, '-');
  var formatItems     = normalizedFormat.split('-');
  var dateItems       = normalized.split('-');

  var monthIndex  = formatItems.indexOf("mm");
  var dayIndex    = formatItems.indexOf("dd");
  var yearIndex   = formatItems.indexOf("yyyy");
  var hourIndex     = formatItems.indexOf("hh");
  var minutesIndex  = formatItems.indexOf("ii");
  var secondsIndex  = formatItems.indexOf("ss");

  var today = new Date();

  var year  = yearIndex>-1  ? dateItems[yearIndex]    : today.getFullYear();
  var month = monthIndex>-1 ? dateItems[monthIndex]-1 : today.getMonth()-1;
  var day   = dayIndex>-1   ? dateItems[dayIndex]     : today.getDate();

  var hour    = hourIndex>-1      ? dateItems[hourIndex]    : today.getHours();
  var minute  = minutesIndex>-1   ? dateItems[minutesIndex] : today.getMinutes();
  var second  = secondsIndex>-1   ? dateItems[secondsIndex] : today.getSeconds();

  return new Date(year,month,day,hour,minute,second);
};

app.initialize();
