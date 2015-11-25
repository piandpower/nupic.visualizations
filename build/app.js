angular.module("app",["ui.bootstrap"]),angular.module("app").constant("appConfig",{TIMESTAMP:"timestamp",POSSIBLE_OPF_DATA_FIELDS:["multiStepPredictions.actual","multiStepBestPredictions.actual"],EXCLUDE_FIELDS:[],HEADER_SKIPPED_ROWS:2,ZOOM:"HighlightSelector",NONE_VALUE_REPLACEMENT:0}),angular.module("app").controller("appCtrl",["$scope","$timeout","appConfig",function(e,i,t){e.view={fieldState:[],graph:null,canRender:!1,dataField:null,optionsVisible:!0,loadedFileName:"",renderedFileName:"",errors:[]};var n,a,l,r=[],o=[],d={};e.toggleOptions=function(){e.view.optionsVisible=!e.view.optionsVisible,e.view.graph&&(d.resize=i(function(){e.view.graph.resize()}))},e.uploadFile=function(i){e.view.canRender=!1,e.view.loadedFileName=i.target.files[0].name,r.length=0,o.length=0,Papa.parse(i.target.files[0],{skipEmptyLines:!0,header:!0,dynamicTyping:!0,complete:function(i){s(i.data),e.view.canRender=r.length>0?!0:!1,e.$apply()},error:function(e){u(e,"danger")}})};var u=function(i,t,n){if(n="undefined"!=typeof n?n:!1,exists=!1,n){errs=e.view.errors;for(var a=0;a<errs.length;a++)if(errs[a].message===i)return}e.view.errors.push({message:i,type:t})};e.clearErrors=function(){e.view.errors.length=0},e.clearError=function(i){e.view.errors.splice(i,1)};var s=function(e){e.splice(0,t.HEADER_SKIPPED_ROWS);var i=h(e[e.length-1],t.EXCLUDE_FIELDS);if(null===i)return u("Failed to parse the uploaded CSV file!","danger"),null;for(var n=0;n<e.length;n++){for(var a=[],l=0;l<o.length;l++){var d=e[n][o[l]];0===l?("number"==typeof d?date=d:"string"==typeof d&&(date=f(d)),null!==date?d=date:null===date&&"number"==typeof d?u("Parsing timestamp failed, fallback to x-data","warning",!0):(u("Parsing timestamp failed & it is non-numeric, fallback to using iteration number","warning",!0),d=n)):"None"===d&&(d=t.NONE_VALUE_REPLACEMENT),a.push(d)}r.push(a)}},f=function(e){var i=new Date(e);if("Invalid Date"!==i.toString())return i;var t=String(e).split(" "),n=[],a=t[0].split("/"),l=t[0].split("-");if(1===a.length&&1===l.length||a.length>1&&l.length>1)return u("Could not parse the timestamp","warning",!0),null;if(l.length>2)n.push(l[0]),n.push(l[1]),n.push(l[2]);else{if(!(a.length>2))return u("There was something wrong with the date in the timestamp field.","warning",!0),null;n.push(a[2]),n.push(a[0]),n.push(a[1])}if(t[1]){var r=t[1].split(":");n=n.concat(r)}for(var o=0;o<n.length;o++)n[o]=parseInt(n[o]);return i=new(Function.prototype.bind.apply(Date,[null].concat(n))),"Invalid Date"===i.toString()?(u("The timestamp appears to be invalid.","warning",!0),null):i};e.normalizeField=function(i){var t=i+1;if(null===e.view.dataField)return void console.warn("No data field is set");for(var a=parseInt(e.view.dataField)+1,l=function(e,i){return Math[i].apply(null,e)},r=[],o=[],d=0;d<n.length;d++)"number"==typeof n[d][a]&&"number"==typeof n[d][t]&&(r.push(n[d][a]),o.push(n[d][t]));for(var u=l(r,"max")-l(r,"min"),s=l(o,"max")-l(o,"min"),f=u/s,p=0;p<n.length;p++)n[p][t]=parseFloat((n[p][t]*f).toFixed(10));e.view.graph.updateOptions({file:n})},e.denormalizeField=function(i){for(var t=i+1,a=0;a<n.length;a++)n[a][t]=l[a][t];e.view.graph.updateOptions({file:n})},e.renormalize=function(){for(var i=0;i<e.view.fieldState.length;i++)e.view.fieldState[i].normalized&&e.normalizeField(e.view.fieldState[i].id)};var p=function(i,t){for(var n=0;n<e.view.fieldState.length;n++)if(e.view.fieldState[n].name===i){e.view.fieldState[n].value=t;break}},g=function(i){for(var t=0;t<i.length;t++)e.view.fieldState[t].color=i[t]},c=function(i){for(var t=0;t<e.view.fieldState.length;t++)if(i.indexOf(e.view.fieldState[t].name)>-1){e.view.dataField=e.view.fieldState[t].id;break}},h=function(e,i){return e.hasOwnProperty(t.TIMESTAMP)?(angular.forEach(e,function(e,n){"number"==typeof e&&-1===i.indexOf(n)&&n!==t.TIMESTAMP&&o.push(n)}),o.unshift(t.TIMESTAMP),o):(u("No timestamp field was found","warning"),null)};e.toggleVisibility=function(i){e.view.graph.setVisibility(i.id,i.visible),i.visible||(i.value=null)},e.showHideAll=function(i){for(var t=0;t<e.view.fieldState.length;t++)e.view.fieldState[t].visible=i,e.view.graph.setVisibility(e.view.fieldState[t].id,i),i||(e.view.fieldState[t].value=null)},e.renderData=function(){var i=document.getElementById("dataContainer");n=angular.copy(r),l=angular.copy(r),a=angular.copy(o),e.view.renderedFileName=e.view.loadedFileName,e.view.fieldState.length=0,e.view.dataField=null;for(var d=0,u=0;u<a.length;u++)a[u]!==t.TIMESTAMP&&(e.view.fieldState.push({name:a[u],id:d,visible:!0,normalized:!1,value:null,color:"rgb(0,0,0)"}),d++);c(t.POSSIBLE_OPF_DATA_FIELDS),e.view.graph=new Dygraph(i,n,{labels:a,labelsUTC:!1,showLabelsOnHighlight:!1,xlabel:"Time",ylabel:"Values",strokeWidth:1,highlightSeriesOpts:{strokeWidth:2,strokeBorderWidth:1,highlightCircleSize:3},pointClickCallback:function(e,i){timestamp=moment(i.xval),timestampString=timestamp.format("YYYY-MM-DD HH:mm:ss.SSS000"),window.prompt("Copy to clipboard: Ctrl+C, Enter",timestampString)},animatedZooms:!0,showRangeSelector:"RangeSelector"===t.ZOOM,highlightCallback:function(i,t,n,a,l){for(var r=0;r<n.length;r++)p(n[r].name,n[r].yval);e.$apply()},drawCallback:function(e,i){i&&g(e.getColors())}}),document.getElementById("renderButton").blur()},e.$on("$destroy",function(){angular.forEach(d,function(e){i.cancel(e)})})}]),angular.module("app").directive("fileUploadChange",function(){return{restrict:"A",link:function(e,i,t){var n=e.$eval(t.fileUploadChange);i.bind("change",n),e.$on("$destroy",function(){i.unbind()})}}}),angular.module("app").directive("normalizeFields",function(){return{restrict:"A",scope:!1,template:'<td><input type="checkbox" ng-disabled="field.id === view.dataField || view.dataField === null" ng-model="field.normalized"></td><td><input type="radio" ng-disabled="field.normalized" ng-model="view.dataField" ng-value="{{field.id}}"></td>',link:function(e,i,t){var n={};n.normalized=e.$watch("field.normalized",function(i,t){i?e.normalizeField(e.field.id):i||i===t||e.denormalizeField(e.field.id)}),n.isData=e.$watch("view.dataField",function(){e.renormalize()}),e.$on("$destroy",function(){angular.forEach(n,function(e){e()})})}}});