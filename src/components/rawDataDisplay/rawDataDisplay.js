import { Button, Collapse, Heading, VStack, useBreakpointValue } from "@chakra-ui/react";
import React, { useEffect } from "react";
import JSONPretty from "react-json-pretty";
import "react-json-pretty/themes/adventure_time.css";
import { download } from "../../utils/helpers";
import { MdDownload } from "react-icons/md";

const DATA_LENGTH_LIMIT = 20;

export const RawDataDisplay = ({ data }) => {
    const [show, setShow] = React.useState(false);    
    useEffect(() => {
        if(!show) {
            setTimeout(() => setShow(true), 150);
        }
    }, [show]);

    const fontSize = useBreakpointValue({
        base: "0.8em",
        sm: "1em",
    });
    
    function downloadRawData() {
        download("ephemeride", JSON.stringify(data, null, 3));
    }

    const dataToDisplay = data.slice(0, DATA_LENGTH_LIMIT);

    return (<VStack w="100%">
        {data.length > DATA_LENGTH_LIMIT ? <Heading size="sm">Only first {DATA_LENGTH_LIMIT} shown. Click "Download" for full JSON.</Heading> : null}
        <Button leftIcon={<MdDownload />} w="fit-content" minH="2.5em" onClick={downloadRawData}>Download data</Button>
        <Collapse in={show} style={{width: "100%", display: "flex", flexDirection: "column", alignItems: "center"}}>
            <JSONPretty id="raw-data" data={dataToDisplay} space={4} style={{width: "100%", padding: "1em", fontSize: fontSize, background: "none"}}/>
        </Collapse>
    </VStack>)
}