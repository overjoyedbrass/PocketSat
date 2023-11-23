import React, { useCallback, useEffect, useState } from "react";
import L from "leaflet";
import useSupercluster from "use-supercluster";
import { Marker, useMap, Tooltip } from "react-leaflet";
import { useDispatch } from "react-redux";
import { updateForm } from "../../store/formInput/locationForm";

const icons = {};
const fetchIcon = (count, size) => {
    if (!icons[count]) {
        icons[count] = L.divIcon({
            html: `<div class="cluster-marker" style="width: ${size}px; height: ${size}px;">
        ${count}
      </div>`,
        });
    }
    return icons[count];
};

const observatoryIcon = L.icon({
    iconUrl: "https://cdn-icons-png.flaticon.com/512/360/360847.png",
    iconSize: new L.Point(30, 30),
    iconAnchor: new L.Point(15, 30),
});

function ShowObservatories({ data }) {
    const maxZoom = 22;
    const [bounds, setBounds] = useState(null);
    const [zoom, setZoom] = useState(12);
    const map = useMap();
    const dispatch = useDispatch();

    function setCenter(location) {
        dispatch(updateForm(location));
    }

    const updateMap = React.useCallback(() => {
        const b = map.getBounds();
        setBounds([
            b.getSouthWest().lng,
            b.getSouthWest().lat,
            b.getNorthEast().lng,
            b.getNorthEast().lat,
        ]);
        setZoom(map.getZoom());
    }, [map]);

    const onMove = useCallback(() => {
        updateMap();
    }, [updateMap]);

    React.useEffect(() => {
        updateMap();
    }, [updateMap]);

    useEffect(() => {
        map.on("moveend", onMove);
        return () => {
            map.off("moveend", onMove);
        };
    }, [map, onMove]);

    const points = data.map((obs) => ({
        type: "Feature",
        properties: {
            cluster: false,
            code: obs.code,
            name: obs.name,
            alt: obs.alt,
        },
        geometry: {
            type: "Point",
            coordinates: [obs.lng, obs.lat],
        },
    }));

    const { clusters, supercluster } = useSupercluster({
        points: points,
        bounds: bounds,
        zoom: zoom,
        options: { radius: 75, maxZoom: 17 },
    });


    return (
        <>
            {clusters.map((cluster) => {
                // every cluster point has coordinates
                const [longitude, latitude] = cluster.geometry.coordinates;
                const { cluster: isCluster, point_count: pointCount } =
                    cluster.properties;

                // we have a cluster to render
                if (isCluster) {
                    return (
                        <Marker
                            key={`cluster-${cluster.id}`}
                            position={[latitude, longitude]}
                            icon={fetchIcon(
                                pointCount,
                                10 + (pointCount / points.length) * 40
                            )}
                            eventHandlers={{
                                click: () => {
                                    const expansionZoom = Math.min(
                                        supercluster.getClusterExpansionZoom(
                                            cluster.id
                                        ),
                                        maxZoom
                                    );
                                    map.setView(
                                        [latitude, longitude],
                                        expansionZoom,
                                        { animate: true }
                                    );
                                },
                            }}
                        />
                    );
                }

                return (
                    <Marker
                        key={`obs-${cluster.properties.code}`}
                        position={[latitude, longitude]}
                        icon={observatoryIcon}
                        eventHandlers={{
                            click: () => {
                                setCenter({lat: latitude, lng: longitude, alt: cluster.properties.alt, observatoryName: cluster.properties.name});
                                map.flyTo(
                                    [latitude, longitude],
                                );
                            },
                        }}
                    >
                        <Tooltip>{cluster.properties.name}</Tooltip>
                    </Marker>
                );
            })}
        </>
    );
}

export default ShowObservatories;
