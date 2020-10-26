import React, {
  Suspense,
  useEffect,
  useState,
  useMemo,
  useCallback
} from 'react';
import { observer } from 'mobx-react-lite';
import { Scrollbars } from 'react-custom-scrollbars';
import { useForm } from 'react-hook-form';
import { QuestionIcon } from '@primer/octicons-react';

import { SectionContent } from '../../components/Section';
import OpenCloseChevron from '../../components/OpenCloseChevron';
import {
  FormContainer,
  FormResultsDescriptionContainer,
  IconContainer,
  Form,
  HideContainer
} from '../../components/Form';
import Input from '../../components/Form/Input';
import Select from '../../components/Form/Select';
import { checkCurrentUser } from '../../hooks/firebase';
import useOctoDAO from '../../hooks/octokit';
import { useUiStore, useFileStore } from '../../hooks/store';
import useDebounce from '../../hooks/useDebounce';
import { isBlank } from '../../utils';
import SearchResultFileNode from '../../components/Node/SearchResultFileNode';
import ExternalLink from '../../components/ExternalLink';
import { GITHUB_URLS } from '../../constants/urls';

const LanguagesSelect = React.lazy(() => import('./LanguagesSelect'));

export default observer(() => {
  checkCurrentUser();
  const octoDAO = useOctoDAO();
  const { openRepos, clearOpenSearchResultFiles } = useFileStore();
  const {
    isPending,
    setPending,
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

  const { control, register, watch, handleSubmit } = useForm({
    defaultValues: {
      query: selectedQuery || '',
      repository: selectedOpenRepo
        ? repoOptions.filter((o) => o.value === selectedOpenRepo)[0] // https://stackoverflow.com/questions/43495696/how-to-set-a-default-value-in-react-select
        : repoOptions.length && repoOptions[0],
      language: selectedLanguage
        ? { label: selectedLanguage, value: selectedLanguage }
        : { label: 'All languages', value: '' }
    }
  });
  const repository = watch('repository');
  const language = watch('language');

  const [results, setResults] = useState(false);
  // Local state query will persist after being debounced
  // const [localQuery, setLocalQuery] = useState(selectedQuery || '');
  const localQuery = watch('query');
  const debouncedQuery = useDebounce(localQuery, 700);

  const isWellFormed = useMemo(
    () =>
      !isBlank(debouncedQuery) && !isBlank(repository) && !isBlank(language),
    [debouncedQuery, repository, language]
  );

  // Search API call
  const onSearch = useCallback(async () => {
    console.log('searching...', debouncedQuery, repository, language);
    setPending('Search');
    const parsedRepo = repository.value.split(':'); // alexkim205:master
    const responseNodes = await octoDAO.searchCode(
      parsedRepo[0],
      parsedRepo[1],
      debouncedQuery,
      language.value.toLowerCase()
    );
    setResults(responseNodes);
    setPending('None');
  }, [debouncedQuery, repository, language]);

  // Call api when user stops typing
  useEffect(() => {
    if (isWellFormed) {
      clearOpenSearchResultFiles(); // clear open states of search results
      setSelectedQuery(debouncedQuery);
      // TODO make api call
      onSearch();
    } else {
      setResults(false);
    }
  }, [debouncedQuery, repository, language]);

  return (
    <>
      <FormContainer>
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
            icon={
              <ExternalLink to={GITHUB_URLS.SEARCH_QUERY}>
                <QuestionIcon size={14} verticalAlign="middle" />
              </ExternalLink>
            }
          />
          {/* <Label htmlFor="repository">repository</Label> */}
          <Select
            className={`search-section-field ${
              isSearchSectionMinimized && 'is-technically-last'
            }`}
            name="repository"
            placeholder="Repository"
            control={control}
            rules={{ required: true }}
            options={repoOptions}
            onChange={(option) => {
              setSelectedOpenRepo(option.value);
            }}
          />
          <HideContainer isHidden={isSearchSectionMinimized}>
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
          </HideContainer>
        </Form>
      </FormContainer>
      <FormResultsDescriptionContainer>
        {isWellFormed &&
          Array.isArray(results) && // so that 0 results doesn't show up while pending
          (results.length
            ? `${results.reduce(
                (numResults, file) =>
                  numResults +
                  file.text_matches.reduce(
                    (numTextMatches, textMatch) =>
                      numTextMatches + textMatch.matches.length,
                    0
                  ),
                0
              )} results in ${results.length} files`
            : '0 results')}
      </FormResultsDescriptionContainer>
      <Scrollbars
        style={{
          width: '100%',
          height: '100%'
        }}
        autoHideTimeout={500}
        autoHide
      >
        <SectionContent>
          {results &&
            results.map((file) => (
              <SearchResultFileNode file={file} key={file.path} />
            ))}
        </SectionContent>
      </Scrollbars>
    </>
  );
});
