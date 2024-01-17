<?php

namespace Jezzdk\StatamicHereMaps\Tags;

use Jezzdk\StatamicHereMaps\Helpers\MapHelper;
use Statamic\Tags\Tags;

class MapStyles extends Tags
{
    protected static $handle = 'heremap_styles';

    /**
     * The {{ map_styles }} tag.
     *
     * @return string|array
     */
    public function index()
    {
        return collect(MapHelper::hereMapsStyleUrls())->map(function ($url) {
            return '<link href="'.$url.'" rel="stylesheet">';
        })->join('');
    }
}
