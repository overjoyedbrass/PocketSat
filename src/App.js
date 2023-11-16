import React from "react";
import { Provider } from "react-redux";
import { store } from "./store/store.js";
import { MyRouter } from "./router/router.js";

const App = () => {
    return (<Provider store={store}>
        <MyRouter />
    </Provider>)
}

export default App;