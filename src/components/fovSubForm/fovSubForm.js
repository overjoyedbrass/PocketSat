/* eslint-disable react-hooks/exhaustive-deps */
import { Divider,  FormControl,  FormHelperText,  FormLabel,  HStack,  Heading, Input, VStack } from "@chakra-ui/react";
import { MyNumberInput } from "../myNumberInput";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { selectFormState, updateForm } from "../../store/formInput/fovForm";
// import { useDispatch } from "react-redux";

function toDegrees(h,m,s) {
    if(isNaN(h) || isNaN(m) || isNaN(s)) return 0;
    return Number(h) + Number(m/60) + Number(s/3600);
}
function fromDegrees(deg) {
    let h = Math.round(deg);
    let m = Math.round((deg-h) * 60);
    let s = Math.round((deg - h - m/60) * 3600);
    return {h, m, s}
}


const hms = {
    h: "hours",
    m: "minutes",
    s: "seconds",
}


export const  FovSubForm = () => {
    const dispatch = useDispatch();    
    const fovFormState = useSelector(selectFormState);    
    const [ra, setRa] = useState(fromDegrees(fovFormState.ra));
    const [dec, setDec] = useState(fromDegrees(fovFormState.dec));

    useEffect(() => {
        dispatch(updateForm({ra: toDegrees(ra.h, ra.m, ra.s)}))  
    }, [ra.h, ra.m, ra.s]);

    useEffect(() => {
        dispatch(updateForm({dec: toDegrees(dec.h, dec.m, dec.s)}))
    }, [dec.h, dec.m, dec.s]);    

    return (
        <VStack align="flex-start"
            flex={1}
            w="100%"
            alignItems="center"
            spacing={4}
            p={3}>
            <Heading size="md" m="auto">Field of view</Heading>
            <Divider />
            <FormControl>
                <FormLabel>Center of Fov - RA</FormLabel>
                <HStack>
                    {["h", "m", "s"].map(unit => 
                        (<Input title={hms[unit]} variant="filled" placeholder={unit} type="number" onChange={({target: {value}}) => setRa({...ra, [unit]: value})}/>)
                    )}            
                </HStack>
                <FormHelperText>Right Ascension [hours]</FormHelperText>    
            </FormControl>

            <FormControl>
                <FormLabel>Center of Fov - Dec</FormLabel>
                <HStack>
                    {["h", "m", "s"].map(unit => 
                        (<Input title={hms[unit]} variant="filled" placeholder={unit} type="number" onChange={({target: {value}}) => setDec({...dec, [unit]: value})}/>)
                    )}                
                </HStack>
                <FormHelperText> Declination [degrees]</FormHelperText>
            </FormControl>
            <HStack w="100%">
                <MyNumberInput title="Width of Fov" helperText="[degrees]" size="sm"/>
                <MyNumberInput title="Height of Fov" helperText="[degrees]" size="sm"/>
            </HStack>
            <MyNumberInput title="Limiting magnitude" helperText="[mag]" size="sm"/>

        </VStack>
    )
}