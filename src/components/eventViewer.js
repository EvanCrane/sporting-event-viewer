import React, { Component } from 'react';
import moment from 'moment';
import EventService from '../services/event.service';
import './eventViewer.css';

export default class EventViewerComponent extends Component {
    constructor() {
        super();
        this.eventService = new EventService();
        this.state = {
            currentAssocKey: '',
            eventList: [],
            dropdownOptions: {
                '18bad24aaa': 'GHSA',
                '542bc38f95': 'UIL'
            },
            currentDateRange: {
                start: '',
                end: ''
            },
            currentSize: 50,
            error: 'YEET',
            updateTable: false
        }
    }

    componentDidMount() {
        this.getEvents();
    }

    componentDidUpdate() {
        if (this.state.updateTable) {
            this.getEvents();
        }
    }

    getEvents = async () => {
        const { currentAssocKey, currentDateRange, currentSize } = this.state;
        const events =
            await this.eventService.fetchEventData(currentAssocKey, currentDateRange.start, currentDateRange.end, currentSize);
        if (!events) {
            this.setState({ eventList: [], error: 'Could not retrieve upcoming event data.', updateTable: false });
        } else {
            this.setState({ eventList: events, error: '', updateTable: false });
        }
    }

    updateAssoc = async (value) => {
        this.setState({ currentAssocKey: value, updateTable: true });
    }

    updateStartDate = async (date) => {
        date = moment(date).utc().format();
        this.setState({ currentDateRange: { start: date }, updateTable: true });
    }

    updateEndDate = async (date) => {
        date = moment(date).utc().format();
        this.setState({ currentDateRange: { end: date }, updateTable: true });
    }

    render() {
        return (
            <section className='event-viewer'>
                <ErrorMessage {...this.state} />
                <div className='row filters'>
                    <AssocDropdown updateAssoc={this.updateAssoc} {...this.state} />
                    <DatePicker updateStartDate={this.updateStartDate} updateEndDate={this.updateEndDate} {...this.state} />
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
                <option key={entry} value={entry[0]}>{entry[1]}</option>
            );
        });
    };

    const handleChange = (e) => { props.updateAssoc(e.target.value) };

    return (
        <>
            <div className="col-auto">
                <label htmlFor="assocDropdown">State Association</label>
            </div>
            <div className="col-auto">
                <select onChange={handleChange} name="assocDropdown" id="assocDropdown">
                    <option key='' value=''>Select an Association: </option>
                    {selectOptions(props.dropdownOptions)}
                </select>
            </div>
        </>
    );
};

const DatePicker = (props) => {
    const onStartChange = (e) => { props.updateStartDate(e.target.value) };
    const onEndChange = (e) => { props.updateEndDate(e.target.value) };
    return (
        <>
            <div className='col-auto'>
                <label htmlFor='start-time'>Start Time: </label>
            </div>
            <div className='col-auto'>
                <input onChange={onStartChange} id='start-time' type="date"></input>
            </div>
            <div className='col-auto'>
                <label htmlFor='end-time'>End Time: </label>
            </div>
            <div className='col-auto'>
                <input onChange={onEndChange} id='end-time' type="date"></input>
            </div>
        </>
    );
}

const Table = (props) => {
    const populateTable = (eventList) => {
        return eventList.map(item => {
            const { key, headline, subheadline, start_time } = item;
            // convert to pretty time using moment
            const pretty_start_time = moment(start_time).format('MMMM Do YYYY, h:mm');
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
        <table className="table" id='events'>
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

const ErrorMessage = (props) => {
    return (
        <div className="error-msg">
            <h5>Test Error</h5>
        </div>
    );
}
