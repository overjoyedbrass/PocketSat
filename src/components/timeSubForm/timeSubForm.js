import { Checkbox, Divider, FormLabel, HStack, Heading, Select, VStack } from "@chakra-ui/react";
import React from "react";
import { updateForm } from "../../store/formInput/timeForm";
import { useDispatch } from "react-redux";
import { format, add } from "date-fns";
import { MyNumberInput } from "../myNumberInput";
import { DateTimeInput } from "./dateTimeInput";
import { IoSettingsOutline } from "react-icons/io5";
import { DropDownMenu } from "../dropDownMenu/dropDownMenu";

//must be inside of <form>{here}</form>
export const TimeSubform = ({ datefrom=null, dateto=null, step=null}) => {
    const [formState, setFormState] = React.useState({
        datefrom: datefrom ?? format(new Date(), "yyyy-MM-dd'T'HH:mm"),
        dateto: dateto ?? format(add(new Date(), {hours: 1}), "yyyy-MM-dd'T'HH:mm"),
        step: step ?? 10,
        stepUnits:  "s",
        noc: 1, //number of calculations
    });
    const [useEndTime, setUseEndTime] = React.useState(true);

    const dispatch = useDispatch();
    const handleChange = ({target: {name, value}}) => {
         setFormState((prev) => ({ ...prev, [name]: value }));
    }
    React.useEffect(() => {
        dispatch(updateForm(formState));
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [formState]);
    const plural = formState.step > 1 ? "s" : "";
    return (
        <VStack
            align="flex-start"
            alignItems="center"
            flex={1}
            p={3} w="100%" spacing={4}
            height="fit-content"
            transition={"height 0.25s ease-in"}
            >
            <HStack w="100%">
                <Heading size="md" m="auto">Select time frame</Heading>
                <DropDownMenu icon={<IoSettingsOutline  size={"2em"}/>} children={
                    (<HStack>
                        <Checkbox name="useEndTime" isChecked={useEndTime} id="useEndTime" onChange={() => setUseEndTime(!useEndTime)} />
                        <FormLabel userSelect={"none"} htmlFor="useEndTime">Use end time to specify number of calculations</FormLabel>                
                    </HStack>)
                }/>
            </HStack>
            <Divider />
            <DateTimeInput
                label="Start of observation"
                value={formState.datefrom}
                name="datefrom"
                onChange={handleChange}
                helperText="Start of observing (UTC)"
            />
            {useEndTime ? 
            <DateTimeInput
                label="End of observation"
                name="dateto" 
                onChange={handleChange} 
                value={formState.dateto} 
                required={true}
                helperText={"End of observing (UTC)"}
            /> :
            <MyNumberInput
                title={"Number of calculations"}
                min={1}
                name="noc"
                max={100}
                precision={0}
            />}
                
            <MyNumberInput 
                value={formState.step}
                title="Step"
                name="step"
                onChange={(val) => handleChange({target: {name: "step", value: val}})}
                min={1}
                max={
                    {s: 59, m: 59, h: 24}[formState.stepUnits]
                }
                helperText={`Delta time between calculations (${formState.step}${formState?.stepUnits})`}
            >
                <Select variant="filled" name="stepUnits" onChange={handleChange} w="fit-content" disabled={true}>
                    <option value="s">second{plural}</option>
                    <option value="m">minute{plural}</option>
                    <option value="h">hour{plural}</option>
                </Select>
            </MyNumberInput>
    </VStack>)
}