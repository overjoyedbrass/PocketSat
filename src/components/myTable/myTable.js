import { Table, TableContainer, Tbody, Tfoot, Th, Thead, Tr } from "@chakra-ui/react";
import React from "react";
            
export const MyTable = ({data, columns}) => {
    return (
        <TableContainer maxH={"70vh"} overflowY="auto">
                <Table variant="simple">
                <Thead position={"sticky"} top="0" bg="black">
                    <Tr>
                        {columns.map(column => (
                            <Th key={column}>{column}</Th>    
                        ))}
                    </Tr>
                </Thead>
                <Tbody>
                    {data.map((row, i) => (
                        <Tr key={i}>
                            {Object.keys(row).map(key => (
                                <Th key={key}>{row[key].toString()}</Th>
                            ))}
                        </Tr>
                    ))}
                </Tbody>
                {data?.length >= 10 ? <Tfoot position={"sticky"} bottom="0" bg="black">
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
                </Tfoot> : null}
            </Table>
        </TableContainer>)
}