const React = require(`react`);
const Modal = require(`react-bootstrap/lib/Modal`);
const Button = require(`react-bootstrap/lib/Button`);
const Glyphicon = require(`react-bootstrap/lib/Glyphicon`);
const Disclaimers = require(`./Disclaimers.jsx`);
const PropTypes = require('../../PropTypes.js');

const Download = require(`./Download.js`).commenceDownload;
const DownloadProfilesButton = React.createClass({
    propTypes: {
        download: React.PropTypes.shape({
          name: React.PropTypes.string.isRequired,
          descriptionLines : React.PropTypes.arrayOf(React.PropTypes.string).isRequired,
          heatmapData: PropTypes.HeatmapData,
        }),
        disclaimer: React.PropTypes.string.isRequired,
        onDownloadCallbackForAnalytics: React.PropTypes.func.isRequired
    },

    getInitialState() {
        return { showModal: false };
    },

    _closeModal() {
        this.setState({ showModal: false });
    },

    _disclaimer() {
      return this.props.disclaimer && Disclaimers[this.props.disclaimer] || {title: null, content: null};
    },

    _afterDownloadButtonClicked() {
        if(!this._disclaimer().title && !this._disclaimer().content) {
            this._commenceDownload();
        } else {
            this.setState({ showModal: true });
        }
    },

    _commenceDownload() {
        this.props.onDownloadCallbackForAnalytics()
        Download(this.props.download)
    },

    _commenceDownloadAndCloseModal() {
        this._commenceDownload();
        this._closeModal();
    },

    render() {
        return (
            <a onClick={this._afterDownloadButtonClicked}>
                <Button bsSize="small">
                    <Glyphicon glyph="download-alt"/> Download table content
                </Button>

                <Modal show={this.state.showModal} onHide={this._closeModal}>
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
                        <Button bsStyle="primary" onClick={this._commenceDownloadAndCloseModal}>
                            Continue downloading
                        </Button>
                    </Modal.Footer>
                </Modal>
            </a>
        );
    }
});

module.exports = DownloadProfilesButton;
