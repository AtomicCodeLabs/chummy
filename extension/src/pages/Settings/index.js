import React from 'react';
import { observer } from 'mobx-react-lite';

import { checkCurrentUser } from '../../hooks/dao';
import { useFileStore, useUiStore, useUserStore } from '../../hooks/store';
import Panel from '../../components/Panel';
import { PanelsContainer, PanelDivider } from '../../components/Panel/style';
import { Select } from '../../components/Form/Select';
import TextButton from '../../components/Buttons/TextButton';
import { Flag } from '../../components/Text';
import Scrollbars from '../../components/Scrollbars';
import { toggleDistractionFreeMode } from '../../components/ResizableSidebar/ActionButtons/util';
import {
  isDistractionFreeModeConfig,
  isStickyWindowConfig,
  sidebarSideConfig,
  spacingConfig,
  themeConfig,
  isPopupConfig
} from './options';
import { updateSidebarSide } from '../../utils/browser';
import { browserName } from '../../config/browser';
import { NotificationType } from '../../config/store/I.ui.store';

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
    isPopup,
    setIsPopup,
    isDistractionFreeMode,
    setIsDistractionFreeMode,
    sidebarSide,
    setSidebarSide,
    addGenericPendingNotification,
    clear: uiClear
  } = useUiStore();
  const { user } = useUserStore();
  const { clear: fileClear } = useFileStore();

  const injectInfoIntoOption = (option) => ({
    ...option,
    currentTier: user.accountType
  });

  return (
    <Scrollbars>
      <PanelsContainer>
        <Panel
          title="Color Theme"
          description="Specify which color theme to use in the extension popup and GitHub window."
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
        <PanelDivider />
        <Panel
          title="Windowed Mode"
          description="Toggle to embed the extension in the browser or pop it out in its separate window."
          flag={
            !isPopupConfig.browsers.includes(browserName) && <ChromiumOnly />
          }
        >
          <Select
            name="isPopupSetting"
            value={injectInfoIntoOption(
              isPopupConfig.options.find((o) => o.value === isPopup)
            )}
            placeholder="Windowed Mode"
            options={isPopupConfig.options}
            onChange={(option) => {
              setIsPopup(option.value);
            }}
            isOptionDisabled={(option) =>
              !isPopupConfig.browsers.includes(browserName) ||
              !option.tiers.includes(user.accountType)
            }
          />
        </Panel>
        <PanelDivider />
        <Panel
          title="Distraction Free Mode"
          description="Toggle to hide distractions when browsing files on GitHub."
          flag={
            !isDistractionFreeModeConfig.browsers.includes(browserName) && (
              <ChromiumOnly />
            )
          }
        >
          <Select
            name="isDistractionFreeModeSetting"
            value={injectInfoIntoOption(
              isDistractionFreeModeConfig.options.find(
                (o) => o.value === isDistractionFreeMode
              )
            )}
            placeholder="Distraction Free Mode"
            options={isDistractionFreeModeConfig.options}
            onChange={(option) => {
              toggleDistractionFreeMode(option.value);
              setIsDistractionFreeMode(option.value);
            }}
            isOptionDisabled={(option) =>
              !isDistractionFreeModeConfig.browsers.includes(browserName) ||
              !option.tiers.includes(user.accountType)
            }
          />
        </Panel>
        <PanelDivider />
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
        <PanelDivider />
        <Panel
          title="Reset"
          description="Clear cache and reset all settings to defaults. Warning, your last session will be lost!"
        >
          <TextButton
            onClick={() => {
              // Reset file and ui stores to default
              uiClear();
              fileClear();
              addGenericPendingNotification(
                'Application Reset',
                'Cache and settings were successfully reset to defaults.',
                NotificationType.Success
              );
            }}
          >
            Reset to defaults
          </TextButton>
        </Panel>
      </PanelsContainer>
    </Scrollbars>
  );
});
