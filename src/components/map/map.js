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
import { getUserLocation } from "../../utils/helpers";


const markerIcon = L.icon({
    iconUrl: locationMarker,
    iconSize: new L.Point(30, 50),
    iconAnchor: new L.Point(22.5, 60),
});
const tilesUrl = "https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png";

export const Map = ({ ...props }) => {
    const [showObservatories, setShowObservatories] = React.useState(true);
    const center = {...useSelector(selectFormState)};

    document.getElementById("mapcontainer")?.setAttribute("disabled", true);

    React.useEffect(() => {        
        ['[class^="cluster"]', '[class^="leaflet"]'].forEach(selector =>
            document.querySelectorAll(selector).forEach(el => el.tabIndex = -1)
        )
    }, [center.lat, center.lng, center.alt]);
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
        <Flex {...props} tabIndex={-1}>
            <MapContainer
                id="mapcontainer"
                attributionControl={false}
                center={center}
                zoom={10}
                tabindex={-1}
                keyboard={false}
                style={{
                    width: "100%",
                    height: "100%",
                    borderRadius: "10px",
                    zIndex: 10,
                    tabIndex: -1,
                }}>
                {!showObservatories || <ShowObservatories
                    center={center}
                    data={observatories}
                />}
                <MyMarker center={center} />
                <TileLayer url={tilesUrl}></TileLayer>
                <FullscreenControl position="topright" forceSeparateButton={true} tabindex={-1}/>
                <Control position="topright">
                    <UseMyLocation />
                </Control>
                <Control prepend position='bottomright' tabindex={-1}>
                    <HStack m={0} p={0}>
                        <CenterMapButton center={center} />
                        <Button tabIndex={-1} colorScheme="black" onClick={() => setShowObservatories(!showObservatories)} size={"xs"}>
                            {showObservatories ? "Hide observatories" : "Show observatories"}
                        </Button>
                    </HStack>
                </Control>
                <AutoRecenter center={center} />

            </MapContainer>
        </Flex>
    )
}

function AutoRecenter({center}) {
    const map = useMap();
    React.useEffect(() => {
        map.panTo(center);
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [center.lat, center.lng]);
    return null;
}

const MyMarker = ({center}) => {
    const dispatch = useDispatch();
    const markerRef = React.useRef();
    return (
        <Marker
            tabindex={-1}
            style={{
                tabIndex: -1
            }}
            icon={markerIcon}
            position={[center.lat, center.lng]}
            draggable={true}
            eventHandlers={{dragend: () => {
                const marker = markerRef.current;
                if(marker) {
                    const loc = marker.getLatLng();
                    dispatch(updateForm({...loc, observatoryName: "Custom"}));
                }
            }}}
            ref={markerRef}
        />
    )
}


const UseMyLocation = () => {
    const dispatch = useDispatch();
    function setCenter(location) {
        dispatch(updateForm({...location, observatoryName: "Current location"}));
    }

    return (<IconButton
        colorScheme="black"
        title="Your current location" 
        onClick={(e) => getUserLocation(e, setCenter)}
        onMouseDown={(e) => e.preventDefault()}
        aria-label="get user location" 
        size="sm"
        placeholder="Use your location"
        tabIndex={-1}
        icon={<FaLocationCrosshairs size="1.5em" />} color="black"
    />)

}

const CenterMapButton = ({center}) => {
    const map = useMap();
    function onClick() {
        map.panTo(center);
    }
    return (<Button colorScheme="black" size={"xs"} tabIndex={-1} onClick={onClick}>Center to marker</Button>)
}