import React from 'react';

export default class EventSinkListenerComponent extends React.Component {
    constructor(props) {
        super(props);
    }

    onEventProcedure(e) {
        /* virtual */
    }

    onQueryProcedure(e) {
        /* virtual */
    }

    getKey() {
        return null;
    }

    render() {
        /* virtual */
        return (
          <p>HERE!</p>
        );
    }
}
