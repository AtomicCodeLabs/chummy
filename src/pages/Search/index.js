import React, { Suspense, useEffect, useState, useMemo } from 'react';
import { observer } from 'mobx-react-lite';
import { Scrollbars } from 'react-custom-scrollbars';
import { useForm } from 'react-hook-form';
import { toJS } from 'mobx';

import { SectionContent } from '../../components/Section';
import OpenCloseChevron from '../../components/OpenCloseChevron';
import {
  SearchContainer,
  IconContainer,
  Form,
  Input
} from '../../components/Form';
import Select from '../../components/Form/Select';
import { checkCurrentUser } from '../../hooks/firebase';
import { useUiStore, useFileStore } from '../../hooks/store';
import useDebounce from '../../hooks/useDebounce';

const LanguagesSelect = React.lazy(() => import('./LanguagesSelect'));

export default observer(() => {
  checkCurrentUser();
  const { openRepos } = useFileStore();
  const {
    isSearchSectionMinimized,
    toggleSearchSection,
    selectedQuery,
    setSelectedQuery,
    selectedOpenRepo,
    setSelectedOpenRepo,
    selectedLanguage,
    setSelectedLanguage
  } = useUiStore();

  // @computed repo options
  const repoOptions = useMemo(
    () =>
      Array.from(openRepos).map(([repoId, repo]) => ({
        value: repoId,
        label: `${repo.owner}/${repo.name}`
      })),
    [openRepos.size]
  );

  console.log(
    'first',
    toJS(selectedOpenRepo),
    repoOptions.filter((o) => o.value === selectedOpenRepo)
  );

  const { control, register, watch, handleSubmit } = useForm({
    defaultValues: {
      query: selectedQuery || '',
      repository: selectedOpenRepo
        ? repoOptions.filter((o) => o.value === selectedOpenRepo) // https://stackoverflow.com/questions/43495696/how-to-set-a-default-value-in-react-select
        : repoOptions.length && repoOptions[0],
      language: selectedLanguage
        ? { label: selectedLanguage, value: selectedLanguage }
        : ''
    }
  });

  // Local states isSearching and results don't need to persist
  const [isSearching, setIsSearching] = useState(false);
  const [results, setResults] = useState([]);
  // Local state query will persist after being debounced
  // const [localQuery, setLocalQuery] = useState(selectedQuery || '');
  const localQuery = watch('query');
  const debouncedQuery = useDebounce(localQuery, 500);

  const onSearch = () => console.log('searching');

  // Call api when user stops typing
  useEffect(() => {
    if (debouncedQuery) {
      setIsSearching(true);
      setSelectedQuery(debouncedQuery);
      // TODO make api call
      onSearch();
      setIsSearching(false);
    } else {
      setResults([]);
    }
  }, [debouncedQuery]);

  return (
    <>
      <SearchContainer>
        <IconContainer>
          <OpenCloseChevron
            open={!isSearchSectionMinimized}
            onClick={toggleSearchSection}
          />
        </IconContainer>
        <Form onSubmit={handleSubmit(onSearch)}>
          <Input
            className="search-section-field"
            type="text"
            placeholder="Search"
            id="query"
            name="query"
            ref={register({ required: true })}
          />
          {!isSearchSectionMinimized && (
            <>
              {/* <Label htmlFor="repository">repository</Label> */}
              <Select
                className="search-section-field"
                name="repository"
                placeholder="Repository"
                control={control}
                rules={{ required: true }}
                options={repoOptions}
                onChange={(option) => {
                  console.log('set selected open repo', option);
                  setSelectedOpenRepo(option.value);
                }}
              />
              {/* <Label htmlFor="language">language</Label> */}
              <Suspense
                fallback={
                  <Select
                    className="search-section-field"
                    name="language"
                    placeholder="Language"
                    control={control}
                    options={{ value: '', label: 'Loading...' }}
                  />
                }
              >
                <LanguagesSelect
                  className="search-section-field"
                  name="language"
                  placeholder="Language"
                  control={control}
                  onChange={(option) => {
                    console.log('set selected language', option);
                    setSelectedLanguage(option.value);
                  }}
                />
              </Suspense>
            </>
          )}
        </Form>
      </SearchContainer>
      <Scrollbars
        style={{
          width: '100%',
          height: '100%'
        }}
        autoHideTimeout={500}
        autoHide
      >
        {isSearching && <div>Searching...</div>}
        <SectionContent>{results.map((result) => result.name)}</SectionContent>
      </Scrollbars>
    </>
  );
});
