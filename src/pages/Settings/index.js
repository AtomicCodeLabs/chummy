import React from 'react';
import { observer } from 'mobx-react-lite';

import { checkCurrentUser } from '../../hooks/firebase';
import { useUiStore } from '../../hooks/store';
import Panel from '../../components/Panel';
import { PanelsContainer } from '../../components/Panel/style';
import { Select } from '../../components/Form/Select';
import { isStickyWindowOptions, spacingOptions, themeOptions } from './options';

export default observer(() => {
  checkCurrentUser();
  const {
    theme,
    setTheme,
    spacing,
    setSpacing,
    isStickyWindow,
    setIsStickyWindow
  } = useUiStore();

  return (
    <PanelsContainer>
      <Panel
        title="Color Theme"
        description="Specify which color theme to use in the extension popup and Github window."
      >
        <Select
          name="themeSetting"
          value={themeOptions.find((o) => o.value === theme)}
          placeholder="Theme"
          options={themeOptions}
          onChange={(option) => {
            setTheme(option.value);
          }}
        />
      </Panel>
      <Panel
        title="Density"
        description="Controls the spacing and sizes of elements."
      >
        <Select
          name="spacingSetting"
          value={spacingOptions.find((o) => o.value === spacing)}
          placeholder="Spacing"
          options={spacingOptions}
          onChange={(option) => {
            setSpacing(option.value);
          }}
        />
      </Panel>
      <Panel
        title="Sticky Window"
        description="Controls whether extension popup window will stick to the currently active window when focus is changed or window is dragged around."
      >
        <Select
          name="isStickyWindowSetting"
          value={isStickyWindowOptions.find((o) => o.value === isStickyWindow)}
          placeholder="Sticky Window"
          options={isStickyWindowOptions}
          onChange={(option) => {
            setIsStickyWindow(option.value);
          }}
        />
      </Panel>
    </PanelsContainer>
  );
});
