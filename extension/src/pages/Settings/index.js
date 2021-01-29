import React from 'react';
import { observer } from 'mobx-react-lite';
import browser from 'webextension-polyfill';

import { checkCurrentUser } from '../../hooks/dao';
import { useUiStore, useUserStore } from '../../hooks/store';
import Panel from '../../components/Panel';
import { PanelsContainer, PanelDivider } from '../../components/Panel/style';
import { Select } from '../../components/Form/Select';
import TextButton from '../../components/Buttons/TextButton';
import { Flag } from '../../components/Text';
import Scrollbars from '../../components/Scrollbars';
import {
  isStickyWindowConfig,
  sidebarSideConfig,
  spacingConfig,
  themeConfig
} from './options';
import { updateSidebarSide } from '../../utils/browser';
import { browserName } from '../../config/browser';

const ChromiumOnly = () => <Flag>Chromium Only</Flag>;

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

  const injectInfoIntoOption = (option) => ({
    ...option,
    currentTier: user.accountType
  });

  return (
    <Scrollbars>
      <PanelsContainer>
        <Panel
          title="Color Theme"
          description="Specify which color theme to use in the extension popup and Github window."
          flag={!themeConfig.browsers.includes(browserName) && <ChromiumOnly />}
        >
          <Select
            name="themeSetting"
            value={injectInfoIntoOption(
              themeConfig.options.find((o) => o.value === theme)
            )}
            placeholder="Theme"
            options={themeConfig.options}
            onChange={(option) => {
              setTheme(option.value);
            }}
            isOptionDisabled={(option) =>
              !themeConfig.browsers.includes(browserName) ||
              !option.tiers.includes(user.accountType)
            }
          />
        </Panel>
        <PanelDivider />
        <Panel
          title="Density"
          description="Controls the spacing and sizes of elements."
          flag={
            !spacingConfig.browsers.includes(browserName) && <ChromiumOnly />
          }
        >
          <Select
            name="spacingSetting"
            value={injectInfoIntoOption(
              spacingConfig.options.find((o) => o.value === spacing)
            )}
            placeholder="Spacing"
            options={spacingConfig.options}
            onChange={(option) => {
              setSpacing(option.value);
            }}
            isOptionDisabled={(option) =>
              !spacingConfig.browsers.includes(browserName) ||
              !option.tiers.includes(user.accountType)
            }
          />
        </Panel>
        <PanelDivider />
        <Panel
          title="Sticky Window"
          description="Controls whether extension sidebar window will stick to the currently active window when focus is changed or window is dragged around."
          flag={
            !isStickyWindowConfig.browsers.includes(browserName) && (
              <ChromiumOnly />
            )
          }
        >
          <Select
            name="isStickyWindowSetting"
            value={injectInfoIntoOption(
              isStickyWindowConfig.options.find(
                (o) => o.value === isStickyWindow
              )
            )}
            placeholder="Sticky Window"
            options={isStickyWindowConfig.options}
            onChange={(option) => {
              setIsStickyWindow(option.value);
            }}
            isOptionDisabled={(option) =>
              !isStickyWindowConfig.browsers.includes(browserName) ||
              !option.tiers.includes(user.accountType)
            }
          />
        </Panel>
        <Panel
          title="Sidebar Side"
          description="Choose which side of the main window the extension should appear on. Works best with sticky window on."
          flag={
            !sidebarSideConfig.browsers.includes(browserName) && (
              <ChromiumOnly />
            )
          }
        >
          <Select
            name="sidebarSideSetting"
            value={injectInfoIntoOption(
              sidebarSideConfig.options.find((o) => o.value === sidebarSide)
            )}
            placeholder="Sidebar Side"
            options={sidebarSideConfig.options}
            onChange={(option) => {
              // Send message to bg to send extension to the correct side
              updateSidebarSide(sidebarSide, option.value);
              setSidebarSide(option.value);
            }}
            isOptionDisabled={(option) =>
              !sidebarSideConfig.browsers.includes(browserName) ||
              !option.tiers.includes(user.accountType)
            }
          />
        </Panel>
        <Panel
          title="Reset"
          description="Clear cache and reset all settings to defaults."
        >
          <TextButton
            onClick={() => {
              browser.storage.sync.clear();
            }}
          >
            Reset to defaults
          </TextButton>
        </Panel>
      </PanelsContainer>
    </Scrollbars>
  );
});
