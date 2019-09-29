import React from "react";
import Home from "../components/Home";
import {recentlyPlayed, madeForYou, recommendedForYou} from "../data/home";

const HomeScreen = () => {
  return <Home data={{madeForYou, recentlyPlayed, recommendedForYou}}></Home>;
};

export default HomeScreen;
