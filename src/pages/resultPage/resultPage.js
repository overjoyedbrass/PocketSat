import { Button, Heading, Table, TableContainer, Tbody, Th, Thead, Tr, VStack } from "@chakra-ui/react";
import React from "react";
import { useGetEphemerisMutation } from "../../api/ephemerides/index.js";
import { selectFormState as selectLocationForm } from "../../store/formInput/locationForm.js";
import { selectFormState as selectTimeForm } from "../../store/formInput/timeForm.js";
import { selectFormState as selectObjectForm } from "../../store/formInput/objectForm.js";
import { useSelector } from "react-redux";
import { CollapseJson, Loader, MyTable } from "../../components";
import { useNavigate } from "react-router-dom";


export const ResultPage = () => {
    const [calculateEphemeris, { isLoading, data }] = useGetEphemerisMutation();

    const locationForm = useSelector(selectLocationForm);
    const timeForm = useSelector(selectTimeForm);
    const objectForm = useSelector(selectObjectForm);
    const formState = {
        ...locationForm,
        ...timeForm,
        ...objectForm,
    }
    formState.observatoryName = formState.observatoryName || "Custom";
    const navigate = useNavigate();
    const missingValue = Object.values(formState).includes("")

    function getResults() {
        if(missingValue) {
            navigate("/")
        }
        calculateEphemeris(formState);
    }

    if(isLoading) {
        return <Loader loadInformation={"Calculating results. . ."}/>;
    }
    const columns = [
        "Date (UTC)",
        "Az [deg]",
        "h [deg]",
        "R.A. [deg]",
        "dec [deg]",
        "Phase [deg]",
        "Obs. r. [km]",
        "Angular [arcm/min]",
        "Shadow",
    ];

    return (<VStack>
        <Heading>
            Summary
        </Heading>
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
                        <Th>Object name</Th>
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
        <Button onClick={() => navigate("/", {state: formState})}>{missingValue ? "Fill all input fields" : "Change inputs" }</Button>

        <Heading pt={10}>
            Results
        </Heading>

            {data == null && !missingValue ? <Button onClick={getResults}>Calculate ephemeris</Button> : null}
            {!data || (<MyTable data={data} columns={columns} />)}
            {!data || <CollapseJson data={data} />}
        </VStack>)
}