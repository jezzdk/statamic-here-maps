<template>
    <div>
        <input v-if="hasGeocoder" type="text" v-model="location" @keyup.enter="findPosition" placeholder="Search location" class="input-text">
        <div class="relative border border-gray-500">
            <div class="w-full h-96" ref="map"></div>
            <div v-if="config.maptypes" id="menu" class="absolute top-0 left-0 flex items-center gap-4 bg-gray-200 px-2 py-1">
                <div class="text-xs">
                    Maptype
                    <select v-model="type" class="bg-white text-xs">
                        <option value="normal.map">Normal</option>
                        <option value="normal.mapnight">Normal (night)</option>
                        <option value="normal.base">Normal (no labels)</option>
                        <option value="normal.basenight">Normal (no labels, night)</option>
                        <option value="satellite.map">Satellite</option>
                        <option value="satellite.base">Satellite (no labels)</option>
                        <option value="terrain.map">Terrain</option>
                        <option value="terrain.base">Terrain (no labels)</option>
                    </select>
                </div>
                <label><input type="checkbox" v-model="showControls" /> Map controls</label>
            </div>
        </div>
        <div class="flex justify-between">
            <div class="flex items-center gap-2">
                <a v-if="hasMarker" href="#" @click.prevent="removeMarker" class="!text-red-400 text-xs">[x] Remove marker</a>
                <a v-else-if="config.markers" href="#" @click.prevent="addMarker(map.getCenter())" class="text-xs">[+] Add marker</a>
                <a href="#" @click.prevent="findUserPosition" class="!text-red-400 text-xs">[*] Find my position</a>
            </div>
            <div><a v-if="canReset && mapHasChanged" href="#" @click.prevent="resetMap" class="!text-red-400 text-xs">[-] Reset map</a></div>
        </div>
        <div v-if="this.meta.pro && !config.hideStyles" class="my-2">
            <div v-show="stylesExpanded">
                <div class="help-block"><p>Paste in the link to the JSON file.</p></div>
                <textarea-input v-model="style"></textarea-input>
                <div class="text-gray-600 text-xs">Need help? Check out the <a href="https://platform.here.com/style-editor/" target="_blank">style editor</a>.</div>
                <button @click.prevent="stylesExpanded = false" class="btn mt-2">Hide styles</button>
            </div>
            <button v-show="!stylesExpanded" @click.prevent="stylesExpanded = true" class="btn">Show styles</button>
        </div>
    </div>
</template>

<script>
export default {
    mixins: [Fieldtype],
    data() {
        return {
            lat: null,
            lng: null,
            markerLat: null,
            markerLng: null,
            zoom: null,
            type: null,
            showControls: false,
            style: null,
            map: null,
            marker: null,
            hasMarker: false,
            stylesExpanded: false,
            behavior: null,
            ui: null,
            geocoder: null,
            location: null,
            platform: null,
            defaultLayers: null,
        }
    },
    watch: {
        lat () {
            this.saveLocation()
        },
        lng () {
            this.saveLocation()
        },
        markerLat () {
            this.saveLocation()
        },
        markerLng () {
            this.saveLocation()
        },
        zoom () {
            this.saveLocation()
        },
        type () {
            if (this.map) {
                this.map.setBaseLayer(this.determineMapType())
            }

            this.saveLocation()
        },
        style () {
            this.saveLocation()
        },
        showControls () {
            this.saveLocation()
        },
    },
    computed: {
        hasGeocoder () {
            return this.config.geocoder
        },
        canReset () {
            return this.meta.defaultLat && this.meta.defaultLng
        },
        mapHasChanged () {
            return this.lat != this.meta.defaultLat
                || this.lng != this.meta.defaultLng
                || this.zoom != this.config.initialZoom
                || this.type != this.config.mapType
        },
        hasGeolocation () {
            return navigator.geolocation || false
        },
    },
    mounted () {
        this.lat = this.value.lat || this.meta.defaultLat
        this.lng = this.value.lng || this.meta.defaultLng
        this.markerLat = this.value.markerLat
        this.markerLng = this.value.markerLng
        this.zoom = this.value.zoom || this.config.initialZoom || 16
        this.type = this.value.type || 'normal.map'
        this.style = this.value.style
        this.showControls = this.value.showControls

        this.platform = new H.service.Platform({
            apikey: this.meta.apiKey
        })
        this.defaultLayers = this.platform.createDefaultLayers()

        this.map = new H.Map(this.$refs.map, this.determineMapType(), {
            center: {
                lat: Number.parseFloat(this.lat),
                lng: Number.parseFloat(this.lng)
            },
            zoom: Number(this.zoom),
            pixelRatio: window.devicePixelRatio || 1,
        })
        window.addEventListener('resize', () => this.map.getViewPort().resize())

        this.behavior = new H.mapevents.Behavior(new H.mapevents.MapEvents(this.map))
        this.ui = H.ui.UI.createDefault(this.map, this.defaultLayers, 'en-US')

        const mapSettingsControl = this.ui.getControl('mapsettings')
        mapSettingsControl.setVisibility(false)
        // mapSettingsControl.setAlignment('top-left')

        if (this.config.markers) {
            if (this.markerLat && this.markerLng) {
                this.addMarker({
                    lat: Number.parseFloat(this.markerLat),
                    lng: Number.parseFloat(this.markerLng),
                })
            }
        }

        if (this.config.geocoder) {
            this.geocoder = this.platform.getSearchService()
        }

        this.addMapListeners()
    },
    methods: {
        addMapListeners () {
            this.map.addEventListener('mapviewchangeend', (type, newValue, oldValue) => {
                this.zoom = this.map.getZoom()
                this.lat = this.map.getCenter().lat
                this.lng = this.map.getCenter().lng
            })
        },
        addMarker (position) {
            this.marker = new H.map.Marker(position)
            this.marker.draggable = true

            this.map.addObject(this.marker)
            this.map.addEventListener('dragstart', this.markerDragStartHandler, false)
            this.map.addEventListener('dragend', this.markerDragEndHandler, false)
            this.map.addEventListener('drag', this.markerDragHandler, false)

            this.markerLat = position.lat
            this.markerLng = position.lng
            this.hasMarker = true
        },
        removeMarker () {
            if (!this.hasMarker) {
                return
            }

            this.map.removeEventListener('dragstart', this.markerDragStartHandler, false)
            this.map.removeEventListener('dragend', this.markerDragEndHandler, false)
            this.map.removeEventListener('drag', this.markerDragHandler, false)
            this.map.removeObject(this.marker)

            this.marker = null
            this.markerLat = null
            this.markerLng = null
            this.hasMarker = false
        },
        resetMap () {
            this.map.setCenter({
                lat: Number.parseFloat(this.meta.defaultLat),
                lng: Number.parseFloat(this.meta.defaultLng),
            })

            this.map.setZoom(Number(this.meta.defaultZoom) || 16)

            this.removeMarker()
        },
        saveLocation () {
            this.update({
                lat: this.lat,
                lng: this.lng,
                markerLat: this.markerLat,
                markerLng: this.markerLng,
                zoom: this.zoom,
                type: this.type,
                style: this.style,
                showControls: this.showControls,
            })
        },
        findPosition () {
            this.geocoder.geocode({
                q: this.location
            }, (result) => {
                if (result.items.length > 0) {
                    this.$toast.success('Location found')

                    let position = result.items[0].position
                    this.map.setCenter(position)

                    this.addMarker(position)
                } else {
                    this.$toast.error('Location not found')
                }
            })
        },
        findUserPosition () {
            if (!navigator.geolocation) {
                return
            }

            navigator.geolocation.getCurrentPosition((position) => {
                const pos = {
                    lat: position.coords.latitude,
                    lng: position.coords.longitude,
                }

                this.map.setCenter(pos)
            }, () => {
                console.debug('Error getting user position')
            })
        },
        determineMapType () {
            if (this.type === 'normal.map') {
                return this.defaultLayers.raster.normal.map
            }
            if (this.type === 'normal.mapnight') {
                return this.defaultLayers.raster.normal.mapnight
            }
            if (this.type === 'normal.base') {
                return this.defaultLayers.raster.normal.base
            }
            if (this.type === 'normal.basenight') {
                return this.defaultLayers.raster.normal.basenight
            }
            if (this.type === 'satellite.map') {
                return this.defaultLayers.raster.satellite.map
            }
            if (this.type === 'satellite.base') {
                return this.defaultLayers.raster.satellite.base
            }
            if (this.type === 'terrain.map') {
                return this.defaultLayers.raster.terrain.map
            }
            if (this.type === 'terrain.base') {
                return this.defaultLayers.raster.terrain.base
            }

            return this.defaultLayers.raster.normal.map
        },
        markerDragStartHandler (ev) {
            let target = ev.target,
                pointer = ev.currentPointer
            if (target instanceof H.map.Marker) {
                let targetPosition = this.map.geoToScreen(target.getGeometry())
                target['offset'] = new H.math.Point(pointer.viewportX - targetPosition.x, pointer.viewportY - targetPosition.y)
                this.behavior.disable()
            }
        },
        markerDragEndHandler (ev) {
            let target = ev.target
            if (target instanceof H.map.Marker) {
                this.behavior.enable()
                this.markerLat = target.getGeometry().lat
                this.markerLng = target.getGeometry().lng
            }
        },
        markerDragHandler (ev) {
            let target = ev.target,
                pointer = ev.currentPointer
            if (target instanceof H.map.Marker) {
                target.setGeometry(this.map.screenToGeo(pointer.viewportX - target['offset'].x, pointer.viewportY - target['offset'].y))
            }
        }
    }
}
</script>
