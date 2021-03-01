/* eslint-disable no-sequences */
/* eslint-disable no-param-reassign */
/* eslint-disable no-return-assign */
import React, { useEffect, useMemo, useState } from 'react';
import clsx from 'clsx';
import ActionButton from '../buttons/ActionButton';

export const InfoSection = ({
  title,
  leftText,
  right = null,
  hasTopBorder = false,
  hasBottomBorder = false,
  className
}) => (
  <>
    {hasTopBorder && <div className="h-px bg-gray-300" />}
    <div
      className={clsx(
        'flex flex-row items-center justify-between py-6',
        className
      )}
    >
      <div className="flex flex-col">
        <h5 className="font-medium mt-0 mb-2.5 sm:mb-1 text-gray-700">
          {title}
        </h5>
        <div
          className={clsx('h-6 flex flex-row items-center w-80 sm:h-4', {
            'rounded-lg bg-gray-200 animate-pulse': !leftText
          })}
        >
          {leftText && (
            <span className="text-base font-light text-gray-700 sm:text-sm">
              {leftText}
            </span>
          )}
        </div>
      </div>
      <div>{right}</div>
    </div>
    {hasBottomBorder && <div className="h-px bg-gray-300" />}
  </>
);

export const TableRowSection = ({
  items = [
    // sum of widths === 12
    { title: 'Date', width: 3 },
    { title: 'Method', width: 2 },
    { title: 'Description', width: 4 },
    { title: 'Total', width: 1 },
    { title: 'Receipt', width: 2 }
  ],
  isHeader = false,
  className
}) => (
  <div
    className={clsx('flex flex-row w-full border-b border-gray-300', className)}
  >
    {items &&
      items.map(({ title, width }, i) => (
        <div
          // eslint-disable-next-line react/no-array-index-key
          key={i}
          className={clsx('pr-3 last:pr-0', {
            'text-right': i === items.length - 1,
            'text-left': i !== items.length - 1,
            // Need to catch widths separately so that tailwind doesn't purge the css
            'w-0': width === 0,
            'w-1/12': width === 1,
            'w-2/12': width === 2,
            'w-3/12': width === 3,
            'w-4/12': width === 4,
            'w-5/12': width === 5,
            'w-6/12': width === 6,
            'w-7/12': width === 7,
            'w-8/12': width === 8,
            'w-9/12': width === 9,
            'w-10/12': width === 10,
            'w-11/12': width === 11,
            'w-full': width === 12
          })}
        >
          <div className="py-5 my-0 text-gray-700">
            {isHeader ? (
              <h5 className="my-0 font-medium">{title}</h5>
            ) : (
              <span className="text-base font-light text-gray-700 sm:text-sm">
                {title}
              </span>
            )}
          </div>
        </div>
      ))}
  </div>
);

export const BulletsSection = ({
  title,
  options = [{ label: 1, value: [1, false] }],
  hasTopBorder = false,
  hasBottomBorder = false,
  buttonText = 'Submit',
  disabledButtonText = null,
  buttonClassName = '',
  isButtonDisabled = () => false,
  onSubmit = async () => {},
  type = 'radio', // or checkbox
  className
}) => {
  const getDefaults = () =>
    options.reduce(
      (obj, { value: [value, defaultValue] }) =>
        Object.assign(obj, { [value]: defaultValue }),
      {}
    );
  const valuesToButtonText = options.reduce(
    (obj, { value: [value], buttonText: buttonTextOverride }) =>
      Object.assign(obj, { [value]: buttonTextOverride || buttonText }),
    {}
  );
  const [valuesToChecked, setValuesToChecked] = useState(getDefaults());
  const [loading, setLoading] = useState(false);
  useEffect(() => {
    setValuesToChecked(getDefaults());
  }, [options]);

  // Find one true value if any
  const findRadio = () =>
    Object.entries(valuesToChecked).find(([, checked]) => checked === true);
  const findChecklist = () => Object.entries(valuesToChecked)?.[0];
  const findSelected = useMemo(() => {
    if (type === 'radio') {
      return findRadio();
    }
    if (type === 'checkbox') {
      return findChecklist();
    }
  }, [valuesToChecked]);

  const isDisabled = (() => {
    const found = findSelected;
    if (found) {
      return isButtonDisabled(found);
    }
    return false;
  })();

  console.log('VALUES', valuesToButtonText, findSelected);

  return (
    <>
      {hasTopBorder && <div className="h-px bg-gray-300" />}
      <div
        className={clsx(
          'flex flex-row items-center justify-between py-6',
          className
        )}
      >
        <div className="flex flex-col w-full">
          <h5 className="font-medium mt-0 mb-2.5 sm:mb-1 text-gray-700">
            {title}
          </h5>
          <form className="flex flex-col w-full text-base font-light text-gray-700 sm:text-sm">
            {options &&
              options.map(({ label, value: [value] }) => (
                // eslint-disable-next-line jsx-a11y/label-has-associated-control
                <label className="inline-flex items-center py-2">
                  <input
                    type={type}
                    value={value}
                    className={clsx(
                      'w-4 h-4 text-green-600 border border-gray-500',
                      {}
                    )}
                    checked={valuesToChecked[value]}
                    onChange={(e) => {
                      if (type === 'radio') {
                        // Set all others to false
                        setValuesToChecked(
                          Object.entries(valuesToChecked).reduce(
                            (obj, [v]) => (
                              (obj[v] = v === e.target.value), obj
                            ),
                            {}
                          )
                        );
                      }
                      // Toggle just this value
                      if (type === 'checkbox') {
                        setValuesToChecked({
                          ...valuesToChecked,
                          [e.target.value]: !valuesToChecked[e.target.value]
                        });
                      }
                    }}
                  />
                  <span className="flex-1 ml-3 select-none">{label}</span>
                </label>
              ))}
            <div className="flex items-center pt-4 h-14">
              <ActionButton
                onClick={async (e) => {
                  e.preventDefault();
                  setLoading(true);
                  const found = findSelected;
                  if (found) {
                    await onSubmit(found);
                  }
                  setLoading(false);
                }}
                className={clsx('text-center', buttonClassName)}
                disabled={isDisabled}
                isLoading={loading}
              >
                {isDisabled
                  ? disabledButtonText ||
                    valuesToButtonText[findSelected?.[0]] ||
                    buttonText
                  : valuesToButtonText[findSelected?.[0]] || buttonText}
              </ActionButton>
            </div>
          </form>
        </div>
      </div>
      {hasBottomBorder && <div className="h-px bg-gray-300" />}
    </>
  );
};
