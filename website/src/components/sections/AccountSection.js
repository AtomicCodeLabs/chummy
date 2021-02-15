/* eslint-disable no-sequences */
/* eslint-disable no-param-reassign */
/* eslint-disable no-return-assign */
import React, { useEffect, useState } from 'react';
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
          className={clsx(`w-${width}/12`, {
            'text-right': i === items.length - 1,
            'text-left': i !== items.length - 1
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
  onSubmit = () => {},
  type = 'radio', // or checkbox
  className
}) => {
  const getDefaults = () =>
    options.reduce(
      (obj, { value: [value, defaultValue] }) =>
        Object.assign(obj, { [value]: defaultValue }),
      {}
    );
  const [valuesToChecked, setValuesToChecked] = useState(getDefaults());
  useEffect(() => {
    setValuesToChecked(getDefaults());
  }, [options]);

  // Find one true value if any
  const findRadio = () =>
    Object.entries(valuesToChecked).find(([, checked]) => checked === true);
  const findChecklist = () => Object.entries(valuesToChecked)?.[0];
  const findSelectedValue = () => {
    if (type === 'radio') {
      return findRadio();
    }
    if (type === 'checkbox') {
      return findChecklist();
    }
  };

  console.log('Values', options, valuesToChecked);

  const isDisabled = (() => {
    const found = findSelectedValue();
    if (found) {
      return isButtonDisabled(found);
    }
    return false;
  })();

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
                onClick={() => {
                  const found = findSelectedValue();
                  if (found) onSubmit(found);
                }}
                className={clsx('text-center', buttonClassName)}
                disabled={isDisabled}
              >
                {isDisabled ? disabledButtonText || buttonText : buttonText}
              </ActionButton>
            </div>
          </form>
        </div>
      </div>
      {hasBottomBorder && <div className="h-px bg-gray-300" />}
    </>
  );
};
