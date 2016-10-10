'use strict';

import React from 'react';
import Modal from 'react-modal';
import moment from 'moment-timezone';
import { Popover, Overlay } from 'react-bootstrap';

class QuestionMark extends React.Component {
    render() {
        return (
            <svg {...this.props} className="question-mark" xmlns="http://www.w3.org/2000/svg" width="23" height="23" viewBox="0 0 23 23" xmlnsXlink="http://www.w3.org/1999/xlink">
              <g fill="none" fill-rule="evenodd">
                <path fill="#737373" d="M14.7371542,8.76679842 C14.7371542,9.07114777 14.7002639,9.33860227 14.6264822,9.56916996 C14.5527006,9.79973765 14.4489467,10.0118567 14.3152174,10.2055336 C14.1814881,10.3992105 14.0200932,10.5813562 13.8310277,10.7519763 C13.6419622,10.9225964 13.4275374,11.1001308 13.187747,11.284585 C13.0401837,11.4044802 12.9179847,11.5105397 12.8211462,11.6027668 C12.7243078,11.6949939 12.6482216,11.7895252 12.5928854,11.8863636 C12.5375491,11.9832021 12.4983532,12.0846503 12.4752964,12.1907115 C12.4522397,12.2967726 12.4407115,12.4235829 12.4407115,12.5711462 L12.4407115,12.93083 L10.2826087,12.93083 L10.2826087,12.4051383 C10.2826087,12.1653479 10.3056651,11.9509232 10.3517787,11.7618577 C10.3978922,11.5727922 10.4670615,11.399869 10.5592885,11.243083 C10.6515156,11.086297 10.7644921,10.9341246 10.8982213,10.7865613 C11.0319506,10.6389979 11.1910399,10.4868256 11.3754941,10.3300395 L11.8320158,9.90118577 C11.9888018,9.76284516 12.1225291,9.61758969 12.2332016,9.46541502 C12.3438741,9.31324035 12.3992095,9.1310946 12.3992095,8.91897233 C12.3992095,8.62384569 12.3092894,8.38867018 12.1294466,8.21343874 C11.9496038,8.03820729 11.7029001,7.95059289 11.3893281,7.95059289 C11.0019743,7.95059289 10.7114634,8.0820145 10.5177866,8.34486166 C10.3241097,8.60770882 10.2180502,8.90513668 10.1996047,9.23715415 L8,9.00197628 C8.05533625,8.50395008 8.18214657,8.06587804 8.38043478,7.68774704 C8.57872299,7.30961603 8.83464929,6.99604868 9.14822134,6.74703557 C9.4617934,6.49802247 9.81686231,6.31126544 10.2134387,6.18675889 C10.6100152,6.06225234 11.0296421,6 11.472332,6 C11.8873539,6 12.2908413,6.05302977 12.6828063,6.15909091 C13.0747714,6.26515205 13.4229234,6.43115829 13.7272727,6.65711462 C14.0316221,6.88307096 14.2760202,7.17127625 14.4604743,7.52173913 C14.6449285,7.87220202 14.7371542,8.28721763 14.7371542,8.76679842 L14.7371542,8.76679842 Z M12.7173913,14.8814229 C12.7173913,15.2503312 12.5882753,15.5615929 12.3300395,15.8152174 C12.0718037,16.0688418 11.7536251,16.1956522 11.3754941,16.1956522 C11.1910399,16.1956522 11.0181167,16.1633732 10.8567194,16.0988142 C10.695322,16.0342553 10.5523722,15.9420296 10.4278656,15.8221344 C10.3033591,15.7022392 10.2042164,15.5639007 10.1304348,15.4071146 C10.0566531,15.2503286 10.0197628,15.0797111 10.0197628,14.8952569 C10.0197628,14.7200255 10.0543475,14.5517136 10.1235178,14.3903162 C10.1926881,14.2289188 10.2895251,14.0882746 10.4140316,13.9683794 C10.5385382,13.8484842 10.6837936,13.7539529 10.8498024,13.6847826 C11.0158111,13.6156123 11.1910399,13.5810277 11.3754941,13.5810277 C11.5599482,13.5810277 11.7328714,13.6156123 11.8942688,13.6847826 C12.0556662,13.7539529 12.198616,13.8461786 12.3231225,13.9614625 C12.4476291,14.0767463 12.5444661,14.2150848 12.6136364,14.3764822 C12.6828067,14.5378796 12.7173913,14.7061915 12.7173913,14.8814229 L12.7173913,14.8814229 Z"/>
              </g>
            </svg>
        );
    }
}

class Header extends React.Component{

    constructor(props) {
        super(props);

        this.state = {
            popoverOpen: false
        };
    }

    onQuestionMarkClick() {
        this.setState({
            popoverOpen: !this.state.popoverOpen
        })
    }

    onQuestionMarkMouseEnter() {
        this.setState({
            popoverOpen: true
        });
    }

    onQuestionMarkMouseLeave() {
        this.setState({
            popoverOpen: false
        });
    }

    render() {
        const popover = (
            <Overlay
                show={this.state.popoverOpen}
                target={this._questionMark}
                placement='bottom'
                containerPadding={12}>

                <Popover id='about-popover' className='wv-popover' title='MADE WITH LOVE BY'>
                    franz<br/>
                    zbeezy<br/>
                    unclevibes
                </Popover>
            </Overlay>
        );

        // Create week of text label
        const weekOfText = moment().format("MMM Do") + ' - ' + moment().add(7, 'days').format("MMM Do");

        var nowPlayingClass = (this.props.playlistOpen) ? '' : 'active';
        var playlistClass = (this.props.playlistOpen) ? 'active' : '';
        return (
            <div id='header'>
                <div id='logo'></div>
                <div id='week-of-text'>{weekOfText}</div>
                <QuestionMark
                    id='question-mark'
                    ref={(c) => this._questionMark = c }
                    onClick={this.onQuestionMarkClick.bind(this)}
                    onMouseEnter={this.onQuestionMarkMouseEnter.bind(this)}
                    onMouseLeave={this.onQuestionMarkMouseLeave.bind(this)} />

                <div className='buttons'>
                    <div className='header-button' className={'header-button ' + nowPlayingClass} onClick={this.props.nowPlayingHit}>Now Playing</div>
                    <div className='header-button' className={'header-button ' + playlistClass} onClick={this.props.playlistHit}>Playlist</div>
                </div>
                {popover}
            </div>
        );
    }

}

export default Header;
