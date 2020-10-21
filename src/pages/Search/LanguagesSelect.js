/* eslint-disable react/jsx-props-no-spreading */
import React from 'react';

import { Select, Option } from '../../components/Form';
import { popularLanguages, otherLanguages } from '../../constants/languages';

const LanguagesSelect = React.forwardRef((props, ref) => (
  <Select id="language" name="language" ref={ref} {...props}>
    <optgroup key="popular" label="Popular">
      {popularLanguages.map((language) => (
        <Option value={language.name} key={language.language_id}>
          {language.name}
        </Option>
      ))}
    </optgroup>
    <optgroup key="other" label="Everything else">
      {otherLanguages.map((language) => (
        <Option value={language.name} key={language.language_id}>
          {language.name}
        </Option>
      ))}
    </optgroup>
  </Select>
));

export default LanguagesSelect;
