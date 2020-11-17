/* eslint-disable react/jsx-props-no-spreading */
import React from 'react';

import { ControlledSelect } from '../../components/Form/Select';
import { popularLanguages, otherLanguages } from '../../constants/languages';

const LanguagesSelect = (props) => (
  <ControlledSelect
    {...props}
    defaultValue={{ value: '', label: 'All languages' }}
    options={[
      { value: '', label: 'All languages' },
      {
        label: 'Popular',
        options: popularLanguages.map((lang) => ({
          ...lang,
          label: lang.name,
          value: lang.name
        }))
      },
      {
        label: 'Everything else',
        options: otherLanguages.map((lang) => ({
          ...lang,
          label: lang.name,
          value: lang.name
        }))
      }
    ]}
  />
);

export default LanguagesSelect;
