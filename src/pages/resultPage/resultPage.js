import { Button, HStack, Heading, Table, TableContainer, Tbody, Th, Thead, Tr, VStack } from "@chakra-ui/react";
import React from "react";
import { useGetEphemerisMutation } from "../../api/ephemerides/index.js";
import { selectFormState as selectLocationForm } from "../../store/formInput/locationForm.js";
import { selectFormState as selectTimeForm } from "../../store/formInput/timeForm.js";
import { selectFormState as selectObjectForm } from "../../store/formInput/objectForm.js";
import { useSelector } from "react-redux";
import { DataDisplay, Loader } from "../../components";
import { useNavigate } from "react-router-dom";
import { MdOutlineKeyboardBackspace } from "react-icons/md";


function collectFormFields(locationForm, timeForm, objectForm) {
    const resObj = {
        ...locationForm,
        errors: [],
    }
    if(timeForm.useEndTime) {
        delete timeForm.numberOfCalculations;
    }
    Object.assign(resObj, timeForm);
    if(objectForm.customTLE && objectForm.tleError) {
        resObj.error.push("Wrong TLE format");
        delete objectForm.tleError;
    } else {
        delete objectForm.tle;
    }
    Object.assign(resObj, objectForm);
    return resObj;
}

export const ResultPage = () => {
    const [calculateEphemeris, { isLoading, data }] = useGetEphemerisMutation();

    const locationForm = useSelector(selectLocationForm);
    const timeForm = useSelector(selectTimeForm);
    const objectForm = useSelector(selectObjectForm);
    const formState = collectFormFields(
        {...locationForm},
        {...timeForm},
        {...objectForm},
    )
    formState.observatoryName = formState.observatoryName || "Custom";
    const navigate = useNavigate();
    const missingValue = Object.values(formState).filter(val => ["", -1].includes(val));

    console.log(formState);
    const errors = formState.errors;

    function getResults() {
        if(missingValue.length > 0 || errors.length > 0) {
            navigate("/")
        }
        calculateEphemeris(formState);
    }

    if(isLoading) {
        return <Loader loadInformation={"Calculating results. . ."}/>;
    }
    

    if(data) {
        return (<>
            <HStack w="100%" justify="center" p={2} spacing={0} position="relative">
                <Button colorScheme={"blue"} left={2} position={"absolute"} onClick={() => navigate("/")} leftIcon={<MdOutlineKeyboardBackspace />}>
                    Do another calculation
                </Button>
                <Heading>
                    Results
                </Heading>
            </HStack>
            <DataDisplay data={ data }/>
        </>
        )
    }

    return (<VStack>
        <HStack justify={"center"} w="100%" spacing={0} position="relative" p={2}>
            <Button colorScheme={missingValue.length > 0 ? "red" : "blue"} left={2} position={"absolute"} onClick={() => navigate("/")} leftIcon={<MdOutlineKeyboardBackspace />}>
                {missingValue.length > 0 ? `Fill all input fields${errors.length > 0 ? " and fix errors" : ""}` : "Change inputs" }
            </Button>
            <Heading>Summary</Heading>
        </HStack>
        <TableContainer borderRadius="10px">
            <Table variant="simple">
                <Thead>
                    <Tr>
                        <Th>Start time</Th>
                        <Th>End Time</Th>
                        <Th>Step</Th>
                        <Th>Lantitude</Th>
                        <Th>Longitude</Th>
                        <Th>Altitude</Th>
                        <Th>Object ID</Th>
                    </Tr>
                </Thead>
                <Tbody>
                    <Tr>
                        <Th>{ formState.datefrom }</Th>
                        <Th>{ formState.dateto }</Th>
                        <Th>{ formState.step }</Th>
                        <Th>{ formState.lat }</Th>
                        <Th>{ formState.lng }</Th>
                        <Th>{ formState.alt }</Th>
                        <Th>{ formState.objectId }</Th>
                    </Tr>
                </Tbody>
            </Table>
        </TableContainer>
            {data == null && !missingValue.length ? 
            <Button colorScheme="green" onClick={getResults}>Calculate ephemeris</Button> : null}
        </VStack>)
}