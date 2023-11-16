import { Button, Heading, Table, TableCaption, TableContainer, Tbody, Text, Textarea, Tfoot, Th, Thead, Tr, VStack } from "@chakra-ui/react";
import React from "react";
import { useGetEphemerisMutation } from "../../api/ephemerides/index.js";
import { selectFormState } from "../../store/formInput/formInput.js";
import { useSelector } from "react-redux";
import { Loader } from "../../components";
import { useNavigate } from "react-router-dom";
import {  } from "date-fns";


export const ResultPage = () => {
    const [calculateEphemeris, { isLoading, data }] = useGetEphemerisMutation();
    const formState = useSelector(selectFormState);
    const navigate = useNavigate();

    function getResults() {
        calculateEphemeris(formState);
    }

    if(isLoading) {
        return <Loader loadInformation={"Calculating results. . ."}/>;
    }

    const dumpRows = [
        [999, 999, 999, 999, 999, 999, 999, 999, 999],
        [999, 999, 999, 999, 999, 999, 999, 999, 999],
        [999, 999, 999, 999, 999, 999, 999, 999, 999],
        [999, 999, 999, 999, 999, 999, 999, 999, 999],
        [999, 999, 999, 999, 999, 999, 999, 999, 999],
        [999, 999, 999, 999, 999, 999, 999, 999, 999],
        [999, 999, 999, 999, 999, 999, 999, 999, 999],
        [999, 999, 999, 999, 999, 999, 999, 999, 999],
    ];
    return (<VStack>
        <Heading>
            Summary
        </Heading>
        <TableContainer borderRadius="10px">
            <Table variant="simple">
                <TableCaption>
                    <Button onClick={() => navigate("/", {state: formState})}>Change inputs</Button>
                </TableCaption>
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

        <Heading pt={10}>
            Results
        </Heading>

            {data == null ? <Button onClick={getResults}>Calculate ephemeris</Button> : null}
            {!data || (
                <TableContainer>
                    <Table variant="simple">
                        <TableCaption>
                            This is table caption.
                        </TableCaption>
                    <Thead>
                        <Tr>
                            <Th>Date (UTC)</Th>
                            <Th>Az [deg]</Th>
                            <Th>h [deg]</Th>
                            <Th>R.A. [deg]</Th>
                            <Th>dec [deg]</Th>
                            <Th>Phase [deg]</Th>
                            <Th>Obs. r. [km]</Th>
                            <Th>Angular [arcm/min]</Th>
                            <Th>Shadow</Th>
                        </Tr>
                    </Thead>
                    <Tbody>
                        {dumpRows.map(dumpRow => (
                            <Tr>
                                {dumpRow.map(field => (
                                    <Th>{field}</Th>
                                ))}
                            </Tr>
                        ))}
                    </Tbody>
                    <Tfoot>
                        <Tr>
                            <Th>Date (UTC)</Th>
                            <Th>Az [deg]</Th>
                            <Th>h [deg]</Th>
                            <Th>R.A. [deg]</Th>
                            <Th>dec [deg]</Th>
                            <Th>Phase [deg]</Th>
                            <Th>Obs. r. [km]</Th>
                            <Th>Angular [arcm/min]</Th>
                            <Th>Shadow</Th>
                        </Tr>
                    </Tfoot>
                </Table>
                </TableContainer>
            )}


            {!data || <Textarea value={data?.data} />}
        </VStack>)
}