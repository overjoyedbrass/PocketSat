import { Button, Collapse, VStack, useBreakpointValue } from "@chakra-ui/react";
import React from "react";
import JSONPretty from "react-json-pretty";
import "react-json-pretty/themes/adventure_time.css";
import { download } from "../../util/helpers";
            
export const CollapseJson = ({data}) => {
    const [show, setShow] = React.useState(false);
    const jsonRef = React.useRef(null);

    const handleToggle = () => {
        if(!show) {
            console.log("top", jsonRef.current?.offsetTop);
            setTimeout(() => 
                window.scrollTo({
                    top: jsonRef.current.offsetTop,
                    behavior: "smooth"
            }), 200);
        }
        setShow(!show);
    };


    const fontSize = useBreakpointValue({
        base: "0.8em",
        sm: "1em",
    });
    function downloadRawData() {
        download("ephemeride", JSON.stringify(data, null, 3));
    }
    return (<VStack w="100%">
        <Button ref={jsonRef} onClick={handleToggle}>{show ? "Hide raw data" : "Show raw data"}</Button>
        <Collapse in={show} style={{width: "100%", display: "flex", flexDirection: "column", alignItems: "center"}}>
            <Button w="fit-content" minH="2.5em" onClick={downloadRawData}>Download data</Button>
            <JSONPretty id="raw-data" data={data} space={4} style={{width: "100%", padding: "1em", fontSize: fontSize, background: "none"}}/>
        </Collapse>
    </VStack>)
}