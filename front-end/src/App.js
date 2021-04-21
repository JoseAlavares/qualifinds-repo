import React, { Fragment } from 'react';
import { BrowserRouter } from 'react-router-dom';
import Router from './config/Router';
import { RecoilRoot } from 'recoil';

//Styles
import '@fortawesome/fontawesome-free/css/all.min.css'; 
import 'bootstrap-css-only/css/bootstrap.min.css'; 
import 'mdbreact/dist/css/mdb.css';

const Loading = (<p>Loading...</p>)

function App() {
    return (
        <RecoilRoot>
            <React.Suspense fallback={() => <Loading/>}>
                <BrowserRouter>
                    <Router/>            
                </BrowserRouter>
            </React.Suspense>
        </RecoilRoot>
    );
}

export default App;
