import React, {Component} from 'react';

export default class EventViewerComponent extends Component {

    render() {
        return(
            <section className='event-viewer'>
                <div className='filters'>
                    <AssocDropdown />
                    <DatePicker />
                </div>
                <Table />
            </section>
        );
    }
}

const AssocDropdown = (props) => {
    return(
        <div className='assoc-Dropdown'>Dropdown</div>
    );
};

const DatePicker = (props) => {
    return(
        <div className='date-picker'>DatePicker</div>
    );
}

const Table = (props) => {
    return(
        <table></table>
    );
}
