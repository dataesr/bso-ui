import {
  Button,
  Modal,
  ModalClose,
  ModalContent,
  ModalTitle,
} from '@dataesr/react-dsfr';
import React, { useRef, useState } from 'react';
import { FormattedMessage, useIntl } from 'react-intl';

import useTheme from '../../utils/Hooks/useTheme';

export default function SwitchThemeButton() {
  const intl = useIntl();
  const { theme, switchTheme } = useTheme();
  const [isThemeModalOpen, setIsThemeModalOpen] = useState(false);
  const themeButtonRef = useRef();
  return (
    <>
      <Button
        ref={themeButtonRef}
        icon="fr-fi-theme-fill"
        iconPosition="left"
        className="fr-link"
        onClick={() => setIsThemeModalOpen(!isThemeModalOpen)}
      >
        Changer le thème
      </Button>
      <Modal
        size="sm"
        isOpen={isThemeModalOpen}
        hide={() => {
          setIsThemeModalOpen(false);
        }}
      >
        <ModalClose
          hide={() => {
            setIsThemeModalOpen(false);
          }}
          title={intl.formatMessage({
            id: 'app.commons.modal.fermer',
            defaultMessage: 'Fermer la fenêtre modale',
          })}
        >
          <FormattedMessage id="app.commons.fermer" defaultMessage="fermer" />
        </ModalClose>
        <ModalTitle>Paramêtre d'affichage</ModalTitle>
        <ModalContent>
          <Button
            disabled={theme === 'light'}
            onClick={() => switchTheme('light')}
          >
            <FormattedMessage
              id="app.commons.theme.light"
              defaultMassage="Thème clair"
            />
          </Button>
          <div />
          <Button
            disabled={theme === 'dark'}
            onClick={() => switchTheme('dark')}
          >
            <FormattedMessage
              id="app.commons.theme.dark"
              defaultMassage="Thème sombre"
            />
          </Button>
        </ModalContent>
      </Modal>
    </>
  );
}
