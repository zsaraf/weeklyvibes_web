import React from 'react';
import { Link } from 'react-router';
import $ from 'jquery';
import moment from 'moment-timezone';

class DatePicker extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            showingFull: false
        };
    }

    showFullPicker() {
        var scrollHeight = $('.date-picker')[0].scrollHeight;
        var toHeight = Math.min($(document).height() / 2, scrollHeight);
        $('.date-picker').stop(true);
        $('.date-picker').animate({ height: toHeight + 'px' }, 200);
    }

    hideFullPicker() {
        $('.date-picker').stop(true);
        $('.date-picker').animate({ height: '45px' }, 200, function () {
            $('.date-picker').animate({ scrollTop: 0 }, 'fast');
        });
    }

    componentDidMount() {
        var _react = this;
        $('.date-picker').mouseenter(function () {
            _react.showFullPicker();
        });

        $('.date-picker').mouseleave(function () {
            _react.hideFullPicker();
        });
    }

    shouldComponentUpdate(nextProps, nextState) {
        return nextProps.loading;
    }

    render() {
        var today = moment.tz(new Date(), 'America/Los_Angeles');
        var firstDate = moment.tz('2016-03-09 00:00', 'America/Los_Angeles');
        var dates = [];
        var count = 0;

        while (true) {
            var classes = 'date';
            if (count == 0) {
                classes += ' first';
                var currentDateMoment = moment.tz(this.props.currentDate, 'America/Los_Angeles');
                if (currentDateMoment.diff(today, 'days') == 0) {
                    dates.push(<div className={classes} key={count}>Today</div>);
                    today = today.subtract(1, 'days');
                } else {
                    dates.push(<div className={classes} key={count}>{currentDateMoment.format('MMM DD')}</div>);
                }

                count++;
                continue;
            } else if (today.diff(firstDate, 'days') == 0) {
                classes += ' last';
            }

            if (count == 1) {
                dates.push(<div className='divider' key={count}></div>);
                count++;
                continue;
            }

            if (today.format('YYYY-MM-DD') == this.props.currentDate) {
                classes += ' selected';
            }

            var toLocation = '/d/' + today.format('YYYY-MM-DD');
            var dateText = today.format('MMM DD');
            if (count == 2 && today.diff(moment.tz(new Date(), 'America/Los_Angeles'), 'days') == 0) {
                dateText = 'Today';
            }

            dates.push(
                <div className={classes} key={count}><Link to={toLocation}>{dateText}</Link></div>
            );

            today = today.subtract(1, 'days');
            count++;
            if (today.diff(firstDate) < 0) {
                break;
            }
        }

        return (
            <div className='date-picker'>
                {dates}
            </div>
        );
    }
}

export default DatePicker;
