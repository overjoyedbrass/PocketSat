import { Button, HStack, Heading, Table, TableContainer, Tbody, Tfoot, Th, Thead, Tr, VStack } from "@chakra-ui/react";
import { useState } from "react";

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

export const TableDataDisplay = ({ data }) => {
    const RECORDS_ON_PAGE = 50
    const [page, setPage] = useState(0);
    const dataOnPage = data.slice(page*RECORDS_ON_PAGE, (page+1)*RECORDS_ON_PAGE);
    const pagesCount = Math.ceil(data.length/RECORDS_ON_PAGE-1);

    function previousPage() {
        setPage(Math.max(0, page-1));
    }
    function nextPage() {
        setPage(Math.min(pagesCount, page+1));
    }

    return (
        <VStack>
        <HStack>
            <Button isDisabled={page <= 0} onClick={previousPage}>&lt;</Button>
            <Heading>Page: {page+1} / {pagesCount+1}</Heading>
            <Button isDisabled={page >= pagesCount} onClick={nextPage}>&gt;</Button>
        </HStack>
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
                    {dataOnPage.map((row, i) => (
                        <Tr key={i}>
                            {Object.keys(row).map(key => (
                                <Th key={key}>{row[key].toString()}</Th>
                            ))}
                        </Tr>
                    ))}
                </Tbody>
                {dataOnPage?.length >= 10 ? <Tfoot position={"sticky"} bottom="0" bg="black">
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
        </TableContainer>
        </VStack>)
}