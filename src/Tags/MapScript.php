<?php

namespace Jezzdk\StatamicHereMaps\Tags;

use Jezzdk\StatamicHereMaps\Helpers\MapHelper;
use Statamic\Tags\Tags;

class MapScript extends Tags
{
    protected static $handle = 'heremap_script';

    /**
     * The {{ map_script }} tag.
     *
     * @return string|array
     */
    public function index()
    {
        return collect(MapHelper::hereMapsScriptUrls())->map(function ($url) {
            return '<script src="'.$url.'" type="text/javascript" charset="utf-8"></script>';
        })->join('');
    }
}
