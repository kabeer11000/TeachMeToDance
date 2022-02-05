import React from "react";

function getRandomizer(bottom, top) {
    return function () {
        return Math.floor(Math.random() * (1 + top - bottom)) + bottom;
    }
}

export const ReelContext = React.createContext(null);
export const ReelProvider = ({children}) => {
    // const [state, setState] = React.useState(null);
    const [items, setItems] = React.useState([]);
    const ReelUtils = {
        Items: {
            push: async (state/*id*/) => {
                setItems([...items, state]);
                console.log(items.map(a => a.image))
            },
            items: items,
            last: () => items[items.length - 1]
        },
        Request: {
            indexed: async (index) => {
                return items[index]
            },
            next: async ({thisIndex: index}) => {
                const next = await fetch("http://localhost:3001/img/" + items[index].next).then(res => res.json())
                await ReelUtils.Items.push(next);
                console.log("Requesting next")
            }
        }
    };
    React.useEffect(() => {
        fetch("http://localhost:3001/img").then((r) => r.json()).then(ReelUtils.Items.push);
    }, [])
    return (<ReelContext.Provider value={{
        ReelUtils: ReelUtils
    }}>{children}</ReelContext.Provider>)
}


export const FullScreenContext = React.createContext(false);
export const FullScreenProvider = React.memo(({children}) => {
    const [state, setState] = React.useState(false);
    const setFullScreen = async (state) => {
        if (state && !document.fullscreenElement) return document.documentElement.requestFullscreen();
        if (!state && document.exitFullscreen) return document.exitFullscreen();
    }
    return <FullScreenContext.Provider value={[state, async () => {
        await setFullScreen(state);
        setState(!state)
    }]}>{children}</FullScreenContext.Provider>;
});
