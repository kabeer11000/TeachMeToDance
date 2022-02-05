import React from 'react';
import SwipeableViews from 'react-swipeable-views';
import {ReelContext} from "../../Contexts";
import {ButtonBase, CircularProgress} from "@mui/material";
// import {virtualize} from 'react-swipeable-views-utils';
// import {SwipeableViewsContext} from "react-swipeable-views/src";

// class SwipeableViews extends _SwipeableViews {
//     constructor(...a) {
// a[0] = {...a[0], axis: "y"}
// super(...a);
// console.log(this.props)
// this.props = {...this.props, axis: "y", resistance: true, containerStyle: {height: "50vh"}};
// console.log(this.props)
// this.props.resistance = true;
// this.props.containerStyle = {height: "50vh"};
// }
// }

// const VirtualizeSwipeableViews = virtualize(SwipeableViews, {
//     axis: "y",
//     resistance: true,
//     containerStyle: {height: "50vh"}
// });

const slideRenderer = ({key, index}) => (
    <div key={key} style={{
        backgroundColor: "blue",
        height: "100%"
    }}>
        {`slide n°${index + 1}`}
    </div>
);
const SwipeableViewsWrapper = ({children, ...props}) => {
    // const [_children, _update_children] = React.useState([]);
    return (
        <SwipeableViews {...props} style={{overflow: "hidden"}} resistance containerStyle={{height: "100vh"}}
                        axis={"y"}>
            {children}
        </SwipeableViews>
    )
}
/**
 * Keep an array of items
 * Request next when user scrolls
 * then append a new property previous to create relation to previous video
 * push it to the array
 * keep array a fixed length long i.e remove n previous item details from rendering but keep then in memory
 * readd them to the array if user scrolls up so much
 *
 *
 *
 *
 *
 *
 *
 * @returns {JSX.Element}
 * @constructor
 */
const Video = ({item}) => {
    return (
        <ButtonBase style={{
            height: "100vh", width: "100vw"
        }}>
            <img src={item.image} style={{
                height: "100vh", width: "100vw"
            }} alt={"::"}/>
        </ButtonBase>
    )
}
const MyComponent = () => {
    // Create a detector.
    const {ReelUtils} = React.useContext(ReelContext);
    // React.useEffect(() => {
    //     // ReelUtils.Request.next()
    // },[]);
    const [index, setIndex] = React.useState(0);
    return (
        <SwipeableViews style={{overflow: "hidden"}} resistance containerStyle={{height: "100vh"}}
                        axis={"y"} index={index} onChangeIndex={async (index, latestIndex, metaData) => {
            console.log("Index Changed");
            if (index >= ReelUtils.Items.items.length) await ReelUtils.Request.next({
                thisIndex: latestIndex,
                newIndex: index
            });
            else setIndex(index)
        }}>
            {ReelUtils.Items.items?.map((item, index) => <Video key={index} item={item}/>)}
            <div><CircularProgress/></div>


            {/*{ReelUtils.History.history?.map((item, index) => <img src={item.contents.author.avatarLarger} style={{*/}
            {/*    height: "100vh", width: "100vw"*/}
            {/*}}/>)}*/}
            {/*{Reel ? <img src={Reel.contents.author.avatarLarger} style={{*/}
            {/*    height: "100vh", width: "100vw"*/}
            {/*}}/> : <div/>}*/}
            {/*<div/>*/}
            {/*{[...new Array(3)].map((_, index) => <img src={"http://localhost:3001/img/" + index} style={{*/}
            {/*    height: "100vh", width: "100vw"*/}
            {/*}}/>)}*/}
        </SwipeableViews>
    );
}

export default MyComponent;
