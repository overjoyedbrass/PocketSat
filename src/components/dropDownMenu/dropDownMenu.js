import { IconButton, Menu, MenuButton, MenuItem, MenuList } from "@chakra-ui/react";
import React from "react";
            
export const DropDownMenu = ({placeholder, icon, children}) => {
    if(typeof(children) != Array) {
        children = [children];
    }
    return (<Menu>
        <MenuButton as={IconButton} icon={icon} variant="ghost" size="xs" placeholder="placeholder">
          Actions
        </MenuButton>
        <MenuList>
          {children.map((child, i) => (<MenuItem key={i}>
          {child}</MenuItem>))}
        </MenuList>
      </Menu>)
}