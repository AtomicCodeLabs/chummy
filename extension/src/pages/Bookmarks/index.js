import React, { useEffect, useState, useMemo } from 'react';
import { observer } from 'mobx-react-lite';
import { useForm } from 'react-hook-form';
import { KebabHorizontalIcon } from '@primer/octicons-react';

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
import BookmarkRepoNode from '../../components/Node/BookmarkRepoNode';
import Scrollbars from '../../components/Scrollbars';
import { checkCurrentUser } from '../../hooks/dao';
import { useUiStore, useUserStore } from '../../hooks/store';
import useDebounce from '../../hooks/useDebounce';
import { getBookmarkResultsDescription, useSearchableBookmarks } from './util';

export default observer(() => {
  checkCurrentUser();
  const { userBookmarks, numOfBookmarks } = useUserStore();
  const {
    addPendingRequest,
    removePendingRequest,
    isBookmarksSectionMinimized,
    toggleBookmarksSection,
    selectedBookmarkQuery,
    setSelectedBookmarkQuery,
    selectedBookmarkRepo,
    setSelectedBookmarkRepo
  } = useUiStore();
  const [atScrollTop, setAtScrollTop] = useState(true); // to render shadow under search box

  // @computed repo options
  const repoOptions = useMemo(
    () => [
      { value: '', label: 'All repositories' },
      ...Array.from(userBookmarks).map(([repoId, repo]) => ({
        value: repoId,
        label: `${repo.owner}/${repo.name}`
      }))
    ],
    [userBookmarks.size]
  );

  // Form stuff
  const { control, register, watch } = useForm({
    defaultValues: {
      query: selectedBookmarkQuery || '',
      repository: selectedBookmarkRepo
        ? repoOptions.filter((o) => o.value === selectedBookmarkRepo)[0]
        : repoOptions.length && repoOptions[0]
    }
  });
  const repository = watch('repository');

  // Update fused bookmarks array only when bookmarks
  // are added or removed
  const { bookmarkRepoResults, searchBookmarks } = useSearchableBookmarks(
    userBookmarks,
    numOfBookmarks,
    repository.value
  );

  // Local state query will persist after being debounced
  const localQuery = watch('query');
  const debouncedQuery = useDebounce(localQuery, 700);

  // Call api when user stops typing
  useEffect(() => {
    const onSearch = async () => {
      addPendingRequest('Bookmarks');
      await searchBookmarks(debouncedQuery);
      // setResults(responseNodes);
      removePendingRequest('Bookmarks');
    };
    setSelectedBookmarkQuery(debouncedQuery);
    setSelectedBookmarkRepo(repository.value);

    // closeAllUserBookmarksRepos(); // clear open states of bookmarks
    // TODO make api call
    onSearch();
  }, [debouncedQuery, repository, numOfBookmarks]);

  return (
    <>
      <HeaderContainer hasShadow={!atScrollTop}>
        <FormContainer>
          <OpenCloseChevron
            open={!isBookmarksSectionMinimized}
            onClick={toggleBookmarksSection}
            highlightOnHover
            Icon={<KebabHorizontalIcon />}
            startDeg={90}
            noRotate
          />
          <Form>
            <Label htmlFor="query">Search</Label>
            <Input
              className={`input-field ${
                isBookmarksSectionMinimized && 'is-technically-last'
              }`}
              type="text"
              placeholder=""
              id="query"
              name="query"
              ref={register({ required: true })}
              // icon={
              //   <ExternalLink to={GITHUB_URLS.SEARCH_QUERY}>
              //     <QuestionIcon size={14} verticalAlign="middle" />
              //   </ExternalLink>
              // }
            />
            <HideContainer isHidden={isBookmarksSectionMinimized}>
              <Label htmlFor="repository">Repository</Label>
              <ControlledSelect
                className="input-field"
                name="repository"
                placeholder="Repository"
                control={control}
                rules={{ required: true }}
                options={repoOptions}
                onChange={(option) => {
                  setSelectedBookmarkRepo(option.value);
                }}
              />
            </HideContainer>
          </Form>
        </FormContainer>
        <FormResultsDescriptionContainer>
          {getBookmarkResultsDescription(bookmarkRepoResults)}
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
          {bookmarkRepoResults &&
            Object.entries(bookmarkRepoResults).map(
              ([repoKey]) =>
                userBookmarks.has(repoKey) && (
                  <BookmarkRepoNode
                    key={repoKey}
                    repo={userBookmarks.get(repoKey)}
                    repoMatches={bookmarkRepoResults[repoKey]}
                  />
                )
            )}
        </SectionContent>
      </Scrollbars>
    </>
  );
});
