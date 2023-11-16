import ShowObservatories from "./ShowObservatories"
import {
    MapContainer,
    TileLayer,
    Marker,
} from "react-leaflet";
import { observatories } from "../../data/observatories";

import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { Flex } from "@chakra-ui/react";


const markerIcon = L.icon({
    iconUrl:
        "https://static.vecteezy.com/system/resources/previews/009/267/042/original/location-icon-design-free-png.png",
    iconSize: new L.Point(45, 60),
    iconAnchor: new L.Point(22.5, 60),
});

export const Map = ({ center, setCenter, markerRef, eventHandlers, setObsquery, ...props }) => {
    return (
        <Flex {...props}>
            <MapContainer
                center={center}
                zoom={10}
                style={{
                    width: "100%",
                    height: "100%",
                }}>
                <ShowObservatories
                    center={center}
                    data={observatories}
                    setCenter={setCenter}
                    setObsquery={setObsquery}
                />
                <Marker
                    icon={markerIcon}
                    position={[center.lat, center.lng]}
                    draggable={true}
                    eventHandlers={eventHandlers}
                    ref={markerRef}
                />
                <TileLayer url="https://api.maptiler.com/maps/basic/256/{z}/{x}/{y}.png?key=DiGXSou1X4F8AfvgZ1cu"></TileLayer>
            </MapContainer>
        </Flex>
    )
}