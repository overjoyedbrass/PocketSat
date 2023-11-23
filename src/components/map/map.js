import React from "react";
import ShowObservatories from "./ShowObservatories"
import {
    MapContainer,
    TileLayer,
    Marker,
    useMap,
} from "react-leaflet";
import { observatories } from "../../data/observatories";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { Button, Flex, HStack, IconButton } from "@chakra-ui/react";
import locationMarker from "../../assets/location-marker.png";
import { FullscreenControl } from "react-leaflet-fullscreen";
import 'leaflet.fullscreen/Control.FullScreen.css'
import Control from "react-leaflet-custom-control";
import { useDispatch, useSelector } from "react-redux";
import { selectFormState, updateForm } from "../../store/formInput/locationForm";
import { FaLocationCrosshairs } from "react-icons/fa6";


const markerIcon = L.icon({
    iconUrl: locationMarker,
    iconSize: new L.Point(30, 50),
    iconAnchor: new L.Point(22.5, 60),
});
const tilesUrl = "https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png";

export const Map = ({ ...props }) => {
    const [showObservatories, setShowObservatories] = React.useState(true);
    const center = {...useSelector(selectFormState)};

    // eslint-disable-next-line eqeqeq
    if(center.lat == "-") {
        center.lat = ""
    }
    // eslint-disable-next-line eqeqeq
    if(center.lng == "-") {
        center.lng = ""
    }
    // eslint-disable-next-line eqeqeq
    if(center.alt == "-") {
        center.alt = ""
    }

    return (
        <Flex {...props}>
            <MapContainer
                attributionControl={false}
                center={center}
                zoom={10}
                style={{
                    width: "100%",
                    height: "100%",
                    borderRadius: "10px",
                    zIndex: 10,
                }}>
                {!showObservatories || <ShowObservatories
                    center={center}
                    data={observatories}
                />}
                <MyMarker center={center} />
                <TileLayer url={tilesUrl}></TileLayer>
                <FullscreenControl position="topright" forceSeparateButton={true} />
                <Control position="topright">
                    <UseMyLocation />
                </Control>
                <Control prepend position='bottomright'>
                    <HStack m={0} p={0}>
                        <CenterMapButton center={center} />
                        <Button colorScheme="black" onClick={() => setShowObservatories(!showObservatories)} size={"xs"}>
                            {showObservatories ? "Hide observatories" : "Show observatories"}
                        </Button>
                    </HStack>
                </Control>
            </MapContainer>
        </Flex>
    )
}

const MyMarker = ({center}) => {
    const dispatch = useDispatch();
    const markerRef = React.useRef();
    const map = useMap();
    return (
        <Marker 
            icon={markerIcon}
            position={[center.lat, center.lng]}
            draggable={true}
            eventHandlers={{dragend: () => {
                const marker = markerRef.current;
                if(marker) {
                    const loc = marker.getLatLng();
                    dispatch(updateForm({...loc, observatoryName: "Custom"}));
                    map.flyTo(loc)
                }
            }}}
            ref={markerRef}
        />
    )
}


const UseMyLocation = () => {
    const map = useMap();
    const dispatch = useDispatch();
    function setCenter(location) {
        dispatch(updateForm({...location, observatoryName: "Current location"}));
        map.flyTo(location);
    }

    function getUserLocation(e) {
        e.preventDefault();
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition((position) => {
                const latitude = position.coords.latitude;
                const longitude = position.coords.longitude;
                setCenter({ lat: latitude, lng: longitude, alt: ""});
            }, () => {
                console.log("Unable to get location");
            });
        } else {
            console.log("Geolocation not supported");
        }
    }
    return (<IconButton
        colorScheme="black"
        title="Your current location" 
        onClick={getUserLocation} 
        onMouseDown={(e) => e.preventDefault()}
        aria-label="get user location" 
        size="sm"
        placeholder="Use your location"
        icon={<FaLocationCrosshairs size="1.5em" />} color="black"
    />)

}

const CenterMapButton = ({center}) => {
    const map = useMap();
    function onClick() {
        map.flyTo(center);
    }
    return (<Button colorScheme="black" size={"xs"} onClick={onClick}>Center to marker</Button>)
}