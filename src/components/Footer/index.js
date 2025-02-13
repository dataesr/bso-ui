import './style.scss';

import {
  Footer as DSFooter,
  FooterCopy,
  FooterLink,
  FooterTop,
  FooterTopCategory,
  Icon as DSIcon,
} from '@dataesr/react-dsfr';
import React from 'react';
import { FormattedMessage, useIntl } from 'react-intl';
import { Link as RouterLink, useLocation } from 'react-router-dom';

import useLang from '../../utils/Hooks/useLang';
import WrapperDisplay from '../WrapperDisplay';

export default function Footer() {
  const { pathname } = useLocation();
  const intl = useIntl();
  const { lang, urls } = useLang();

  return (
    <WrapperDisplay display={!pathname.startsWith('/integration')}>
      <DSFooter className='josm-footer'>
        <FooterTop>
          <FooterTopCategory
            title={intl.formatMessage({ id: 'app.footer.see-also' })}
          >
            <FooterLink asLink={<RouterLink to={urls.methodologie[lang]} />}>
              <FormattedMessage id='app.header.nav.a-propos' />
            </FooterLink>
          </FooterTopCategory>
          <FooterTopCategory
            title={intl.formatMessage({ id: 'app.footer.contact' })}
          >
            <FooterLink target='_blank' href='mailto:osm_support@nii.ac.jp'>
              <DSIcon className='ds-fr--v-middle' name='ri-mail-fill' size='xl'>
                <span>Email</span>
              </DSIcon>
            </FooterLink>
          </FooterTopCategory>
        </FooterTop>
        <div className='josm-footer__contents'>
          <div className='josm-footer__brands'>
            <a href='https://nii.ac.jp' target='_blank' rel='noreferrer'>
              <img
                src='/logos/nii.png'
                alt='National Institute of Informatics'
              />
            </a>
            <a href='https://rcos.nii.ac.jp' target='_blank' rel='noreferrer'>
              <img
                src='/logos/rcos.png'
                alt='Research Center for Open Science and Data Platform'
              />
            </a>
          </div>
          <div className='josm-footer__title'>
            <p className='josm-footer__title-copy'>
              {intl.formatMessage({ id: 'app.header.title' })}
            </p>
            <p className='josm-footer__version'>{`v${process.env.REACT_APP_VERSION}`}</p>
          </div>
        </div>
        <FooterCopy className='w-100'>
          {intl.formatMessage({ id: 'app.footer.licence.usage' })}
          {' '}
          <a
            href={intl.formatMessage({
              id: 'app.footer.etalab-licence.url',
            })}
            target='_blank'
            rel='noreferrer'
          >
            licence etalab-2.0
          </a>
        </FooterCopy>
      </DSFooter>
      <div className='overlay z-3600' />
    </WrapperDisplay>
  );
}
