import {
  Button,
  Modal,
  ModalClose,
  ModalContent,
  ModalTitle,
  Radio,
  RadioGroup,
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
        <FormattedMessage
          id="app.theme.change"
          defaultMessage="Changer le thème"
        />
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
        <ModalTitle>
          <FormattedMessage
            id="app.theme.params"
            defaultMessage="Paramètres d'affichage"
          />
        </ModalTitle>
        <ModalContent>
          <RadioGroup
            className="fr-switch-theme"
            legend={intl.formatMessage({
              id: 'app.theme.legend',
              defaultMassage:
                'Choisissez un thème pour personnaliser l’apparence du site.',
            })}
          >
            <Radio
              label={intl.formatMessage({
                id: 'app.theme.light',
                defaultMassage: 'Thème clair',
              })}
              value="light"
              isExtended
              onChange={(e) => theme !== e.target.value && switchTheme(e.target.value)}
            />
            <Radio
              label={intl.formatMessage({
                id: 'app.theme.dark',
                defaultMassage: 'Thème sombre',
              })}
              value="dark"
              isExtended
              onChange={(e) => theme !== e.target.value && switchTheme(e.target.value)}
            />
          </RadioGroup>
        </ModalContent>
      </Modal>
    </>
  );
}
