import * as React from 'react';
import {createRef, useEffect} from 'react';
import PropTypes from 'prop-types';
import SwipeableViews from 'react-swipeable-views';
import {useTheme} from '@mui/material/styles';
import Box from '@mui/material/Box';
import Player from "../Player/Player.lazy";
import {Route} from "react-router-dom";
import {Fab} from "@mui/material";
import styled from "@emotion/styled";

function TabPanel(props) {
    const {children, value, index, ...other} = props;

    return (
        <div
            role="tabpanel"
            hidden={value !== index}
            id={`full-width-tabpanel-${index}`}
            aria-labelledby={`full-width-tab-${index}`}
            {...other}
        >
            {value === index && (
                <Box sx={{p: 0, m: 0}}>
                    {children}
                    {/*<Typography>{children}</Typography>*/}
                </Box>
            )}
        </div>
    );
}

TabPanel.propTypes = {
    children: PropTypes.node,
    index: PropTypes.number.isRequired,
    value: PropTypes.number.isRequired,
};

function a11yProps(index) {
    return {
        id: `full-width-tab-${index}`,
        'aria-controls': `full-width-tabpanel-${index}`,
    };
}


const StyledFab = styled(Fab)({
    position: 'absolute',
    zIndex: 1,
    top: -30,
    left: 0,
    right: 0,
    margin: '0 auto',
});
export default function AppTabbedLayout() {
    const theme = useTheme();
    const [value, setValue] = React.useState(1);
    const [bottomNav, setBottomNav] = React.useState(0);

    const handleChange = (event, newValue) => {
        setValue(newValue);
    };

    const handleChangeIndex = (index) => {
        setValue(index);
    };
    const videoRef = createRef();
    const userMediaToVideo = async () => {
        const stream = await navigator.mediaDevices.getUserMedia({
            video: true
        });
        const video = videoRef.current;
        video.srcObject = stream;
    }
    useEffect(() => {
        if (value === 0) {
            userMediaToVideo();
        }
    }, [value]);

    return (
        <Box sx={{bgcolor: 'background.paper'}}>
            {/*<AppBar position="static">
                <Tabs
                    value={value}
                    onChange={handleChange}
                    indicatorColor="secondary"
                    textColor="inherit"
                    variant="fullWidth"
                    aria-label="full width tabs example"
                >
                    <Tab label="Item One" {...a11yProps(0)} />
                    <Tab label="Item Two" {...a11yProps(1)} />
                    <Tab label="Item Three" {...a11yProps(2)} />
                </Tabs>
            </AppBar>*/}
            <SwipeableViews
                axis={theme.direction === 'rtl' ? 'x-reverse' : 'x'}
                index={value}
                onChangeIndex={handleChangeIndex}
            >
                <TabPanel value={value} index={0} dir={theme.direction}>
                    <video autoPlay={true} ref={videoRef} style={{
                        width: "100vw",
                        height: "100vh",
                        objectFit: "cover"
                    }}/>
                </TabPanel>
                <TabPanel value={value} index={1} dir={theme.direction}>
                    {/*<Routes>*/}
                    {/*<Route exact path={["/", "/party"]}>*/}
                    {/*</Route>*/}
                    <Route exact path={"/"} component={Player}/>
                    <Route path={"/party"}>
                        <React.Fragment>Party</React.Fragment>
                    </Route>
                    {/*</Routes>*/}
                </TabPanel>
            </SwipeableViews>

        </Box>
    );
}
