import { Controller } from '@hotwired/stimulus';
export type Point = {
    lat: number;
    lng: number;
};
export type MapView<Options, MarkerOptions, InfoWindowOptions, PolygonOptions, PolylineOptions> = {
    center: Point | null;
    zoom: number | null;
    fitBoundsToMarkers: boolean;
    markers: Array<MarkerDefinition<MarkerOptions, InfoWindowOptions>>;
    polygons: Array<PolygonDefinition<PolygonOptions, InfoWindowOptions>>;
    polylines: Array<PolylineDefinition<PolylineOptions, InfoWindowOptions>>;
    options: Options;
};
export type MarkerDefinition<MarkerOptions, InfoWindowOptions> = {
    position: Point;
    title: string | null;
    infoWindow?: Omit<InfoWindowDefinition<InfoWindowOptions>, 'position'>;
    rawOptions?: MarkerOptions;
    extra: Record<string, unknown>;
};
export type PolygonDefinition<PolygonOptions, InfoWindowOptions> = {
    infoWindow?: Omit<InfoWindowDefinition<InfoWindowOptions>, 'position'>;
    points: Array<Point>;
    title: string | null;
    rawOptions?: PolygonOptions;
    extra: Record<string, unknown>;
};
export type PolylineDefinition<PolylineOptions, InfoWindowOptions> = {
    infoWindow?: Omit<InfoWindowDefinition<InfoWindowOptions>, 'position'>;
    points: Array<Point>;
    title: string | null;
    rawOptions?: PolylineOptions;
    extra: Record<string, unknown>;
};
export type InfoWindowDefinition<InfoWindowOptions> = {
    headerContent: string | null;
    content: string | null;
    position: Point;
    opened: boolean;
    autoClose: boolean;
    rawOptions?: InfoWindowOptions;
    extra: Record<string, unknown>;
};
export default abstract class<MapOptions, Map, MarkerOptions, Marker, InfoWindowOptions, InfoWindow, PolygonOptions, Polygon, PolylineOptions, Polyline> extends Controller<HTMLElement> {
    static values: {
        providerOptions: ObjectConstructor;
        view: ObjectConstructor;
    };
    viewValue: MapView<MapOptions, MarkerOptions, InfoWindowOptions, PolygonOptions, PolylineOptions>;
    protected map: Map;
    protected markers: Array<Marker>;
    protected infoWindows: Array<InfoWindow>;
    protected polygons: Array<Polygon>;
    protected polylines: Array<Polyline>;
    connect(): void;
    protected abstract doCreateMap({ center, zoom, options, }: {
        center: Point | null;
        zoom: number | null;
        options: MapOptions;
    }): Map;
    createMarker(definition: MarkerDefinition<MarkerOptions, InfoWindowOptions>): Marker;
    createPolygon(definition: PolygonDefinition<PolygonOptions, InfoWindowOptions>): Polygon;
    createPolyline(definition: PolylineDefinition<PolylineOptions, InfoWindowOptions>): Polyline;
    protected abstract doCreateMarker(definition: MarkerDefinition<MarkerOptions, InfoWindowOptions>): Marker;
    protected abstract doCreatePolygon(definition: PolygonDefinition<PolygonOptions, InfoWindowOptions>): Polygon;
    protected abstract doCreatePolyline(definition: PolylineDefinition<PolylineOptions, InfoWindowOptions>): Polyline;
    protected abstract createInfoWindow(args: {
        definition: MarkerDefinition<MarkerOptions, InfoWindowOptions>['infoWindow'];
        element: Marker;
    } | {
        definition: PolygonDefinition<PolygonOptions, InfoWindowOptions>['infoWindow'];
        element: Polygon;
    } | {
        definition: PolylineDefinition<PolylineOptions, InfoWindowOptions>['infoWindow'];
        element: Polyline;
    }): InfoWindow;
    protected abstract doCreateInfoWindow(args: {
        definition: MarkerDefinition<MarkerOptions, InfoWindowOptions>['infoWindow'];
        element: Marker;
    } | {
        definition: PolygonDefinition<PolygonOptions, InfoWindowOptions>['infoWindow'];
        element: Polygon;
    } | {
        definition: PolylineDefinition<PolylineOptions, InfoWindowOptions>['infoWindow'];
        element: Polyline;
    }): InfoWindow;
    protected abstract doFitBoundsToMarkers(): void;
    protected abstract dispatchEvent(name: string, payload: Record<string, unknown>): void;
}
