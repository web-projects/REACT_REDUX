import React from 'react';

export default class ProgressLoader extends React.Component {
    constructor(props) {
        super(props);
    }

    render() {
        let element = null;
        if (this.props.isLoading && !this.props.isError) {
            element = (
                <div className="container center-all">
                    <div className="row justify-content-center">
                        <div className="col-4">
                            <div className="progress">
                                <div className="intermediate"></div>
                            </div>
                        </div>
                    </div>
                </div>
            );
        }

        return (
            <div>
                {element}
            </div>
        );
    }
}
