import React from "react";
import { Link } from "react-router-dom";

const Home: React.FC = () => {
    return <>
        <h1>Welcome to the Home Page</h1>
        <Link to="/dashboard">Dashboard</Link>
        <Link to="/login">Login</Link>
    </>;
};

export default Home;
