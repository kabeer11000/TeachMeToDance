import './App.css';
import {Avatar, BottomNavigation, BottomNavigationAction, CssBaseline, Fab, Grow, Paper,} from "@mui/material";
// import Player from "./components/Player/Player.lazy";
import {ReelProvider} from "./Contexts";
// import io from "socket.io-client";
import Tabs from "./components/Tabs/Tabs.lazy";
import * as React from "react";
import {Fragment, useState} from "react";
import {BrowserRouter as Router, Link, Route} from "react-router-dom";
import {Add, Groups, Home} from "@mui/icons-material";
import styled from "@emotion/styled";


const StyledFab = styled(Fab)({
    position: 'absolute',
    zIndex: 1,
    top: -30,
    left: 0,
    right: 0,
    margin: '0 auto',
});
// io("http://localhost:3001")
const App = () => {
    const [value, setValue] = useState(0);
    return (
        <Router>
            {/*<Switch>*/}
            <Fragment>
                <CssBaseline/>

                <Route path={"/create/animation/new"}>
                    <div></div>
                </Route>
                <ReelProvider>
                    <Route path={"/"}>
                        <Tabs/>
                        <Grow unmountOnExit={true} in={true}>
                            <Paper sx={{zIndex: 2, position: 'fixed', bottom: 0, left: 0, right: 0}} elevation={3}>
                                <BottomNavigation
                                    // showLabels={true}
                                    value={value}
                                    onChange={(event, newValue) => {
                                        setValue(newValue);
                                    }}
                                >
                                    <BottomNavigationAction to={"/"} component={Link} label="Home" icon={<Home/>}/>
                                    <BottomNavigationAction to={"/party"} component={Link} label="Party"
                                                            icon={<Groups/>}/>
                                    <StyledFab color="secondary" aria-label="add">
                                        <Add/>
                                    </StyledFab>
                                    {/*<BottomNavigationAction label="Create" icon={<Create/>}/>*/}
                                    {/*<BottomNavigationAction label="Create" icon={<Home/>}/>*/}
                                    <BottomNavigationAction label="Profile"
                                                            icon={<div style={{width: 24, height: 24}}><Avatar
                                                                sx={{width: "100%", height: "100%"}}>KN</Avatar>
                                                            </div>}/>
                                </BottomNavigation>
                            </Paper>
                        </Grow>
                    </Route>
                    {/*<Container></Container>*/}
                </ReelProvider>
            </Fragment>
            {/*</Switch>*/}
        </Router>
    );
}


export default App;
