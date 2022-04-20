import React from 'react';

export default class GlobalFooter extends React.Component {
    constructor(props) {
        super(props);
    }

    render() {
        return (
          <footer className="text-center fixed-bottom mb-3 pt-3 pl-0 small d-none d-sm-inline-block">
            {/* Copyright */}
            © 2022 WebProjects
          </footer>
        );
    }
}
