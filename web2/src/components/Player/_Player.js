import React from 'react';
import './Player.css';
import {ReelContext} from "../../Contexts";
import SwipeableViews from "react-swipeable-views";

const NextReel = ({id, poster}) => (
    <div style={{
        width: "100vw",
        height: "100vh",
        position: "relative",
        overflow: "hidden",
        backgroundImage: poster || "https://thumbs.dreamstime.com/z/white-neon-vertical-frame-glowing-tiles-background-leaves-shadow-overlay-pink-holographic-surreal-backdrop-social-media-171377517.jpg"
    }}/>
)
const Loader = ({index}) => {
    // INdex would be the whole next video thing ,and useeffect will be used to load
    const [show, setShow] = React.useState(false);
    return (
        <div>
            <div className={"video__wrapper"} hidden={show}>
                <img
                    onLoadedData={() => setShow(true)}
                    style={{
                        width: "100vw",
                        height: "100vh",
                        // position: "absolute",
                        overflow: "hidden",
                        margin: 0, padding: 0,
                    }} src={`http://localhost:3001/img/${index}`}/>
                <div style={{
                    minWidth: "100vw",
                    minHeight: "100vh",
                    height: "100%",
                    width: "100%",
                    opacity: "50%",
                    backgroundColor: "green",
                    top: 0,
                    left: 0,
                    position: "absolute",
                    display: "inline-flex",
                    flexDirection: "column"
                }}>
                    <div style={{
                        width: "100vw",
                        height: "50vh",
                        opacity: "50%",
                        backgroundColor: "red",
                        // position: "absolute"
                    }}/>
                    <div style={{
                        width: "100vw",
                        height: "50vh",
                        opacity: "50%",
                        backgroundColor: "blue",
                        // position: "absolute"
                    }}/>
                </div>
            </div>
            <div hidden={!show} style={{
                minWidth: "100vw",
                minHeight: "100vh",
                height: "100%",
                width: "100%",
                backgroundColor: "#fff",
            }}>
                Loading
            </div>
        </div>
    )
}
const Player = () => {
    const {Reel, ReelUtils} = React.useContext(ReelContext);
    const [transition, setTransition] = React.useState({
        direction: "left"
    });
    const [index, setIndex] = React.useState({
        i: 0,
        // visible: [0]
    });
    // const handlers = useSwipeable({
    //     onSwiped: (eventData) => console.log("User Swiped!", eventData)
    // });
    return (
        <div className="_Player" data-testid="Player">
            <SwipeableViews onChangeIndex={async (_index, _indexNew) => setIndex({i: _index})}
                            style={{overflow: "hidden"}} resistance containerStyle={{height: "100vh"}} axis={"y"}>
                <Loader index={index.i}/>

            </SwipeableViews>
        </div>
    );
}

Player.propTypes = {};

Player.defaultProps = {};

export default Player;
