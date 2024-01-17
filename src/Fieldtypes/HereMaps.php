<?php

namespace Jezzdk\StatamicHereMaps\Fieldtypes;

use Jezzdk\StatamicHereMaps\Helpers\MapHelper;
use Statamic\Facades\Addon;
use Statamic\Fields\Fieldtype;

class HereMaps extends Fieldtype
{
    protected $icon = 'earth';

    protected $categories = ['text'];

    /**
     * @return string
     */
    public static function title()
    {
        return 'HERE Map';
    }

    public function selectable(): bool
    {
        $addon = Addon::get('jezzdk/statamic-here-maps');

        if ($addon->edition() !== 'pro') {
            return false;
        }

        return parent::selectable();
    }

    public function augment($value)
    {
        $value['type'] = $this->config('mapType', 'normal.map');
        $value['showControls'] = $this->config('showControls', false);

        return MapHelper::convertToHtml($value);
    }

    public function preload()
    {
        $addon = Addon::get('jezzdk/statamic-here-maps');

        return [
            'defaultLat' => MapHelper::defaultLatitude(),
            'defaultLng' => MapHelper::defaultLongitude(),
            'pro' => $addon->edition() === 'pro',
            'apiKey' => config('here_maps.api_key'),
        ];
    }

    /**
     * Pre-process the data before it gets sent to the publish page.
     *
     * @param mixed $data
     * @return array|mixed
     */
    public function preProcess($data)
    {
        if (empty($data)) {
            return [
                'lat' => MapHelper::defaultLatitude(),
                'lng' => MapHelper::defaultLongitude(),
            ];
        }

        return $data;
    }

    /**
     * Process the data before it gets saved.
     *
     * @param mixed $data
     * @return array|mixed
     */
    public function process($data)
    {
        return $data;
    }

    protected function configFieldItems(): array
    {
        return [
            // These should be defined by the raster list:
            // https://www.here.com/docs/bundle/maps-api-for-javascript-api-reference/page/H.service.Platform.html#createDefaultLayers
            'mapType' => [
                'display' => 'Map type',
                'instructions' => 'Choose the map type to use.',
                'type' => 'select',
                'default' => 'normal.map',
                'options' => [
                    'normal.map' => __('Normal'),
                    'normal.mapnight' => __('Normal (night)'),
                    'normal.base' => __('Normal (no labels)'),
                    'normal.basenight' => __('Normal (no labels, night)'),
                    'satellite.map' => __('Satellite'),
                    'satellite.base' => __('Satellite (no labels)'),
                    'terrain.map' => __('Terrain'),
                    'terrain.base' => __('Terrain (no labels)'),
                ],
                'width' => 50
            ],
            'initialZoom' => [
                'display' => 'Initial zoom level',
                'instructions' => 'Set a zoom level from 1 (far) to 21 (near).',
                'type' => 'text',
                'default' => '16',
                'width' => 50
            ],
            // 'maptypes' => [
            //     'display' => 'Enable maptype selector',
            //     'instructions' => 'Allow the user to select the map type.',
            //     'type' => 'toggle',
            //     'default' => true,
            //     'width' => 50
            // ],
            'markers' => [
                'display' => 'Enable marker creation',
                'instructions' => 'The user can create and remove a marker on the map.',
                'type' => 'toggle',
                'default' => true,
                'width' => 50
            ],
            'geocoder' => [
                'display' => 'Enable Geocoder',
                'instructions' => 'The Geocoder API must be enabled in Google Cloud Console for this to work.',
                'type' => 'toggle',
                'default' => false,
                'width' => 50
            ],
            'showControls' => [
                'display' => 'Show controls',
                'instructions' => 'Display the map with the default Google Map controls.',
                'type' => 'toggle',
                'default' => false,
                'width' => 50
            ]
        ];
    }
}
