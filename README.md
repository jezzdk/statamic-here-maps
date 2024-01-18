# Statamic Here Maps
![Statamic 4.0+](https://img.shields.io/badge/Statamic-3.0+-FF269E?style=for-the-badge&link=https://statamic.com)
[![Latest Version on Packagist](https://img.shields.io/packagist/v/jezzdk/statamic-here-maps.svg?style=for-the-badge)](https://packagist.org/packages/jezzdk/statamic-here-maps)

A HERE Maps addon for Statamic V4 for creating and displaying HERE Maps on your website.

## Installation

Require it using Composer.

```
composer require jezzdk/statamic-here-maps
```

Publish the assets

```
php artisan vendor:publish --provider="Jezzdk\StatamicHereMaps\ServiceProvider"
```

Add an environment variable, since this library uses [HERE Maps](https://www.here.com/platform/map-data) under the hood for displaying maps.

```
HERE_MAPS_API_KEY=""
```

Lastly, insert these tags in the header in order to load the HERE Maps JavaScript and Stylesheet on the frontend:

```
{{ heremap_script }}
{{ heremap_styles }}
```

**\*Disclaimer\*** You will to create an account on HERE Maps if you want to create a HERE Maps API key.

## Usage

This addon provides a HERE Maps fieldtype. You can use that in your blueprints which will enable your users to dynamically insert maps onto your website.

There is also a tag that you can use directly in your Antlers template. I'll explain both use cases below.

### Map Tag

The simplest way to insert a map is by inserting the tag with latitude and longitude:

```
{{ here_map lat="55.6736841" lng="12.5655722" }}
```

This will insert a map centered on the given coordinates, with a zoom level of 16 (default) and using the normal map type.
The Map tag supports the following attributes:

| Attribute | Type | Default | Description |
|---|---|---|---|
| lat | float | _none_ | The latitude (required) |
| lng | float | _none_ | The longitude (required) |
| marker | bool | false | Display a marker in the latitude and longitude from above |
| markerLat | float | _none_ | The latitude for the marker (the `marker` attribute must be false or omitted) |
| markerLng | float | _none_ | The longitude for the marker (the `marker` attribute must be false or omitted) |
| zoom | integer | 16 | The map zoom level |
| type | string | norma.map | Valid values are listed below |
| icon | string | /assets/marker.png | (Pro feature) Use a path relative to the public folder. If the file doesn't exist, the default HERE Maps pin will be used. |
| style | string | _none_ | (Pro feature) The map styles as a JSON string |
| showControls | boolean | false | Show the default map controls |

Map type values:

| Value | Type |
|---|---|
| normal.map | Normal |
| normal.mapnight | Normal (night) |
| normal.base | Normal (no labels) |
| normal.basenight | Normal (no labels, night) |
| satellite.map | Satellite |
| satellite.base | Satellite (no labels) |
| terrain.map | Terrain |
| terrain.base | Terrain (no labels) |

### HERE Maps Field (Pro feature)

Simply select the fieldtype when creating a blueprint. When a user pans around the map, changes zoom level or changes the map type, the settings are saved along with the other fields and the output will display the same view as selected in the control panel.

The field has a few settings:

* Initial zoom level - choose the zoom level when the map is loaded initially in the control panel
* Enable maptype selector - Allow the user to select the map type
* Enable marker creation - The user can create and remove a marker on the map
* Enable Geocoder - This adds a search field above the map, enabling the user to search for an address
* Disable custom styles - This removed the ability to add custom styles for this field

When using markers, the script will look for an icon at `/public/assets/marker.png`. If it exist it will be used, otherwise it will use the default HERE Maps pin.

## Styles (Pro feature)

The map can be styled using a JSON array of styles. You can generate the style JSON for free at [https://platform.here.com/style-editor/](https://platform.here.com/style-editor/).

The fieldtype has a button that reveals a textarea where the url for the style JSON can be inserted, and the map tag has a `style` attribute for the same purpose.
