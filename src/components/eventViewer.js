import React, { Component } from 'react';
import moment from 'moment';
import EventService from '../services/event.service';

export default class EventViewerComponent extends Component {
    constructor(props) {
        super();
        this.eventService = new EventService();
        this.state = {
            eventList: [],
            dropdownOptions: {
                '18bad24aaa': 'GHSA',
                '542bc38f95': 'UIL'
            },
            currentDateRange: {
                start: '',
                end: ''
            },
            currentDropdownSelection: '',
            error: ''
        }
    }

    componentDidMount() {
        this.getEvents();
    }

    async getEvents() {
        const events = await this.eventService.fetchEventData('', '', '', '');
        if (!events) {
            this.setState({ eventList: [], error: 'Could not retrieve upcoming event data.' });
        } else {
            this.setState({ eventList: events, error: '' });
        }
    }

    render() {
        return (
            <section className='event-viewer'>
                <div className='filters'>
                    <AssocDropdown {...this.state} />
                    <DatePicker {...this.state} />
                </div>
                <Table {...this.state} />
            </section>
        );
    }
}

const AssocDropdown = (props) => {
    const selectOptions = (options) => {
        return Object.entries(options).map((entry) => {
            return (
                <option value={entry[0]}>{entry[1]}</option>
            );
        });

    };


    return (
        <>
            <label for="assocDropdown"></label>
            <select name="assocDropdown" id="assocDropdown">
                <option value=''>Select an Association</option>
                {selectOptions(props.dropdownOptions)}
            </select>
        </>
    );
};

const DatePicker = (props) => {
    return (
        <div className='date-picker'>
            <input id='start-time' type="date"></input>
            <input id='end-time' type="date"></input>
        </div>
    );
}

const Table = (props) => {
    const populateTable = (eventList) => {
        return eventList.map(item => {
            const { key, headline, subheadline, start_time } = item;
            // convert to pretty time using moment
            const pretty_start_time = moment(start_time).format('MMMM Do YYYY, h:mm a');
            return (
                <tr key={key}>
                    <td>{key}</td>
                    <td>{headline}</td>
                    <td>{subheadline}</td>
                    <td>{pretty_start_time}</td>
                </tr>
            );
        });
    }

    return (
        <table id='events'>
            <tbody>
                <tr>
                    <th key='key'>Key</th>
                    <th key='headline'>Headline</th>
                    <th key='subheadline'>SubHeadline</th>
                    <th key='start_time'>Start Time</th>
                </tr>
                {populateTable(props.eventList)}
            </tbody>
        </table>
    );
}
