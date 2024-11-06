Symfony UX Map
==============

**EXPERIMENTAL** This component is currently experimental and is likely
to change, or even change drastically.

Symfony UX Map is a Symfony bundle integrating interactive Maps in
Symfony applications. It is part of `the Symfony UX initiative`_.

Installation
------------

Install the bundle using Composer and Symfony Flex:

.. code-block:: terminal

    $ composer require symfony/ux-map

If you're using WebpackEncore, install your assets and restart Encore (not
needed if you're using AssetMapper):

.. code-block:: terminal

    $ npm install --force
    $ npm run watch

Configuration
-------------

Configuration is done in your ``config/packages/ux_map.yaml`` file:

.. code-block:: yaml
    
    # config/packages/ux_map.yaml
    ux_map:
        renderer: '%env(resolve:default::UX_MAP_DSN)%'

The ``UX_MAP_DSN`` environment variable configure which renderer to use.

Map renderers
~~~~~~~~~~~~~

The Symfony UX Map bundle supports multiple renderers. A map renderer is a
service that provides the code and graphic assets required to render and 
interact with a map in the browser. 

Available renderers
~~~~~~~~~~~~~~~~~~~

UX Map ships with two renderers: `Google Maps`_ and `Leaflet`_.

==============  ===============================================================
Renderer
==============  ===============================================================
`Google Maps`_  **Install**: ``composer require symfony/ux-google-map`` \
                **DSN**: ``UX_MAP_DSN=google://GOOGLE_MAPS_API_KEY@default`` \
`Leaflet`_      **Install**: ``composer require symfony/ux-leaflet-map`` \
                **DSN**: ``UX_MAP_DSN=leaflet://default`` \
==============  ===============================================================

.. tip::

    Read the `Symfony UX Map Leaflet bridge docs`_ and the
    `Symfony UX Map Google Maps brige docs`_ to learn about the configuration
    options available for each renderer.

Create a map
------------

A map is created by calling ``new Map()``. You can configure the center, zoom, and add markers.
Start by creating a new map instance::
    
    use Symfony\UX\Map\Map;

    // Create a new map instance
    $myMap = (new Map());

Center and zoom
~~~~~~~~~~~~~~~

You can set the center and zoom of the map using the ``center()`` and ``zoom()`` methods::

    use Symfony\UX\Map\Map;
    use Symfony\UX\Map\Point;

    $myMap
        // Explicitly set the center and zoom
        ->center(new Point(46.903354, 1.888334))
        ->zoom(6)
        
        // Or automatically fit the bounds to the markers
        ->fitBoundsToMarkers()
    ;

Add markers
~~~~~~~~~~~

You can add markers to a map using the ``addMarker()`` method::

    $myMap
        ->addMarker(new Marker(
            position: new Point(48.8566, 2.3522), 
            title: 'Paris'
        ))

        // With an info window associated to the marker:
        ->addMarker(new Marker(
            position: new Point(45.7640, 4.8357), 
            title: 'Lyon',
            infoWindow: new InfoWindow(
                headerContent: '<b>Lyon</b>',
                content: 'The French town in the historic Rhône-Alpes region, located at the junction of the Rhône and Saône rivers.'
            )
        ))

        // You can also pass arbitrary data via the `extra` option in both the marker
        // and the infoWindow; you can later use this data in your custom Stimulus controllers
        ->addMarker(new Marker(
            // ...
            extra: [
                'icon_mask_url' => 'https://maps.gstatic.com/mapfiles/place_api/icons/v2/tree_pinlet.svg',
            ],
            infoWindow: new InfoWindow(
                // ...
                extra: [
                    'num_items' => 3,
                    'includes_link' => true,
                ],
            ),
        )
    ;


Add Polygons
~~~~~~~~~~~~

You can also add Polygons, which represents an area enclosed by a series of ``Point`` instances::

    $myMap->addPolygon(new Polygon(
        points: [
            new Point(48.8566, 2.3522),
            new Point(45.7640, 4.8357),
            new Point(43.2965, 5.3698),
            new Point(44.8378, -0.5792),
        ],
        infoWindow: new InfoWindow(
            content: 'Paris, Lyon, Marseille, Bordeaux',
        ),
    ));

Add Polylines
~~~~~~~~~~~~~

You can add Polylines, which represents a path made by a series of `Point` instances
    $myMap->addPolyline(new Polyline(
        points: [
            new Point(48.8566, 2.3522),
            new Point(45.7640, 4.8357),
            new Point(43.2965, 5.3698),
            new Point(44.8378, -0.5792),
        ],
        infoWindow: new InfoWindow(
            content: 'A line passing through Paris, Lyon, Marseille, Bordeaux',
        ),
    ));


Render a map
------------

To render a map in your Twig template, use the ``ux_map`` Twig function, e.g.:

To be visible, the map must have a defined height:

.. code-block:: twig

    {{ ux_map(my_map, { style: 'height: 300px' }) }}

You can add custom HTML attributes too:

.. code-block:: twig

    {{ ux_map(my_map, { style: 'height: 300px', id: 'events-map', class: 'mb-3' }) }}


Twig Function ``ux_map()``
~~~~~~~~~~~~~~~~~~~~~~~~~~

The ``ux_map()`` Twig function allows you to create and render a map in your Twig 
templates. The function accepts the same arguments as the ``Map`` class:

.. code-block:: html+twig

    {{ ux_map(
        center: [51.5074, 0.1278],
        zoom: 3,
        markers: [
            { position: [51.5074, 0.1278], title: 'London' },
            { position: [48.8566, 2.3522], title: 'Paris' },
            {
                position: [40.7128, -74.0060],
                title: 'New York',
                infoWindow: { content: 'Welcome to <b>New York</b>' }
            },
        ],
        attributes: {
            class: 'foo',
            style: 'height: 800px; width: 100%; border: 4px solid red; margin-block: 10vh;',
        }
    ) }}

Twig Component ``<twig:ux:map />``
~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

Alternatively, you can use the ``<twig:ux:map />`` component.

.. code-block:: html+twig

    <twig:ux:map
        center="[51.5074, 0.1278]"
        zoom="3"
        markers='[
            {"position": [51.5074, 0.1278], "title": "London"},
            {"position": [48.8566, 2.3522], "title": "Paris"},
            {
                "position": [40.7128, -74.0060],
                "title": "New York",
                "infoWindow": {"content": "Welcome to <b>New York</b>"}
            }
        ]'
        attributes='{
            "class": "foo",
            "style": "height: 800px; width: 100%; border: 4px solid red; margin-block: 10vh;"
        }'
    />

The ``<twig:ux:map />`` component requires the `Twig Component`_ package.

.. code-block:: terminal

    $ composer require symfony/ux-twig-component

Interact with the map
~~~~~~~~~~~~~~~~~~~~~

Symfony UX Map allows you to extend its default behavior using a custom Stimulus controller:

.. code-block:: javascript

    // assets/controllers/mymap_controller.js
    
    import { Controller } from '@hotwired/stimulus';
    
    export default class extends Controller {
        connect() {
            this.element.addEventListener('ux:map:pre-connect', this._onPreConnect);
            this.element.addEventListener('ux:map:connect', this._onConnect);
            this.element.addEventListener('ux:map:marker:before-create', this._onMarkerBeforeCreate);
            this.element.addEventListener('ux:map:marker:after-create', this._onMarkerAfterCreate);
            this.element.addEventListener('ux:map:info-window:before-create', this._onInfoWindowBeforeCreate);
            this.element.addEventListener('ux:map:info-window:after-create', this._onInfoWindowAfterCreate);
        }
    
        disconnect() {
            // You should always remove listeners when the controller is disconnected to avoid side effects
            this.element.removeEventListener('ux:map:pre-connect', this._onPreConnect);
            this.element.removeEventListener('ux:map:connect', this._onConnect);
            this.element.removeEventListener('ux:map:marker:before-create', this._onMarkerBeforeCreate);
            this.element.removeEventListener('ux:map:marker:after-create', this._onMarkerAfterCreate);
            this.element.removeEventListener('ux:map:info-window:before-create', this._onInfoWindowBeforeCreate);
            this.element.removeEventListener('ux:map:info-window:after-create', this._onInfoWindowAfterCreate);
        }
    
        _onPreConnect(event) {
            // The map is not created yet
            // You can use this event to configure the map before it is created
            console.log(event.detail.options);
        }
        
        _onConnect(event) {
            // The map, markers and infoWindows are created
            // The instances depend on the renderer you are using
            console.log(event.detail.map);
            console.log(event.detail.markers);
            console.log(event.detail.infoWindows);
        }
        
        _onMarkerBeforeCreate(event) {
            // The marker is not created yet
            // You can use this event to configure the marker before it is created
            console.log(event.detail.definition);
        }
        
        _onMarkerAfterCreate(event) {
            // The marker is created
            // The instance depends on the renderer you are using
            console.log(event.detail.marker);
        }
        
        _onInfoWindowBeforeCreate(event) {
            // The infoWindow is not created yet
            // You can use this event to configure the infoWindow before it is created
            console.log(event.detail.definition);
            // The associated marker instance is also available
            console.log(event.detail.marker);
        }
        
        _onInfoWindowAfterCreate(event) {
            // The infoWindow is created
            // The instance depends on the renderer you are using
            console.log(event.detail.infoWindow);
            // The associated marker instance is also available
            console.log(event.detail.marker);
        }
    }


Then, you can use this controller in your template:

.. code-block:: twig
    
    {{ ux_map(my_map, { 'data-controller': 'mymap', style: 'height: 300px' }) }}

.. tip::

    Read the `Symfony UX Map Leaflet bridge docs`_ and the
    `Symfony UX Map Google Maps brige docs`_ to learn about the exact code
    needed to customize the markers.

Backward Compatibility promise
------------------------------

This bundle aims at following the same Backward Compatibility promise as
the Symfony framework:
https://symfony.com/doc/current/contributing/code/bc.html

.. _`the Symfony UX initiative`: https://ux.symfony.com/
.. _`Google Maps`: https://github.com/symfony/ux-google-map
.. _`Leaflet`: https://github.com/symfony/ux-leaflet-map
.. _`Symfony UX Map Google Maps brige docs`: https://github.com/symfony/ux/blob/2.x/src/Map/src/Bridge/Google/README.md
.. _`Symfony UX Map Leaflet bridge docs`: https://github.com/symfony/ux/blob/2.x/src/Map/src/Bridge/Leaflet/README.md
