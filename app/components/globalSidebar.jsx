import React from 'react';

import GlobalFooter from './globalFooter.jsx';
import GlobalSidebarLink from './globalSidebar_links.jsx';

export default class GlobalSidebar extends React.Component {
    constructor(props) {
        super(props);
    }

    render() {
        return (
          <div id="globalSidebar" className="side-nav fixed light-green navbar-dark white-text">

            {/* Dashboard Branding */}
            <a href="/" className="navbar-brand text-center">
              <img src="/resources/LogoSphere_white_sphere_small.png" alt="Sphere Logo" />
            </a>

            {/*
                    Sidebar Link

                    TODO: These will be reworked and made to be more consistent with
                    a better layout and menu system to consolidate items appropriately.
                */}
            <ul id="globalSidebarLinks" className="mt-2 pt-2 custom-scrollbar">
              <GlobalSidebarLink name="Home" URL="/" iconName="fa-chart-bar" />
              <GlobalSidebarLink name="All Devices" URL="/api/devices/get-all-devices" iconName="fa-star" />
              <GlobalSidebarLink name="Activity Monitor" URL="#" iconName="fa-star" />
              <GlobalSidebarLink name="Splunk Analyzer" URL="#" iconName="fa-star" />
              <GlobalSidebarLink name="Azure Analyzer" URL="#" iconName="fa-list" />
              <GlobalSidebarLink name="System Analyzer" URL="#" iconName="fa-list" />
              <GlobalSidebarLink name="Diagnostic Analyzer" URL="#" iconName="fa-laptop" />
              <GlobalSidebarLink name="System Tools" URL="#" iconName="fa-cogs" />
              <GlobalSidebarLink name="Help" URL="#" iconName="fa-bullhorn" />
            </ul>

            <GlobalFooter />
          </div>
        );
    }
}
