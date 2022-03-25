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
import {PoseAnimator} from "../../api/pose-animator/1camera";

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
    const [value, setValue] = React.useState(0);
    const [bottomNav, setBottomNav] = React.useState(0);

    const handleChange = (event, newValue) => {
        setValue(newValue);
    };

    const handleChangeIndex = (index) => {
        setValue(index);
    };
    const videoRef = createRef();
    const canvasRef = createRef();
    // const userMediaToVideo = async () => {
    //     const stream = await navigator.mediaDevices.getUserMedia({
    //         video: true
    //     });
    //     const video = videoRef.current;
    //     video.srcObject = stream;
    // }
    const loadAnimator = async () => {
        const animator = new PoseAnimator({
            Canvas: canvasRef.current,
            MediaStream: await navigator.mediaDevices.getUserMedia({
                'audio': false,
                'video': {
                    facingMode: 'user',
                    width: 200,
                    height: 200,
                },
            }),
            Video: videoRef.current,
            VideoCanvas: document.querySelector(".camera-canvas-output"),
            SVG: "https://raw.githubusercontent.com/yemount/pose-animator/master/resources/illustration/boy.svg"
        });
        await animator.Build();
        const _ = async () => {
            // console.log("F")
            const poses = await animator.DetectFrame();
            await animator.DrawFrame({poses: poses[0]})
            requestAnimationFrame(_)
        }
        await _()
        // console.log()
    }
    useEffect(() => {
        if (value === 0) {
            // userMediaToVideo();
            if (canvasRef && videoRef) loadAnimator();
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
                    <div style={{
                        width: "100vw",
                        height: "100vh"
                    }}>
                        <canvas style={{
                            width: "100vw",
                            height: "100vh",
                            objectFit: "cover"
                        }} ref={canvasRef} className="camera-canvas" id="output"/>
                        <video autoPlay={true} ref={videoRef} style={{
                            width: "4rem",
                            height: "6rem",
                            position: "fixed",
                            bottom: "0.5rem",
                            right: "3rem"
                            // objectFit: "cover"
                        }}/>
                    </div>
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
