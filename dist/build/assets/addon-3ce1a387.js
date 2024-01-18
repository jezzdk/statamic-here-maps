function f(a,e,t,r,i,n,h,m){var s=typeof a=="function"?a.options:a;e&&(s.render=e,s.staticRenderFns=t,s._compiled=!0),r&&(s.functional=!0),n&&(s._scopeId="data-v-"+n);var l;if(h?(l=function(o){o=o||this.$vnode&&this.$vnode.ssrContext||this.parent&&this.parent.$vnode&&this.parent.$vnode.ssrContext,!o&&typeof __VUE_SSR_CONTEXT__<"u"&&(o=__VUE_SSR_CONTEXT__),i&&i.call(this,o),o&&o._registeredComponents&&o._registeredComponents.add(h)},s._ssrRegister=l):i&&(l=m?function(){i.call(this,(s.functional?this.parent:this).$root.$options.shadowRoot)}:i),l)if(s.functional){s._injectStyles=l;var d=s.render;s.render=function(c,u){return l.call(u),d(c,u)}}else{var p=s.beforeCreate;s.beforeCreate=p?[].concat(p,l):[l]}return{exports:a,options:s}}const v={mixins:[Fieldtype],data(){return{lat:null,lng:null,markerLat:null,markerLng:null,zoom:null,type:null,showControls:!1,style:null,map:null,marker:null,hasMarker:!1,stylesExpanded:!1,behavior:null,ui:null,geocoder:null,location:null,platform:null,defaultLayers:null}},watch:{lat(){this.saveLocation()},lng(){this.saveLocation()},markerLat(){this.saveLocation()},markerLng(){this.saveLocation()},zoom(){this.saveLocation()},type(){this.map&&this.map.setBaseLayer(this.determineMapType()),this.saveLocation()},style(){this.saveLocation()},showControls(){this.saveLocation()}},computed:{hasGeocoder(){return this.config.geocoder},canReset(){return this.meta.defaultLat&&this.meta.defaultLng},mapHasChanged(){return this.lat!=this.meta.defaultLat||this.lng!=this.meta.defaultLng||this.zoom!=this.config.initialZoom||this.type!=this.config.mapType},hasGeolocation(){return navigator.geolocation||!1}},mounted(){this.lat=this.value.lat||this.meta.defaultLat,this.lng=this.value.lng||this.meta.defaultLng,this.markerLat=this.value.markerLat,this.markerLng=this.value.markerLng,this.zoom=this.value.zoom||this.config.initialZoom||16,this.type=this.value.type||"normal.map",this.style=this.value.style,this.showControls=this.value.showControls,this.platform=new H.service.Platform({apikey:this.meta.apiKey}),this.defaultLayers=this.platform.createDefaultLayers(),this.map=new H.Map(this.$refs.map,this.determineMapType(),{center:{lat:Number.parseFloat(this.lat),lng:Number.parseFloat(this.lng)},zoom:Number(this.zoom),pixelRatio:window.devicePixelRatio||1}),window.addEventListener("resize",()=>this.map.getViewPort().resize()),this.behavior=new H.mapevents.Behavior(new H.mapevents.MapEvents(this.map)),this.ui=H.ui.UI.createDefault(this.map,this.defaultLayers,"en-US"),this.ui.getControl("mapsettings").setVisibility(!1),this.config.markers&&this.markerLat&&this.markerLng&&this.addMarker({lat:Number.parseFloat(this.markerLat),lng:Number.parseFloat(this.markerLng)}),this.config.geocoder&&(this.geocoder=this.platform.getSearchService()),this.addMapListeners()},methods:{addMapListeners(){this.map.addEventListener("mapviewchangeend",(a,e,t)=>{this.zoom=this.map.getZoom(),this.lat=this.map.getCenter().lat,this.lng=this.map.getCenter().lng})},addMarker(a){this.marker=new H.map.Marker(a),this.marker.draggable=!0,this.map.addObject(this.marker),this.map.addEventListener("dragstart",this.markerDragStartHandler,!1),this.map.addEventListener("dragend",this.markerDragEndHandler,!1),this.map.addEventListener("drag",this.markerDragHandler,!1),this.markerLat=a.lat,this.markerLng=a.lng,this.hasMarker=!0},removeMarker(){this.hasMarker&&(this.map.removeEventListener("dragstart",this.markerDragStartHandler,!1),this.map.removeEventListener("dragend",this.markerDragEndHandler,!1),this.map.removeEventListener("drag",this.markerDragHandler,!1),this.map.removeObject(this.marker),this.marker=null,this.markerLat=null,this.markerLng=null,this.hasMarker=!1)},resetMap(){this.map.setCenter({lat:Number.parseFloat(this.meta.defaultLat),lng:Number.parseFloat(this.meta.defaultLng)}),this.map.setZoom(Number(this.meta.defaultZoom)||16),this.removeMarker()},saveLocation(){this.update({lat:this.lat,lng:this.lng,markerLat:this.markerLat,markerLng:this.markerLng,zoom:this.zoom,type:this.type,style:this.style,showControls:this.showControls})},findPosition(){this.geocoder.geocode({q:this.location},a=>{if(a.items.length>0){this.$toast.success("Location found");let e=a.items[0].position;this.map.setCenter(e),this.addMarker(e)}else this.$toast.error("Location not found")})},findUserPosition(){navigator.geolocation&&navigator.geolocation.getCurrentPosition(a=>{const e={lat:a.coords.latitude,lng:a.coords.longitude};this.map.setCenter(e)},()=>{console.debug("Error getting user position")})},determineMapType(){return this.type==="normal.map"?this.defaultLayers.raster.normal.map:this.type==="normal.mapnight"?this.defaultLayers.raster.normal.mapnight:this.type==="normal.base"?this.defaultLayers.raster.normal.base:this.type==="normal.basenight"?this.defaultLayers.raster.normal.basenight:this.type==="satellite.map"?this.defaultLayers.raster.satellite.map:this.type==="satellite.base"?this.defaultLayers.raster.satellite.base:this.type==="terrain.map"?this.defaultLayers.raster.terrain.map:this.type==="terrain.base"?this.defaultLayers.raster.terrain.base:this.defaultLayers.raster.normal.map},markerDragStartHandler(a){let e=a.target,t=a.currentPointer;if(e instanceof H.map.Marker){let r=this.map.geoToScreen(e.getGeometry());e.offset=new H.math.Point(t.viewportX-r.x,t.viewportY-r.y),this.behavior.disable()}},markerDragEndHandler(a){let e=a.target;e instanceof H.map.Marker&&(this.behavior.enable(),this.markerLat=e.getGeometry().lat,this.markerLng=e.getGeometry().lng)},markerDragHandler(a){let e=a.target,t=a.currentPointer;e instanceof H.map.Marker&&e.setGeometry(this.map.screenToGeo(t.viewportX-e.offset.x,t.viewportY-e.offset.y))}}};var g=function(){var e=this,t=e._self._c;return t("div",[e.hasGeocoder?t("input",{directives:[{name:"model",rawName:"v-model",value:e.location,expression:"location"}],staticClass:"input-text",attrs:{type:"text",placeholder:"Search location"},domProps:{value:e.location},on:{keyup:function(r){return!r.type.indexOf("key")&&e._k(r.keyCode,"enter",13,r.key,"Enter")?null:e.findPosition.apply(null,arguments)},input:function(r){r.target.composing||(e.location=r.target.value)}}}):e._e(),t("div",{staticClass:"relative border border-gray-500"},[t("div",{ref:"map",staticClass:"w-full h-96"}),e.config.maptypes?t("div",{staticClass:"absolute top-0 left-0 flex items-center gap-4 bg-gray-200 px-2 py-1",attrs:{id:"menu"}},[t("div",{staticClass:"text-xs"},[e._v(" Maptype "),t("select",{directives:[{name:"model",rawName:"v-model",value:e.type,expression:"type"}],staticClass:"bg-white text-xs",on:{change:function(r){var i=Array.prototype.filter.call(r.target.options,function(n){return n.selected}).map(function(n){var h="_value"in n?n._value:n.value;return h});e.type=r.target.multiple?i:i[0]}}},[t("option",{attrs:{value:"normal.map"}},[e._v("Normal")]),t("option",{attrs:{value:"normal.mapnight"}},[e._v("Normal (night)")]),t("option",{attrs:{value:"normal.base"}},[e._v("Normal (no labels)")]),t("option",{attrs:{value:"normal.basenight"}},[e._v("Normal (no labels, night)")]),t("option",{attrs:{value:"satellite.map"}},[e._v("Satellite")]),t("option",{attrs:{value:"satellite.base"}},[e._v("Satellite (no labels)")]),t("option",{attrs:{value:"terrain.map"}},[e._v("Terrain")]),t("option",{attrs:{value:"terrain.base"}},[e._v("Terrain (no labels)")])])]),t("label",[t("input",{directives:[{name:"model",rawName:"v-model",value:e.showControls,expression:"showControls"}],attrs:{type:"checkbox"},domProps:{checked:Array.isArray(e.showControls)?e._i(e.showControls,null)>-1:e.showControls},on:{change:function(r){var i=e.showControls,n=r.target,h=!!n.checked;if(Array.isArray(i)){var m=null,s=e._i(i,m);n.checked?s<0&&(e.showControls=i.concat([m])):s>-1&&(e.showControls=i.slice(0,s).concat(i.slice(s+1)))}else e.showControls=h}}}),e._v(" Map controls")])]):e._e()]),t("div",{staticClass:"flex justify-between"},[t("div",{staticClass:"flex items-center gap-2"},[e.hasMarker?t("a",{staticClass:"!text-red-400 text-xs",attrs:{href:"#"},on:{click:function(r){return r.preventDefault(),e.removeMarker.apply(null,arguments)}}},[e._v("[x] Remove marker")]):e.config.markers?t("a",{staticClass:"text-xs",attrs:{href:"#"},on:{click:function(r){r.preventDefault(),e.addMarker(e.map.getCenter())}}},[e._v("[+] Add marker")]):e._e(),t("a",{staticClass:"!text-red-400 text-xs",attrs:{href:"#"},on:{click:function(r){return r.preventDefault(),e.findUserPosition.apply(null,arguments)}}},[e._v("[*] Find my position")])]),t("div",[e.canReset&&e.mapHasChanged?t("a",{staticClass:"!text-red-400 text-xs",attrs:{href:"#"},on:{click:function(r){return r.preventDefault(),e.resetMap.apply(null,arguments)}}},[e._v("[-] Reset map")]):e._e()])]),this.meta.pro&&!e.config.hideStyles?t("div",{staticClass:"my-2"},[t("div",{directives:[{name:"show",rawName:"v-show",value:e.stylesExpanded,expression:"stylesExpanded"}]},[e._m(0),t("textarea-input",{model:{value:e.style,callback:function(r){e.style=r},expression:"style"}}),e._m(1),t("button",{staticClass:"btn mt-2",on:{click:function(r){r.preventDefault(),e.stylesExpanded=!1}}},[e._v("Hide styles")])],1),t("button",{directives:[{name:"show",rawName:"v-show",value:!e.stylesExpanded,expression:"!stylesExpanded"}],staticClass:"btn",on:{click:function(r){r.preventDefault(),e.stylesExpanded=!0}}},[e._v("Show styles")])]):e._e()])},y=[function(){var a=this,e=a._self._c;return e("div",{staticClass:"help-block"},[e("p",[a._v("Paste in the link to the JSON file.")])])},function(){var a=this,e=a._self._c;return e("div",{staticClass:"text-gray-600 text-xs"},[a._v("Need help? Check out the "),e("a",{attrs:{href:"https://platform.here.com/style-editor/",target:"_blank"}},[a._v("style editor")]),a._v(".")])}],k=f(v,g,y,!1,null,null,null,null);const _=k.exports;Statamic.booting(()=>{Statamic.$components.register("here_maps-fieldtype",_)});
