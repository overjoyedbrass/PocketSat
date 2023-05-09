import React from "react";

import { observatories } from "../data/observatories.js";
import ShowObservatories from "../components/ShowObservatories.js";
import {
    Button,
    FormLabel,
    HStack,
    Heading,
    Input,
    VStack,
    FormControl,
    FormHelperText,
    Divider,
} from "@chakra-ui/react";

import {
    MapContainer,
    TileLayer,
    Marker,
} from "react-leaflet";

import L from "leaflet";

import "leaflet/dist/leaflet.css";

const markerIcon = L.icon({
    iconUrl:
        "https://static.vecteezy.com/system/resources/previews/009/267/042/original/location-icon-design-free-png.png",
    iconSize: new L.Point(45, 60),
    iconAnchor: new L.Point(22.5, 60),
});

function matchObservatory(query) {
    query = query.toLowerCase();
    return observatories.filter((obs) =>
        query
            .split(" ")
            .map(
                (kw) =>
                    obs.code.toLowerCase().includes(kw) ||
                    obs.name.toLowerCase().includes(kw) ||
                    obs.region.toLowerCase().includes(kw)
            )
            .every((_) => _)
    );
}


export const MainPage = () => {
    const [center, setCenter] = React.useState({
        lat: 48.14816,
        lng: 17.10674,
        alt: 20,
    });
    const markerRef = React.useRef();

    const [obsquery, setObsquery] = React.useState("");
    const filteredObs = matchObservatory(obsquery);

    const searchInput = React.createRef();

    const [focused, setFocused] = React.useState(false);
    const onFocus = () => setFocused(true);
    const onBlur = () => setTimeout(() => setFocused(false), 100);

    function handleObsQuery({ target: { value } }) {
        setObsquery(value);
    }

    function setObs(obs) {
        setCenter({ ...obs });
        setObsquery(obs.name);
    }

    function handleChange({ target: { value, name } }) {
        setCenter({ ...center, [name]: value });
        setObsquery("Custom");
    }

    async function sendToServer(_event) {
        alert("SENDING TO SERVER");
        try {
            const res = await fetch("http://localhost:8080/ephemerides");
            alert("answer: " + (await res.text()));
        } catch {
            alert("server is probably offline");
        }
    }

    const eventHandlers = React.useMemo(
        () => ({
            dragend() {
                const marker = markerRef.current;
                if (marker != null) {
                    setCenter({...marker.getLatLng(), alt: center.alt});
                    setObsquery("Custom");
                }
            },
        }),
        [center]
    );

    return (
        <VStack>
            <HStack width="100%" justify="center" m={5} align="flex-start">
                <VStack
                    align="flex-start"
                    border="1px solid grey"
                    borderRadius="5px"
                    p={3}
                >
                    <Heading size="md">Select time frame</Heading>
                    <VStack>
                        <FormControl>
                            <FormLabel>Start date</FormLabel>
                            <Input type="datetime-local" />
                            <FormHelperText>
                                Start of observing (UTC)
                            </FormHelperText>
                        </FormControl>

                        <FormControl>
                            <FormLabel>End date</FormLabel>
                            <Input type="datetime-local" />
                            <FormHelperText>
                                End of observing (UTC)
                            </FormHelperText>
                        </FormControl>

                        <FormControl>
                            <FormLabel>Step</FormLabel>
                            <Input type="number" defaultValue={1}/>
                            <FormHelperText>
                                Step of each next calculation (seconds)
                            </FormHelperText>
                        </FormControl>
                    </VStack>
                </VStack>

                <VStack
                    align="flex-start"
                    border="1px solid grey"
                    borderRadius="5px"
                    p={3}
                    spacing="1em"
                >
                    <Heading size="md">Choose your location</Heading>
                    <FormControl position="relative">
                        <Input
                            value={obsquery}
                            onChange={handleObsQuery}
                            ref={searchInput}
                            onFocus={onFocus}
                            onBlur={onBlur}
                        />
                        {!focused || obsquery.length <= 2 || (
                            <VStack
                                className="autocomplete"
                                align="flex-start"
                                divider={<Divider />}
                            >
                                {filteredObs.map((obs) => (
                                    <div
                                        key={`obs-${obs.code}`}
                                        className="autocomplete-card"
                                        onClick={() => setObs(obs)}
                                    >
                                        {obs.name} ({obs.code})
                                    </div>
                                ))}
                                {filteredObs.length === 0 ? (
                                    <div className="autocomplete-card">
                                        No matches
                                    </div>
                                ) : null}
                            </VStack>
                        )}
                    </FormControl>
                    <FormControl>
                        <FormLabel>Latitude</FormLabel>
                        <Input
                            name="lat"
                            type="number"
                            value={center.lat}
                            onChange={handleChange}
                        />
                    </FormControl>
                    <FormControl>
                        <FormLabel>Longitude</FormLabel>
                        <Input
                            name="lng"
                            type="number"
                            value={center.lng}
                            onChange={handleChange}
                        />
                    </FormControl>
                    <FormControl>
                        <FormLabel>Altitude</FormLabel>
                        <Input name="alt" value={center.alt} onChange={handleChange} type="number" />
                    </FormControl>

                    <MapContainer
                        center={center}
                        zoom={10}
                        style={{
                            width: "600px",
                            height: "300px",
                            border: "2px solid blue",
                        }}
                    >
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
                </VStack>

                <VStack
                    align="flex-start"
                    border="1px solid grey"
                    borderRadius="5px"
                    p={3}
                >
                    <Heading size="md">Select object</Heading>
                    <HStack>
                        <FormControl>
                            <FormLabel>Object name:</FormLabel>
                            <Input defaultValue="37204"/>
                        </FormControl>
                    </HStack>
                </VStack>
            </HStack>
            <Button onClick={sendToServer}>SEND TO SERVER</Button>
        </VStack>
    );
};
