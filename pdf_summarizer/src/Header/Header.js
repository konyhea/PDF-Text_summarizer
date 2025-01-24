import React from 'react'
import './Header.css'
import PdfIcon from './Assets/2aa29636-8779-406c-84b1-419d4ae94761.svg'
import NightIcon from './Assets/53c189ff-145d-4640-bedc-2d940c207aff.svg'
import LoadingIcon from './Assets/68f446ac-f86b-45f2-ae3f-e0056afeb8bc.svg'
import NewConvoIcon from './Assets/17deb87a-c391-4eb3-9abc-60aec1544d99.svg'
import VolumeIcon from './Assets/volume_up_24dp_E8EAED_FILL0_wght400_GRAD0_opsz24.svg'
import Ng from './Assets/flag-for-flag-nigeria-svgrepo-com.svg'
import Quest from './Assets/1067a6b2-3311-4084-ae2a-fc504a139aa7.svg'


export default function Header() {
  return (
    <div>
      <header>
        <div className="header">
            <div className="header-container">
            <div className="svg-visible">
            <div className="svg">
            <img src={PdfIcon} alt="pdfIcon" />
            </div>
            <div className="svg element">
            <img src={NewConvoIcon} alt="NewConvoIcon" />
            </div>
            </div>

            <div className=" svg svg-hidden">
                <div className="svg-hidden-inner">
                <div className="hidden audio">
                    <div className="audio-container inner-container">
                        <p>Convert to Audio</p>
                        <img src={VolumeIcon} alt="Volume icon" />
                    </div>
                </div>

                <div className="hidden svg element">
                    <div className="Ng inner-container">
                        <img className="svg-flag" src={Ng} alt="Nigeria flag" />
                        <p>NG</p>
                    </div>
                </div>

                <div className="svg hidden element">
                    <img src={NightIcon} alt="NightIcon" />
                </div>

                <div className="svg hidden element">
                    <img src={Quest} alt="quest" />
                </div>
                </div>
            </div>

            <div className="svg loadingIcon element">
            <img src={LoadingIcon} alt="LoadingIcon" />
            </div>
            </div>
        </div>
      </header>
    </div>
  )
}
