import {
  Button,
  Modal,
  ModalClose,
  ModalContent,
  ModalFooter,
  ModalTitle,
  Radio,
  RadioGroup,
} from '@dataesr/react-dsfr';
import React, { useRef, useState } from 'react';
import { FormattedMessage, useIntl } from 'react-intl';

import useLang from '../../utils/Hooks/useLang';

export default function SwitchLangButton() {
  const intl = useIntl();
  const { lang, switchLang } = useLang();
  const [isLangModalOpen, setIsLangModalOpen] = useState(false);
  const [selectedLang, setSelectedLang] = useState();
  const langButtonRef = useRef();
  return (
    <>
      <Button
        ref={langButtonRef}
        icon='fr-fi-volume-up-fill'
        iconPosition='left'
        className='fr-link'
        onClick={() => setIsLangModalOpen(!isLangModalOpen)}
      >
        <FormattedMessage
          id='app.lang.change'
          defaultMessage='Changer la langue'
        />
      </Button>
      <Modal
        size='sm'
        isOpen={isLangModalOpen}
        hide={() => {
          setIsLangModalOpen(false);
        }}
      >
        <ModalClose
          hide={() => {
            setIsLangModalOpen(false);
          }}
          title={intl.formatMessage({
            id: 'app.commons.modal.fermer',
            defaultMessage: 'Fermer la fenêtre modale',
          })}
        >
          <FormattedMessage id='app.commons.fermer' defaultMessage='fermer' />
        </ModalClose>
        <ModalTitle>
          <FormattedMessage
            id='app.lang.params'
            defaultMessage='Paramètre de langue'
          />
        </ModalTitle>
        <ModalContent>
          <RadioGroup
            legend={intl.formatMessage({
              id: 'app.lang.legend',
              defaultMessage: 'Choisissez une langue pour le site.',
            })}
          >
            <Radio
              label={intl.formatMessage({
                id: 'app.lang.fr',
                defaultMessage: 'Français',
              })}
              imageURL='https://www.countryflags.io/fr/flat/64.png'
              value='fr'
              isExtended
              onChange={(e) => setSelectedLang(e.target.value)}
            />
            <Radio
              label={intl.formatMessage({
                id: 'app.lang.en',
                defaultMessage: 'Anglais',
              })}
              imageURL='https://www.countryflags.io/gb/flat/64.png'
              value='en'
              isExtended
              onChange={(e) => setSelectedLang(e.target.value)}
            />
          </RadioGroup>
        </ModalContent>
        <ModalFooter>
          <Button
            title='title'
            secondary
            onClick={() => setIsLangModalOpen(false)}
          >
            <FormattedMessage
              id='app.commons.annuler'
              defaultMessage='Annuler'
            />
          </Button>
          <Button
            title='title'
            onClick={() => {
              if (lang !== selectedLang) {
                switchLang(selectedLang);
              }
              setIsLangModalOpen(false);
            }}
          >
            <FormattedMessage
              id='app.lang.change'
              defaultMessage='Changer la langue'
            />
          </Button>
        </ModalFooter>
      </Modal>
    </>
  );
}
