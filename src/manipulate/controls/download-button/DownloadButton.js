import React from 'react'
import PropTypes from 'prop-types'
import {MenuItem,Glyphicon,SplitButton, Button, Modal} from 'react-bootstrap/lib'

import Disclaimers from './Disclaimers.js'

import ClientSideDownload from './Download.js'

import {heatmapDataPropTypes} from '../../../manipulate/chartDataPropTypes.js'

import uncontrollable from 'uncontrollable'

import URI from 'urijs'

const _DownloadWithModal = ({showModal, onChangeShowModal, disclaimer: {title, content}, downloadOptions}) => (
    <div>
        <Button
            bsSize="small"
            onClick={onChangeShowModal.bind(this, true)}
            title={"Download"}
            style={{textTransform: `unset`, letterSpacing: `unset`, height: `unset`}}>
            <Glyphicon glyph="download"/> Download
        </Button>

        <Modal show={showModal} onHide={onChangeShowModal.bind(this, false)}>
            <Modal.Header closeButton>
                <Modal.Title>
                    {title}
                </Modal.Title>
            </Modal.Header>

            <Modal.Body>
                {content}
            </Modal.Body>

            <Modal.Footer>
                <Button onClick={onChangeShowModal.bind(this, false)}>
                    Close
                </Button>
                {
                    downloadOptions.map(o => (
                        <Button
                            key={o.description}
                            bsStyle="primary"
                            onClick={() => {
                                o.onClick()
                                onChangeShowModal(false)
                            }}>
                            {"Download: " + o.description}
                        </Button>
                    ))
                }
            </Modal.Footer>
        </Modal>
    </div>
)




const DownloadWithModal = uncontrollable(_DownloadWithModal, {
    'showModal' : 'onChangeShowModal'
})

DownloadWithModal.defaultProps = {
    defaultShowModal : false
}

const SplitDownloadButton = ({downloadOptions}) => (
    <SplitButton
        bsSize="small"
        onClick={downloadOptions[0].onClick}
        title={"Download"}
        style={{textTransform: `unset`, letterSpacing: `unset`, height: `unset`}}>
        {
            downloadOptions.map((o,ix) => (
                <MenuItem eventKey={ix} id={o.description} onClick={o.onClick}>
                    <Glyphicon glyph="download-alt"/> {o.description}
                </MenuItem>
            ))
        }
    </SplitButton>
)


const DownloadButton = ({currentlyShownContent, fullDatasetUrl, disclaimer}) => {

    const downloadOptions = [].concat(
        fullDatasetUrl
        ? [{
            onClick : () => window.open(fullDatasetUrl, "Download"),
            description : "All data"
        }]
        : [],
        [{
            onClick: () => ClientSideDownload(currentlyShownContent),
            description : "Table content"
        }]
    )

    return (
        disclaimer && Disclaimers[disclaimer]
        ? <DownloadWithModal
            disclaimer={Disclaimers[disclaimer]}
            downloadOptions={downloadOptions}/>
        : <SplitDownloadButton
            downloadOptions={downloadOptions}/>
    )
}


DownloadButton.propTypes = {
    currentlyShownContent: PropTypes.shape({
        name: PropTypes.string.isRequired,
        descriptionLines : PropTypes.arrayOf(PropTypes.string).isRequired,
        heatmapData: heatmapDataPropTypes,
    }).isRequired,
    fullDatasetUrl: PropTypes.string.isRequired,
    disclaimer: PropTypes.string.isRequired
}

export default DownloadButton
