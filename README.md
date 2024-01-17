# Statamic Here Maps
![Statamic 4.0+](https://img.shields.io/badge/Statamic-3.0+-FF269E?style=for-the-badge&link=https://statamic.com)
[![Latest Version on Packagist](https://img.shields.io/packagist/v/jezzdk/statamic-google-maps.svg?style=for-the-badge)](https://packagist.org/packages/jezzdk/statamic-google-maps)

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

Add an environment variable, since this library uses [HERE Maps](https://developers.google.com/maps/) under the hood for displaying maps.

```
HERE_MAPS_API_KEY=""
```

Lastly, insert this tag in the header in order to load the HERE Maps JavaScript on the frontend:

```
{{ map_script }}
```

**\*Disclaimer\*** You will to create an account on HERE Maps if you want to create a HERE Maps API key.

## Usage

This addon provides a HERE Maps fieldtype. You can use that in your blueprints which will enable your users to dynamically insert maps onto your website.

There is also a tag that you can use directly in your Antlers template. I'll explain both use cases below.

### Map Tag

The simplest way to insert a map is by inserting the tag with latitude and longitude:

```
{{ here_maps lat="12.1234" lng="52.1234" }}
```

This will insert a map centered on the given coordinates, with a zoom level of 16 and using the roadmap type.
The Map tag supports the following attributes:

| Attribute | Type | Default | Description |
|---|---|---|---|
| lat | float | _none_ | The latitude (required) |
| lng | float | _none_ | The longitude (required) |
| marker | bool | false | Display a marker in the latitude and longitude from above |
| markerLat | float | _none_ | The latitude for the marker (the `marker` attribute must be false or omitted) |
| markerLng | float | _none_ | The longitude for the marker (the `marker` attribute must be false or omitted) |
| zoom | integer | 16 | The map zoom level |
| type | string | roadmap | Valid values are: `roadmap`, `satellite`, `terrain`, `hybrid` |
| icon | string | /assets/marker.png | (Pro feature) Use a path relative to the public folder. If the file doesn't exist, the default Google Map pin will be used. |
| style | string | _none_ | (Pro feature) The map styles as a JSON string |
| showControls | boolean | false | Show the default map controls |

### HERE Maps Field (Pro feature)

Simply select the fieldtype when creating a blueprint. When a user pans around the map, changes zoom level or changes the map type, the settings are saved and the output will display the same view as selected in the control panel.

The field has a few settings:

* Initial map type - choose which map type should be selected when the map is loaded initially in the control panel
* Initial zoom level - choose the zoom level when the map is loaded initially in the control panel
* Enable maptype selector - Allow the user to select the map type
* Enable marker creation - The user can create and remove a marker on the map
* Enable Geocoder - This adds a search field above the map, enabling the user to search for an address (The Geocoder API must be enabled in Google Cloud Console for this to work!)

When using markers, the script will look for an icon at `/public/assets/marker.png`. If it exist it will be used, otherwise it will use the default Google Map pin.

## Styles (Pro feature)

The map can be styled using a JSON array of styles. You can generate the style JSON for free at [https://mapstyle.withgoogle.com/](https://mapstyle.withgoogle.com/) (use the old wizard) or at [https://snazzymaps.com/](https://snazzymaps.com/).

The fieldtype has a button that reveals a textarea where the style JSON can be inserted, and the map tag has a `style` attribute for the same purpose.
