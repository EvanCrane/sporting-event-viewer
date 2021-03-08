import React, { Component } from 'react';
import moment from 'moment';
import EventService from '../services/event.service';
import './eventViewer.css';

/**
 * Main component class for displaying the upcoming events 
 */
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
            // Setting to 25 for usability purposes
            currentSize: 25,
            error: '',
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

    /**
     * Fetches event data and updates the state. If null returns update state to show error on screen
     */
    getEvents = async () => {
        const { currentAssocKey, currentDateRange, currentSize, eventList } = this.state;
        const events =
            await this.eventService.fetchEventData(currentAssocKey, currentDateRange.start, currentDateRange.end, currentSize, eventList);
        if (!events) {
            this.setState({ eventList: [], error: 'Could not retrieve upcoming event data.', updateTable: false });
        } else {
            this.setState({ eventList: events, error: '', updateTable: false });
        }
    }

    /**
     * Called from the AssocDropdown component to update state for association and table
     * @param {string} value 
     */
    updateAssoc = async (value) => {
        this.setState({ currentAssocKey: value, updateTable: true });
    }

    /**
     * Called from the DatePicker component to update start date and table
     * @param {string} date 
     */
    updateStartDate = async (date) => {
        date = moment(date).utc().format();
        this.setState(prevState => ({ currentDateRange: { ...prevState.currentDateRange, start: date,  }, updateTable: true }));
    }

    /**
     * Called from the DatePicket component to update start date and table
     * @param {string} date 
     */
    updateEndDate = async (date) => {
        date = moment(date).utc().format();
        this.setState(prevState => ({ currentDateRange: { ...prevState.currentDateRange, end: date }, updateTable: true }));
    }

    render() {
        return (
            <>
                { this.state.error !== '' &&
                    <ErrorMessage {...this.state} />
                }
                <section className='container-fluid event-viewer'>

                    <div className='row filters'>
                        <AssocDropdown updateAssoc={this.updateAssoc} {...this.state} />
                        <DatePicker updateStartDate={this.updateStartDate} updateEndDate={this.updateEndDate} {...this.state} />
                    </div>
                    <Table {...this.state} />
                </section>
            </>
        );
    }
}


/**
 * Association Dropdown Component
 * @param {*} props 
 * @returns 
 */
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
            <div className="col-4 col-md-auto col-lg-auto">
                <label htmlFor="assocDropdown">State Association</label>
            </div>
            <div className="col-8 col-md-auto col-lg-auto">
                <select onChange={handleChange} name="assocDropdown" id="assocDropdown">
                    <option key='' value=''>Select an Association: </option>
                    {selectOptions(props.dropdownOptions)}
                </select>
            </div>
        </>
    );
};

/**
 * DatePickers Selection Component
 * @param {*} props 
 * @returns 
 */
const DatePicker = (props) => {
    const onStartChange = (e) => { props.updateStartDate(e.target.value) };
    const onEndChange = (e) => { props.updateEndDate(e.target.value) };
    return (
        <>
            <div className='col-4 col-md-auto col-lg-auto'>
                <label htmlFor='start-time'>Start Date: </label>
            </div>
            <div className='col-8 col-md-auto col-lg-auto'>
                <input onChange={onStartChange} id='start-time' type="date"></input>
            </div>
            <div className='col-4 col-md-auto col-lg-auto'>
                <label htmlFor='end-time'>End Date: </label>
            </div>
            <div className='col-8 col-md-auto col-lg-auto'>
                <input onChange={onEndChange} id='end-time' type="date"></input>
            </div>
        </>
    );
}

/**
 * Table Component
 * @param {*} props 
 * @returns 
 */
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
        <div className="table-responsive">
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
        </div>
    );
}

/**
 * Error Message Component
 */
const ErrorMessage = (props) => {
    return (
        <div className="error-msg">
            <h5>{props.error}</h5>
        </div>
    );
}
