import React, {lazy, Suspense} from 'react';

const LazyTabs = lazy(() => import('./Tabs'));

const Tabs = props => (
    <Suspense fallback={null}>
        <LazyTabs {...props} />
    </Suspense>
);

export default Tabs;
