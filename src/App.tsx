import React from "react";
import { Provider } from "react-redux";
import { initStore } from "./store/utils";
import "./App.css";
import { MainPage } from "./components/MainPage";

const App: React.FC = () => {
  const store = initStore();
  return (
    <Provider store={store}>
      <MainPage/>
    </Provider>
  );
};

export default App;
