import React from 'react';
import { observer } from 'mobx-react-lite';
import { Scrollbars } from 'react-custom-scrollbars';

import { checkCurrentUser } from '../../hooks/firebase';
import { useUiStore, useUserStore } from '../../hooks/store';
import Panel from '../../components/Panel';
import { PanelsContainer, PanelDivider } from '../../components/Panel/style';
import { Select } from '../../components/Form/Select';
import {
  isStickyWindowOptions,
  sidebarSideOptions,
  spacingOptions,
  themeOptions
} from './options';
import { updateSidebarSide } from '../../utils/browser';

export default observer(() => {
  checkCurrentUser();
  const {
    theme,
    setTheme,
    spacing,
    setSpacing,
    isStickyWindow,
    setIsStickyWindow,
    sidebarSide,
    setSidebarSide
  } = useUiStore();
  const { user } = useUserStore();

  return (
    <Scrollbars
      style={{
        width: '100%',
        height: '100%'
      }}
      autoHideTimeout={500}
      autoHide
    >
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
            isOptionDisabled={(option) =>
              !option.tiers.includes(user.accountType)
            }
          />
        </Panel>
        <PanelDivider />
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
            isOptionDisabled={(option) =>
              !option.tiers.includes(user.accountType)
            }
          />
        </Panel>
        <PanelDivider />
        <Panel
          title="Sticky Window"
          description="Controls whether extension sidebar window will stick to the currently active window when focus is changed or window is dragged around."
        >
          <Select
            name="isStickyWindowSetting"
            value={isStickyWindowOptions.find(
              (o) => o.value === isStickyWindow
            )}
            placeholder="Sticky Window"
            options={isStickyWindowOptions}
            onChange={(option) => {
              setIsStickyWindow(option.value);
            }}
            isOptionDisabled={(option) =>
              !option.tiers.includes(user.accountType)
            }
          />
        </Panel>
        <Panel
          title="Sidebar Side"
          description="Choose which side of the main window the extension should appear on. Works best with sticky window on."
        >
          <Select
            name="sidebarSideSetting"
            value={sidebarSideOptions.find((o) => o.value === sidebarSide)}
            placeholder="Sidebar Side"
            options={sidebarSideOptions}
            onChange={(option) => {
              // Send message to bg to send extension to the correct side
              updateSidebarSide(sidebarSide, option.value);
              setSidebarSide(option.value);
            }}
            isOptionDisabled={(option) =>
              !option.tiers.includes(user.accountType)
            }
          />
        </Panel>
      </PanelsContainer>
    </Scrollbars>
  );
});
