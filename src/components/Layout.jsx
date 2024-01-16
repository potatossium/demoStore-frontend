import {React, useState} from "react";
//import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import { HashRouter as Router, Routes, Route, Link } from "react-router-dom";
import { Menu, Container } from "semantic-ui-react";
import Customers from "./Customers";
import Products from "./Products";
import Sales from "./Sales";
import Stores from "./Stores";
import HomePage from "./HomePage";

function Layout() {
    const [activeItem, setActiveItem] = useState('home');
    const handleItemClick = (e, { name }) => setActiveItem({ activeItem: name })

    return (
        <>
            <Router>
                <div className="Layout">
                    <Menu inverted>
                    <Menu.Item as={Link} to="/">
                        React
                    </Menu.Item>
                    <Menu.Item as={Link} to="/customers">
                        Customers
                    </Menu.Item>
                    <Menu.Item as={Link} to="/products">
                        Products
                    </Menu.Item>
                    <Menu.Item as={Link} to="/stores">
                        Stores
                    </Menu.Item>
                    <Menu.Item as={Link} to="/sales">
                        Sales
                    </Menu.Item>
                    </Menu>
                    <Routes>
                        <Route path="/" element={<HomePage />} />
                        <Route path="/customers" element={<Customers />} />
                        <Route path="/products" element={<Products />} />
                        <Route path="/stores" element={<Stores />}  />
                        <Route path="/sales" element={<Sales />} />
                    </Routes>
                </div>
            </Router>
        </>
    );
}

export default Layout;
