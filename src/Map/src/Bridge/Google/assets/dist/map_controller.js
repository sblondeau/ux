import AbstractMapController from '@symfony/ux-map';
import { Loader } from '@googlemaps/js-api-loader';

let _google;
class default_1 extends AbstractMapController {
    async connect() {
        if (!_google) {
            _google = { maps: {} };
            let { libraries = [], ...loaderOptions } = this.providerOptionsValue;
            const loader = new Loader(loaderOptions);
            libraries = ['core', ...libraries.filter((library) => library !== 'core')];
            const librariesImplementations = await Promise.all(libraries.map((library) => loader.importLibrary(library)));
            librariesImplementations.map((libraryImplementation, index) => {
                const library = libraries[index];
                if (['marker', 'places', 'geometry', 'journeySharing', 'drawing', 'visualization'].includes(library)) {
                    _google.maps[library] = libraryImplementation;
                }
                else {
                    _google.maps = { ..._google.maps, ...libraryImplementation };
                }
            });
        }
        super.connect();
    }
    dispatchEvent(name, payload = {}) {
        this.dispatch(name, {
            prefix: 'ux:map',
            detail: {
                ...payload,
                google: _google,
            },
        });
    }
    doCreateMap({ center, zoom, options, }) {
        options.zoomControl = typeof options.zoomControlOptions !== 'undefined';
        options.mapTypeControl = typeof options.mapTypeControlOptions !== 'undefined';
        options.streetViewControl = typeof options.streetViewControlOptions !== 'undefined';
        options.fullscreenControl = typeof options.fullscreenControlOptions !== 'undefined';
        return new _google.maps.Map(this.element, {
            ...options,
            center,
            zoom,
        });
    }
    doCreateMarker(definition) {
        const { position, title, infoWindow, extra, rawOptions = {}, ...otherOptions } = definition;
        const marker = new _google.maps.marker.AdvancedMarkerElement({
            position,
            title,
            ...otherOptions,
            ...rawOptions,
            map: this.map,
        });
        if (infoWindow) {
            this.createInfoWindow({ definition: infoWindow, element: marker });
        }
        return marker;
    }
    doCreatePolygon(definition) {
        const { points, title, infoWindow, rawOptions = {} } = definition;
        const polygon = new _google.maps.Polygon({
            ...rawOptions,
            paths: points,
            map: this.map,
        });
        if (title) {
            polygon.set('title', title);
        }
        if (infoWindow) {
            this.createInfoWindow({ definition: infoWindow, element: polygon });
        }
        return polygon;
    }
    doCreatePolyline(definition) {
        const { points, title, infoWindow, rawOptions = {} } = definition;
        const polyline = new _google.maps.Polyline({
            ...rawOptions,
            path: points,
            map: this.map,
        });
        if (title) {
            polyline.set('title', title);
        }
        if (infoWindow) {
            this.createInfoWindow({ definition: infoWindow, element: polyline });
        }
        return polyline;
    }
    doCreateInfoWindow({ definition, element, }) {
        const { headerContent, content, extra, rawOptions = {}, ...otherOptions } = definition;
        const infoWindow = new _google.maps.InfoWindow({
            headerContent: this.createTextOrElement(headerContent),
            content: this.createTextOrElement(content),
            ...otherOptions,
            ...rawOptions,
        });
        if (element instanceof google.maps.marker.AdvancedMarkerElement) {
            element.addListener('click', () => {
                if (definition.autoClose) {
                    this.closeInfoWindowsExcept(infoWindow);
                }
                infoWindow.open({ map: this.map, anchor: element });
            });
            if (definition.opened) {
                infoWindow.open({ map: this.map, anchor: element });
            }
        }
        else if (element instanceof google.maps.Polygon || element instanceof google.maps.Polyline) {
            element.addListener('click', (event) => {
                if (definition.autoClose) {
                    this.closeInfoWindowsExcept(infoWindow);
                }
                infoWindow.setPosition(event.latLng);
                infoWindow.open(this.map);
            });
            if (definition.opened) {
                const bounds = new google.maps.LatLngBounds();
                element.getPath().forEach((point) => {
                    bounds.extend(point);
                });
                infoWindow.setPosition(bounds.getCenter());
                infoWindow.open({ map: this.map, anchor: element });
            }
        }
        return infoWindow;
    }
    createTextOrElement(content) {
        if (!content) {
            return null;
        }
        if (content.includes('<')) {
            const div = document.createElement('div');
            div.innerHTML = content;
            return div;
        }
        return content;
    }
    closeInfoWindowsExcept(infoWindow) {
        this.infoWindows.forEach((otherInfoWindow) => {
            if (otherInfoWindow !== infoWindow) {
                otherInfoWindow.close();
            }
        });
    }
    doFitBoundsToMarkers() {
        if (this.markers.length === 0) {
            return;
        }
        const bounds = new google.maps.LatLngBounds();
        this.markers.forEach((marker) => {
            if (!marker.position) {
                return;
            }
            bounds.extend(marker.position);
        });
        this.map.fitBounds(bounds);
    }
}
default_1.values = {
    providerOptions: Object,
};

export { default_1 as default };
