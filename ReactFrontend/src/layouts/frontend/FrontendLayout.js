/** 3 */
import React from 'react';
import { Route, Switch } from 'react-router-dom';
import FrontendRouteList from '../../routes/FrontendRouteList';
import Navbar from './include/Navbar';
import Footer from './include/Footer';



const FrontendLayout = () => {
    return (
        <>
            <div>
                {/**==========NavBar============= */}
                <Navbar />
                <div>
                    <Switch>
                        {FrontendRouteList.map((route, index) => {
                            return (
                                route.component && (
                                    <Route
                                        key={index}
                                        path={route.path}
                                        exact={route.exact}
                                        name={route.name}
                                        render={(props) => (
                                            <route.component {...props} />
                                        )}
                                    />
                                )
                            )
                        })}

                    </Switch>
                </div>
            </div>
            <Footer />
        </>
    )
}

export default FrontendLayout

