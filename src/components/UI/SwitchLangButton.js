import {
  Button,
  ButtonGroup,
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
import { useLocation } from 'react-router-dom';

import useLang from '../../utils/Hooks/useLang';

export default function SwitchLangButton() {
  const { pathname, search } = useLocation();
  const intl = useIntl();
  const { lang, switchLang } = useLang();
  const [isLangModalOpen, setIsLangModalOpen] = useState(false);
  const [selectedLang, setSelectedLang] = useState();
  const langButtonRef = useRef();
  return (
    <>
      <Button
        ref={langButtonRef}
        icon='ri-flag-fill'
        iconPosition='left'
        styleAsLink
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
          <FormattedMessage id='app.commons.fermer' defaultMessage='Fermer' />
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
            value={lang}
          >
            <Radio
              className='france-flag'
              label={intl.formatMessage({
                id: 'app.lang.fr',
                defaultMessage: 'Français',
              })}
              value='fr'
              isExtended
              onChange={(e) => setSelectedLang(e.target.value)}
            />
            <Radio
              className='great-britain-flag'
              label={intl.formatMessage({
                id: 'app.lang.en',
                defaultMessage: 'Anglais',
              })}
              value='en'
              isExtended
              onChange={(e) => setSelectedLang(e.target.value)}
            />
          </RadioGroup>
        </ModalContent>
        <ModalFooter>
          <ButtonGroup isInlineFrom='sm'>
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
                  switchLang(selectedLang, pathname, search);
                }
                setIsLangModalOpen(false);
              }}
            >
              <FormattedMessage
                id='app.lang.change'
                defaultMessage='Changer la langue'
              />
            </Button>
          </ButtonGroup>
        </ModalFooter>
      </Modal>
    </>
  );
}
