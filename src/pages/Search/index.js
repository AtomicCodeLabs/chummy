import React, { Suspense, useEffect, useState } from 'react';
import { observer } from 'mobx-react-lite';
import { Scrollbars } from 'react-custom-scrollbars';
import { useForm } from 'react-hook-form';
import { toJS } from 'mobx';

import { SectionContent } from '../../components/Section';
import OpenCloseChevron from '../../components/OpenCloseChevron';
import {
  SearchContainer,
  Form,
  Label,
  Input,
  Select,
  Option
} from '../../components/Form';
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
  const { register, watch, handleSubmit } = useForm({
    defaultValues: {
      query: selectedQuery || '',
      repository: selectedOpenRepo || '',
      language: selectedLanguage || ''
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

  // Call api when user stop's typing
  useEffect(() => {
    if (debouncedQuery) {
      setIsSearching(true);
      setSelectedQuery(debouncedQuery);
      console.log('setting query', debouncedQuery);
      // TODO make api call
      onSearch();
      setIsSearching(false);
    } else {
      setResults([]);
    }
  }, [debouncedQuery]);

  console.log(
    'rendered search',
    toJS(openRepos),
    toJS(selectedOpenRepo),
    toJS(selectedLanguage)
  );

  return (
    <>
      <SearchContainer>
        <OpenCloseChevron
          open={!isSearchSectionMinimized}
          onClick={toggleSearchSection}
        />
        <Form onSubmit={handleSubmit(onSearch)}>
          <Input
            type="text"
            placeholder="Search"
            name="query"
            ref={register({ required: true })}
          />
          {!isSearchSectionMinimized && (
            <>
              <Label htmlFor="repository">repository</Label>
              <Select
                id="repository"
                name="repository"
                ref={register({ required: true })}
                onChange={(e) => {
                  setSelectedOpenRepo(e.target.value);
                }}
              >
                {Array.from(openRepos).map(([repoId, repo]) => (
                  <Option value={repoId} key={repoId}>
                    {repo.owner}/{repo.name}
                  </Option>
                ))}
              </Select>
              <Label htmlFor="language">language</Label>
              <Suspense
                fallback={
                  <Select id="language" name="language">
                    <Option value="">Loading...</Option>
                  </Select>
                }
              >
                <LanguagesSelect
                  ref={register}
                  onChange={(e) => {
                    setSelectedLanguage(e.target.value);
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
