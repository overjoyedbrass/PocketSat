import { useState } from "react";
import { RawDataDisplay } from "../rawDataDisplay";
import { GraphDataDisplay } from "../graphDataDisplay";
import { SphereDataDisplay } from "../sphereDataDisplay";
import { TableDataDisplay } from "../tableDataDisplay";
import { Button, Divider, HStack, VStack } from "@chakra-ui/react";

import { BsGraphUp } from "react-icons/bs";
import { ImSphere } from "react-icons/im";
import { FaTable } from "react-icons/fa";
import { TbJson } from "react-icons/tb";


const dataFormats = [
    GraphDataDisplay,
    SphereDataDisplay,
    TableDataDisplay,
    RawDataDisplay,
];

const dataFormatsLabels = [
    "Graph",
    "2D Sphere",
    "Table",
    "Raw data",
];

const dataFormatsIcons = [
    BsGraphUp,
    ImSphere,
    FaTable,
    TbJson,
];



export const DataDisplay = ({ data }) => {
    const [dataFormat, setDataFormat] = useState(0);
    const SelectedDataDisplay = dataFormats[dataFormat];
    return (<VStack justify={"center"}>
            <HStack divider={<Divider orientation="vertical" />}>
                {dataFormatsIcons.map((Icon, index) => (
                    <Button leftIcon={<Icon />} onClick={() => setDataFormat(index)} colorScheme={index === dataFormat ? "green" : "black"} >
                        {dataFormatsLabels[index]}
                    </Button>
                ))}
            </HStack>
            <SelectedDataDisplay data={data} />
        </VStack>)
}