import React, {
  Suspense,
  useEffect,
  useState,
  useMemo,
  useCallback
} from 'react';
import { observer } from 'mobx-react-lite';
import { useForm } from 'react-hook-form';
import { KebabHorizontalIcon } from '@primer/octicons-react';
import loadable from '@loadable/component';

import { SectionContent } from '../../components/Section';
import OpenCloseChevron from '../../components/OpenCloseChevron';
import {
  HeaderContainer,
  FormContainer,
  FormResultsDescriptionContainer,
  Form,
  HideContainer,
  Label
} from '../../components/Form';
import Input from '../../components/Form/Input';
import { ControlledSelect } from '../../components/Form/Select';
import Scrollbars from '../../components/Scrollbars';
import { checkCurrentUser } from '../../hooks/dao';
import useOctoDAO from '../../hooks/octokit';
import { useUiStore, useFileStore } from '../../hooks/store';
import useDebounce from '../../hooks/useDebounce';
import { isBlank } from '../../utils';
import { redirectToUrl } from '../../utils/browser';
import SearchResultFileNode from '../../components/Node/SearchResultFileNode';
import { A } from '../../components/Text';
import { GITHUB_URLS } from '../../global/constants';

const LanguagesSelect = loadable(() => import('./LanguagesSelect'));

export default observer(() => {
  checkCurrentUser();
  const octoDAO = useOctoDAO();
  const { openRepos } = useFileStore();
  const {
    addPendingRequest,
    removePendingRequest,
    isSearchSectionMinimized,
    toggleSearchSection,
    selectedQueryFilename,
    setSelectedQueryFilename,
    selectedQueryCode,
    setSelectedQueryCode,
    selectedQueryPath,
    setSelectedQueryPath,
    selectedOpenRepo,
    setSelectedOpenRepo,
    selectedLanguage,
    setSelectedLanguage
  } = useUiStore();
  const [atScrollTop, setAtScrollTop] = useState(true); // to render shadow under search box

  // @computed repo options
  const repoOptions = useMemo(
    () =>
      Array.from(openRepos).map(([repoId, repo]) => ({
        value: `${repoId}:${repo.defaultBranch}`, // Separated with :
        label: `${repo.owner}/${repo.name}`
      })),
    [openRepos.size]
  );

  const { control, register, watch, handleSubmit } = useForm({
    defaultValues: {
      queryFilename: selectedQueryFilename || '',
      queryCode: selectedQueryCode || '',
      queryPath: selectedQueryPath || '',
      repository: selectedOpenRepo
        ? repoOptions.filter((o) => o?.value === selectedOpenRepo)[0] // https://stackoverflow.com/questions/43495696/how-to-set-a-default-value-in-react-select
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
  const localQueryFilename = watch('queryFilename');
  const localQueryCode = watch('queryCode');
  const localQueryPath = watch('queryPath');
  const debouncedQueryFilename = useDebounce(localQueryFilename, 700);
  const debouncedQueryCode = useDebounce(localQueryCode, 700);
  const debouncedQueryPath = useDebounce(localQueryPath, 700);

  const isWellFormed = useMemo(
    () =>
      (!isBlank(debouncedQueryFilename) || !isBlank(debouncedQueryCode)) &&
      !isBlank(repository) &&
      !isBlank(language),
    [debouncedQueryFilename, debouncedQueryCode, repository, language]
  );

  // Search API call
  const onSearch = useCallback(async () => {
    addPendingRequest('Search');
    const parsedRepo = repository.value.split(':'); // alexkim205:master
    const responseNodes = await octoDAO.searchCode(
      parsedRepo[0],
      parsedRepo[1],
      debouncedQueryFilename,
      debouncedQueryCode,
      debouncedQueryPath,
      language.value.toLowerCase()
    );
    setResults(responseNodes);
    removePendingRequest('Search');
  }, [
    debouncedQueryFilename,
    debouncedQueryCode,
    debouncedQueryPath,
    repository,
    language
  ]);

  // Call api when user stops typing
  useEffect(() => {
    setSelectedQueryFilename(debouncedQueryFilename);
    setSelectedQueryCode(debouncedQueryCode);
    setSelectedQueryPath(debouncedQueryPath);
    setSelectedOpenRepo(repository.value);
    setSelectedLanguage(language.value);

    if (isWellFormed) {
      // TODO make api call
      onSearch();
    } else {
      setResults(false);
    }
  }, [
    debouncedQueryFilename,
    debouncedQueryCode,
    debouncedQueryPath,
    repository,
    language
  ]);

  return (
    <>
      <HeaderContainer hasShadow={!atScrollTop}>
        <FormContainer>
          <OpenCloseChevron
            open={!isSearchSectionMinimized}
            onClick={toggleSearchSection}
            highlightOnHover
            Icon={<KebabHorizontalIcon />}
            startDeg={90}
            noRotate
          />
          <Form onSubmit={handleSubmit(onSearch)}>
            <Label htmlFor="queryFilename">Filename</Label>
            <Input
              className="input-field"
              type="text"
              placeholder=""
              id="queryFilename"
              name="queryFilename"
              ref={register({ required: true })}
              // icon={
              //   <ExternalLink to={GITHUB_URLS.SEARCH_QUERY}>
              //     <QuestionIcon size={14} verticalAlign="middle" />
              //   </ExternalLink>
              // }
            />
            <Label htmlFor="repository">Repository</Label>
            <ControlledSelect
              className={`input-field ${
                isSearchSectionMinimized && 'is-technically-last'
              }`}
              name="repository"
              placeholder="Repository"
              control={control}
              rules={{ required: true }}
              options={repoOptions}
            />
            <HideContainer isHidden={isSearchSectionMinimized}>
              <Label htmlFor="queryCode">Search in code</Label>
              <Input
                className="input-field"
                type="text"
                placeholder=""
                id="queryCode"
                name="queryCode"
                ref={register({ required: true })}
              />
              <Label htmlFor="queryCode">In path</Label>
              <Input
                className="input-field"
                type="text"
                placeholder=""
                id="queryPath"
                name="queryPath"
                ref={register({ required: true })}
              />
              <Label htmlFor="language">Language</Label>
              <Suspense
                fallback={
                  <ControlledSelect
                    className="input-field"
                    name="language"
                    placeholder="Language"
                    control={control}
                    options={{ value: '', label: 'Loading...' }}
                  />
                }
              >
                <LanguagesSelect
                  className="input-field"
                  name="language"
                  placeholder="Language"
                  control={control}
                />
              </Suspense>
            </HideContainer>
          </Form>
        </FormContainer>
        <FormResultsDescriptionContainer>
          {isWellFormed &&
            Array.isArray(results) && // so that 0 results doesn't show up while pending
            (results.length ? (
              `${results.reduce(
                (numResults, file) =>
                  numResults +
                  file.text_matches.reduce(
                    (numTextMatches, textMatch) =>
                      numTextMatches + textMatch.matches.length,
                    0
                  ),
                0
              )} results in ${results.length} files`
            ) : (
              <>
                0 results.{' '}
                <A onClick={() => redirectToUrl(GITHUB_URLS.REPO_INDEXING)}>
                  Repository may not be indexed.
                </A>
              </>
            ))}
        </FormResultsDescriptionContainer>
      </HeaderContainer>
      <Scrollbars
        onScrollFrame={({ top }) => {
          if (top === 0) {
            // At top of page
            setAtScrollTop(true);
          } else if (atScrollTop) {
            setAtScrollTop(false);
          }
        }}
      >
        <SectionContent>
          {results &&
            results.map((file) => {
              const parsedRepo = repository.value.split(':');
              return (
                <SearchResultFileNode
                  file={{
                    ...file,
                    repo: {
                      owner: parsedRepo[0],
                      name: parsedRepo[1],
                      defaultBranch: parsedRepo[2]
                    },
                    queryFilename: debouncedQueryFilename,
                    queryCode: debouncedQueryCode
                  }}
                  key={file.path}
                />
              );
            })}
        </SectionContent>
      </Scrollbars>
    </>
  );
});
