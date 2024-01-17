<?php

namespace Jezzdk\StatamicHereMaps;

use Jezzdk\StatamicHereMaps\Helpers\MapHelper;
use Statamic\Providers\AddonServiceProvider;

class ServiceProvider extends AddonServiceProvider
{
    protected $tags = [
        \Jezzdk\StatamicHereMaps\Tags\Map::class,
        \Jezzdk\StatamicHereMaps\Tags\MapScript::class,
        \Jezzdk\StatamicHereMaps\Tags\MapStyles::class,
    ];

    protected $vite = [
        'input' => [
            'resources/js/addon.js',
            'resources/css/addon.css',
        ],
        'publicDirectory' => 'dist',
    ];

    protected $fieldtypes = [
        \Jezzdk\StatamicHereMaps\Fieldtypes\HereMaps::class,
    ];

    public function boot()
    {
        $this->externalScripts = MapHelper::hereMapsScriptUrls();

        $this->externalStylesheets = [
            'https://js.api.here.com/v3/3.1/mapsjs-ui.css'
        ];

        $this->publishes([
          __DIR__.'/../config/here_maps.php' => config_path('here_maps.php'),
        ]);

        parent::boot();
    }

    public function register()
    {
        $this->mergeConfigFrom(
            __DIR__.'/../config/here_maps.php',
            'here_maps'
        );
    }
}
