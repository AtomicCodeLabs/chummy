import React, { useEffect, useState, useMemo, useCallback } from 'react';
import { observer } from 'mobx-react-lite';
import { Scrollbars } from 'react-custom-scrollbars';
import { useForm } from 'react-hook-form';

import { SectionContent } from '../../components/Section';
import OpenCloseChevron from '../../components/OpenCloseChevron';
import {
  HeaderContainer,
  FormContainer,
  FormResultsDescriptionContainer,
  Form
} from '../../components/Form';
import Input from '../../components/Form/Input';
import { checkCurrentUser } from '../../hooks/firebase';
import { useUiStore, useFileStore } from '../../hooks/store';
import useDebounce from '../../hooks/useDebounce';
import { isBlank } from '../../utils';
import SearchResultFileNode from '../../components/Node/SearchResultFileNode';

export default observer(() => {
  checkCurrentUser();
  // const firebase = useFirebaseDAO();
  const { clearOpenSearchResultFiles } = useFileStore();
  const {
    setPending,
    isSearchSectionMinimized,
    toggleSearchSection,
    selectedQuery,
    setSelectedQuery
  } = useUiStore();
  const [atScrollTop, setAtScrollTop] = useState(true); // to render shadow under search box

  const { register, watch, handleSubmit } = useForm({
    defaultValues: {
      query: selectedQuery || ''
    }
  });

  const [results, setResults] = useState(false);
  // Local state query will persist after being debounced
  // const [localQuery, setLocalQuery] = useState(selectedQuery || '');
  const localQuery = watch('query');
  const debouncedQuery = useDebounce(localQuery, 700);

  const isWellFormed = useMemo(() => !isBlank(debouncedQuery), [
    debouncedQuery
  ]);

  // Search API call
  const onSearch = useCallback(async () => {
    setPending('Bookmarks');
    // const parsedRepo = repository.value.split(':'); // alexkim205:master
    // const responseNodes = await octoDAO.searchCode(
    //   parsedRepo[0],
    //   parsedRepo[1],
    //   debouncedQuery,
    //   language.value.toLowerCase()
    // );
    // setResults(responseNodes);
    setPending('None');
  }, [debouncedQuery]);

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
  }, [debouncedQuery]);

  return (
    <>
      <HeaderContainer hasShadow={!atScrollTop}>
        <FormContainer>
          <OpenCloseChevron
            open={!isSearchSectionMinimized}
            onClick={toggleSearchSection}
            highlightOnHover
          />
          <Form onSubmit={handleSubmit(onSearch)}>
            <Input
              className="search-section-field"
              type="text"
              placeholder="Search"
              id="query"
              name="query"
              ref={register({ required: true })}
              // icon={
              //   <ExternalLink to={GITHUB_URLS.SEARCH_QUERY}>
              //     <QuestionIcon size={14} verticalAlign="middle" />
              //   </ExternalLink>
              // }
            />
            {/* <Label htmlFor="repository">repository</Label> */}
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
      </HeaderContainer>
      <Scrollbars
        style={{
          width: '100%',
          height: '100%'
        }}
        onScrollFrame={({ top }) => {
          if (top === 0) {
            // At top of page
            setAtScrollTop(true);
          } else if (atScrollTop) {
            setAtScrollTop(false);
          }
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
