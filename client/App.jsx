import React, { Component } from "react";
import Search from "./components/Answers.jsx";
import SearchAnswer from "./components/SearchAnswer.jsx";

export default class App extends Component {
  render() {
    return (
      <div>
        <Search />
        <SearchAnswer />
      </div>
    );
  }
}
