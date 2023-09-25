import React from "react";

import { observatories } from "../data/observatories.js";
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
    NumberInput,
    NumberInputField,
    Text,
} from "@chakra-ui/react";

import { Loader, Map } from "../components";
import { useGetEphemerisMutation } from "../api/ephemerides/index.js";


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
        lat: "48.14816",
        lng: "17.10674",
        alt: "20",
    });

    const [formState, setFormState] = React.useState({});
    const handleChange = ({target: {name, value}}) => setFormState({...formState, [name]: value});


    const [step, setStep] = React.useState(0);
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
    const [calculateEphemeris, { isLoading, data, reset }] = useGetEphemerisMutation();

    async function createResultObject() {
        const input = {...formState, ...center, obs: obsquery};
        calculateEphemeris(input);
    }

    console.log(data);
    
    return (<>
        {data ? 
        (<VStack>
            <Heading>
                Result
            </Heading>
            <br />
            <Text>
                {data?.data.split('\n').map(line => (<><span>{line}</span><br /></>))}
            </Text>
            <Button onClick={reset}>Compute again</Button>
            </VStack>) :
        (<VStack>
            <HStack>
                {step > 0 ? <Button onClick={() => setStep(step - 1)}>Previous step</Button> : null}
                {step < 2 ? <Button onClick={() => setStep(Math.min(step + 1, 2))}>Next step</Button> : null }
                {step === 2 ? <Button onClick={() => createResultObject()}>Calculate ephemeris</Button> : null}
            </HStack>
            {step === 0 ? 
            (<VStack
                align="flex-start"
                border="1px solid grey"
                borderRadius="5px"
                maxWidth="400px"
                minW="20vw"
                alignItems="center"
                p={3}
            >
                <Heading size="md">Select time frame</Heading>
                <VStack width="100%">
                    <FormControl>
                        <FormLabel>Start date</FormLabel>
                        <Input type="datetime-local" name="datefrom" onChange={handleChange} value={formState.datefrom} />
                        <FormHelperText>
                            Start of observing (UTC)
                        </FormHelperText>
                    </FormControl>

                    <FormControl>
                        <FormLabel>End date</FormLabel>
                        <Input type="datetime-local" name="dateto" onChange={handleChange} value={formState.dateto} />
                        <FormHelperText>
                            End of observing (UTC)
                        </FormHelperText>
                    </FormControl>

                    <FormControl>
                        <FormLabel>Step</FormLabel>
                        <Input type="number" defaultValue={1} name="step" onChange={handleChange} value={formState.step}/>
                        <FormHelperText>
                            Step of each next calculation (seconds)
                        </FormHelperText>
                    </FormControl>
                </VStack>
            </VStack>) : step === 1 ?

            <VStack
                align="flex-start"
                border="1px solid grey"
                borderRadius="5px"
                p={3}
                minW="20vw"
                maxWidth="400px"
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
                    <NumberInput value={center.lat} 
                        onChange={(value) => setCenter({...center, lat: value})}
                        step={"0.01"}
                    >
                        <NumberInputField  />
                    </NumberInput>
                </FormControl>
                <FormControl>
                    <FormLabel>Longitude</FormLabel>
                    <NumberInput value={center.lng} onChange={(value) => setCenter({...center, lng: value})} step={"0.01"}>
                        <NumberInputField />
                    </NumberInput>
                </FormControl>
                <FormControl>
                    <FormLabel>Altitude</FormLabel>
                    <NumberInput value={center.alt} onChange={(value) => setCenter({...center, alt: value})} step={"0.01"}>
                        <NumberInputField />
                    </NumberInput>
                </FormControl>

                <Map center={center} setCenter={setCenter} markerRef={markerRef} eventHandlers={eventHandlers} setObsquery={setObsquery} />
            </VStack> : 
            (<VStack
                align="flex-start"
                border="1px solid grey"
                borderRadius="5px"
                maxWidth="400px"
                minW="20vw"
                p={3}
                >
                <Heading size="md">Select object</Heading>
                <HStack width="100%">
                    <FormControl>
                        <FormLabel>Object name:</FormLabel>
                        <Input defaultValue="37204" name="objectid" onChange={handleChange} value={formState.objectid} />
                    </FormControl>
                </HStack>
                </VStack>            
            )}

            </VStack>) }
            { !isLoading || <Loader loadInformation={"Calculating ephemeris"}/> }
            </>
    );
};
