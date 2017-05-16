import React from 'react';
import Modal from 'react-bootstrap/lib/Modal';
import Button from 'react-bootstrap/lib/Button';
import Glyphicon from 'react-bootstrap/lib/Glyphicon';

import Disclaimers from './Disclaimers.jsx';

import Download from './Download.js';

import {heatmapDataPropTypes} from '../../../manipulate/chartDataPropTypes.js';

class DownloadButton extends React.Component {
    constructor(props) {
        super(props);

        this.state = { showModal: false };

        this.afterDownloadButtonClicked = this._afterDownloadButtonClicked.bind(this);
        this.commenceDownloadAndCloseModal = this._commenceDownloadAndCloseModal.bind(this);
        this.closeModal = this._closeModal.bind(this);
    }

    _closeModal() {
        this.setState({ showModal: false });
    }

    _disclaimer() {
        return this.props.disclaimer && Disclaimers[this.props.disclaimer] || {title: null, content: null};
    }

    _afterDownloadButtonClicked() {
        if(!this._disclaimer().title && !this._disclaimer().content) {
            this._commenceDownload();
        } else {
            this.setState({ showModal: true });
        }
    }

    _commenceDownload() {
        Download(this.props.download)
        typeof window.ga === 'function' && window.ga(`atlas-highcharts-widget.send`, `event`, `HeatmapHighcharts`, `downloadData`);
    }

    _commenceDownloadAndCloseModal() {
        this._commenceDownload();
        this.closeModal();
    }

    render() {
        return (
            <a onClick={this.afterDownloadButtonClicked}>
                <Button bsSize="small"
                        style={{textTransform: `unset`, letterSpacing: `unset`, height: `unset`}}>
                    <Glyphicon glyph="download-alt"/> Download table content
                </Button>

                <Modal show={this.state.showModal} onHide={this.closeModal}>
                    <Modal.Header closeButton>
                        <Modal.Title>
                            {this._disclaimer().title}
                        </Modal.Title>
                    </Modal.Header>

                    <Modal.Body>
                        {this._disclaimer().content}
                    </Modal.Body>

                    <Modal.Footer>
                        <Button onClick={this._closeModal}>Close</Button>
                        <Button bsStyle="primary" onClick={this.commenceDownloadAndCloseModal}>
                            Continue downloading
                        </Button>
                    </Modal.Footer>
                </Modal>
            </a>
        );
    }
}

DownloadButton.propTypes = {
    download: React.PropTypes.shape({
        name: React.PropTypes.string.isRequired,
        descriptionLines : React.PropTypes.arrayOf(React.PropTypes.string).isRequired,
        heatmapData: heatmapDataPropTypes,
    }),
    disclaimer: React.PropTypes.string.isRequired
};

export default DownloadButton;
