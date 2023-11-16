import React from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { MainPage, ResultPage } from "../pages";

const links = ["/", "/results"];

const pathElements = {
    "/": MainPage,
    "/results": ResultPage,
}

export const MyRouter = ({ children, ...props }) => {
    return (<BrowserRouter {...props}>
            { children }
            <Routes>
                {links.map((link) => {
                    const PageElement = pathElements[link];
                    return (
                        <Route key={link} path={link} element={<PageElement />} />);
                })}
            </Routes>
    </BrowserRouter>)
}

MyRouter.propTypes = BrowserRouter.propTypes;
