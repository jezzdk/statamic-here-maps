<?php

namespace Jezzdk\StatamicHereMaps\Helpers;

use Illuminate\Support\Str;

class MapHelper
{
    public static function defaultLatitude()
    {
        return config('here_maps.default_lat');
    }

    public static function defaultLongitude()
    {
        return config('here_maps.default_lng');
    }

    public static function hereMapsScriptUrls()
    {
        return [
            'https://js.api.here.com/v3/3.1/mapsjs-core.js',
            'https://js.api.here.com/v3/3.1/mapsjs-harp.js',
            'https://js.api.here.com/v3/3.1/mapsjs-service.js',
            'https://js.api.here.com/v3/3.1/mapsjs-mapevents.js',
            'https://js.api.here.com/v3/3.1/mapsjs-ui.js',
        ];
    }

    public static function hereMapsStyleUrls()
    {
        return [
            'https://js.api.here.com/v3/3.1/mapsjs-ui.css',
        ];
    }

    public static function convertToHtml(array $params)
    {
        $apiKey = config('here_maps.api_key');

        // Generate a random ID for the map
        $id = Str::random();

        // Use some sensible defaults
        $params = array_merge([
            'width' => '100%',
            'height' => '100%',
            'markerLat' => null,
            'markerLng' => null,
            //'icon' => $addon->edition() === 'pro' ? '/assets/marker.png' : null,
            'style' => null,
        ], $params);

        // Destruct the params array into variables
        [
            'lat' => $lat,
            'lng' => $lng,
            'zoom' => $zoom,
            'markerLat' => $markerLat,
            'markerLng' => $markerLng,
            'width' => $width,
            'height' => $height,
            'type' => $type,
            //'icon' => $icon,
            'style' => $style,
            'showControls' => $showControls,
        ] = $params;

        //$style = 'https://heremaps.github.io/maps-api-for-javascript-examples/change-harp-style-at-load/data/night.json';

        // Return the HTML
        return '
        <div id="' . $id . '" style="width: ' . $width . '; height: ' . $height . ';"></div>
        <script>
        var platform = new H.service.Platform({
            apikey: "'.$apiKey.'"
        });

        var defaultLayers = platform.createDefaultLayers()

        ' . (!empty($style) ? '
        var engineType = H.Map.EngineType[\'HARP\'];
        var style = new H.map.render.harp.Style(\''.$style.'\');
        var vectorLayer = platform.getOMVService().createLayer(style, { engineType });
        var map = new H.Map(
            document.getElementById("'.$id.'"),
            vectorLayer,
            {
                engineType,
                center: {
                    lng: '.$lng.',
                    lat: '.$lat.'
                },
                zoom: '.$zoom.',
                pixelRatio: window.devicePixelRatio || 1,
            }
        );
        ' : '
        var map = new H.Map(
            document.getElementById("'.$id.'"),
            defaultLayers.vector.'.$type.',
            {
                center: {
                    lng: '.$lng.',
                    lat: '.$lat.'
                },
                zoom: '.$zoom.',
                pixelRatio: window.devicePixelRatio || 1,
            }
        );
        ') . '

        window.addEventListener("resize", () => map.getViewPort().resize());

        ' . (!empty($showControls) ? '
        var ui = H.ui.UI.createDefault(map, defaultLayers)
        const mapSettingsControl = this.ui.getControl(\'mapsettings\')
        mapSettingsControl.setVisibility(false)
        ' : null) . '
        ' . (isset($markerLat, $markerLng) ? '
        var marker = new H.map.Marker({
            lat: '.$markerLat.',
            lng: '.$markerLng.'
        })
        map.addObject(marker)
        ' : null) . '
        </script>
        ';
    }
}
