import {
  Button,
  Modal,
  ModalClose,
  ModalContent,
  ModalTitle,
} from '@dataesr/react-dsfr';
import React, { useRef, useState } from 'react';
import { FormattedMessage, useIntl } from 'react-intl';

import useLang from '../../utils/Hooks/useLang';

export default function SwitchLangButton() {
  const intl = useIntl();
  const { lang, switchLang } = useLang();
  const [isLangModalOpen, setIsLangModalOpen] = useState(false);
  const langButtonRef = useRef();

  return (
    <>
      <Button
        ref={langButtonRef}
        icon="fr-fi-volume-up-fill"
        iconPosition="left"
        className="fr-link"
        onClick={() => setIsLangModalOpen(!isLangModalOpen)}
      >
        Changer la langue
      </Button>
      <Modal
        size="sm"
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
          <FormattedMessage id="app.commons.fermer" defaultMessage="fermer" />
        </ModalClose>
        <ModalTitle>Paramètres de langue</ModalTitle>
        <ModalContent>
          <Button disabled={lang === 'fr'} onClick={() => switchLang('fr')}>
            Francais
          </Button>
          <div />
          <Button disabled={lang === 'en'} onClick={() => switchLang('en')}>
            Anglais
          </Button>
        </ModalContent>
      </Modal>
    </>
  );
}
