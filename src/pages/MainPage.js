import React from "react";

import { 
    Button, FormLabel, HStack, 
    Heading, Input, VStack, 
    FormControl, FormHelperText 
} from '@chakra-ui/react'

import {
    MapContainer, TileLayer, Marker, useMap, useMapEvents
} from "react-leaflet"

import L from "leaflet";

import "leaflet/dist/leaflet.css"

const markerIcon = L.icon({
    iconUrl: "https://static.vecteezy.com/system/resources/previews/009/267/042/original/location-icon-design-free-png.png",
    iconSize: new L.Point(45, 60),
    iconAnchor: new L.Point(22.5, 60),
})


function ChangeView({ center, zoom }) {
    const map = useMap();
    map.setView(center);
    return null;
}

export const MainPage = () => {
    const [center, setCenter] = React.useState({ lat: 48.14816, lng: 17.10674})
    const markerRef = React.useRef();

    function handleClick (e) {
        const { lat, lng } = e.latlng;
        setCenter(lat, lng)
    }

    function handleChange({target: {value, name}}) {
        setCenter({...center, [name]: value})
    }

    function sendToServer(_event) {
        alert("SENDING TO SERVER");
    }

    const eventHandlers = React.useMemo(
        () => ({
          dragend() {
            const marker = markerRef.current
            if (marker != null) {
              setCenter(marker.getLatLng())
            }
          },
        }),
        [],
    )

    function MapEvents() {
        useMapEvents({
          click(e) {
            // setState your coords here
            // coords exist in "e.latlng.lat" and "e.latlng.lng"
            setCenter(e.latlng)
          },
        });
        return false;
    }

    return (
        <VStack>
            <HStack width="100%" justify="center" m={5} align="flex-start">
                <VStack align="flex-start" border="1px solid grey" borderRadius="5px" p={3}>
                    <Heading size="md">Select time frame</Heading>
                    <HStack>
                        <FormControl>
                            <FormLabel>Start date</FormLabel>
                            <Input type='date' />
                            <FormHelperText>Start of observing (UTC)</FormHelperText>
                        </FormControl>

                        <FormControl>
                            <FormLabel>End date</FormLabel>
                            <Input type='date' />
                            <FormHelperText>End of observing (UTC)</FormHelperText>
                        </FormControl>
                    </HStack>
                </VStack>


                <VStack align="flex-start" border="1px solid grey" borderRadius="5px" p={3} spacing="1em">
                    <Heading size="md">Choose your location</Heading>
                        <FormControl>
                            <FormLabel>Observatory</FormLabel>
                            <Input type="text" defaultValue="AGO"/>
                        </FormControl>
                        <FormControl>
                            <FormLabel>Latitude</FormLabel>
                            <Input name="lat" type="number" value={center.lat} onChange={handleChange}/>
                        </FormControl>
                        <FormControl>
                            <FormLabel>Longitude</FormLabel>
                            <Input name="lng" type="number" value={center.lng} onChange={handleChange}/>
                        </FormControl>
                        <FormControl>
                            <FormLabel>Altitude</FormLabel>
                            <Input type="number" defaultValue={2000}/>
                        </FormControl>

                        <MapContainer
                            center={center}
                            zoom={10}
                            style={{ width: "600px", height: "300px", border: "2px solid blue"}}
                            onClick={handleClick}
                        >
                            <ChangeView center={center} />                            
                            <MapEvents />
                            <Marker
                                icon={markerIcon}
                                position={[center.lat, center.lng]}
                                draggable={true}
                                eventHandlers={eventHandlers}
                                ref={markerRef}
                            />
                            <TileLayer
                                url="https://api.maptiler.com/maps/basic/256/{z}/{x}/{y}.png?key=DiGXSou1X4F8AfvgZ1cu"
                            >

                            </TileLayer>
                        </MapContainer>

                </VStack>

                <VStack align="flex-start" border="1px solid grey" borderRadius="5px" p={3}>
                    <Heading size="md">Select object</Heading>
                    <HStack>
                        <FormControl>
                            <FormLabel>Object name:</FormLabel>
                            <Input />
                        </FormControl>
                    </HStack>
                </VStack>

            </HStack>
            <Button onClick={sendToServer}>SEND TO SERVER</Button>
        </VStack>

    )
}