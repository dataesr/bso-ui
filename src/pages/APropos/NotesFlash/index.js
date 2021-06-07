import React from 'react';

import Banner from '../../../components/Banner';

function NotesFlash() {
  return (
    <div className='notes-flash'>
      <Banner
        backgroundColor='--yellow-medium-50'
        textColor='--blue-dark-125'
        supTitle='Baromètre français de la Science ouverte'
        title='Notes flash'
      />
    </div>
  );
}

export default NotesFlash;
