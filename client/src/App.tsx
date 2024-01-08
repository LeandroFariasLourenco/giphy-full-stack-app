import { useCallback, useEffect, useMemo, useState } from 'react';
import './App.css';

import '@fontsource/roboto/300.css';
import '@fontsource/roboto/400.css';
import '@fontsource/roboto/500.css';
import '@fontsource/roboto/700.css';

import { DarkMode, Delete, LightMode, Search } from '@mui/icons-material';
import { Autocomplete, Box, Button, Chip, CssBaseline, FormControl, Grid, IconButton, ImageList, ImageListItem, ImageListItemBar, InputLabel, ListSubheader, MenuItem, Modal, Pagination, Select, TextField, Typography, createTheme, useMediaQuery } from '@mui/material';
import { useForm } from 'react-hook-form';
import { useHistory, useSearch, useUser } from './hooks';
import { SearchResult } from './models';
import { ThemeProvider } from '@emotion/react';

interface FormData {
  query: string;
}

const App = () => {
  const {
    fetchResults,
    searchResult,
    loading: loadingSearch,
    setCurrentPage,
    currentPage,
    setItemsPerPage,
    itemsPerPage,
    currentTerm,
  } = useSearch({ initialPage: 1, defaultItemsPerPage: 10 });
  const {
    deleteHistory,
    getHistoryByUserId,
    history,
    updateHistory,
    loading: loadingHistory
  } = useHistory();
  const {
    register,
    handleSubmit,
    getValues,
    setValue,
    watch,
  } = useForm<FormData>({
    defaultValues: { query: '' },
  });
  const prefersDarkMode = useMediaQuery('(prefers-color-scheme: dark)');
  const { shouldCreate, userId } = useUser();
  const [showRemoveHistoryModal, setShowRemoveHistoryModal] = useState<boolean>(false);
  const [darkMode, setDarkMode] = useState<boolean>(prefersDarkMode);
  const theme = useMemo(
    () =>
      createTheme({
        palette: {
          mode: darkMode ? 'dark' : 'light',
        },
      }),
    [darkMode],
  );

  useEffect(() => {
    if (!userId) return;
    getHistoryByUserId(userId!);
  }, [userId]);

  useEffect(() => {
    shouldCreate();
  }, []);

  const submitSearch = useCallback(async ({ query }: FormData) => {
    fetchResults(query, 1);
    setCurrentPage(1);

    if (!history.includes(query)) {
      await updateHistory(userId!, query);
      getHistoryByUserId(userId!);
    }
  }, [history, fetchResults, setCurrentPage, getHistoryByUserId, updateHistory, userId]);

  const renderImage = useCallback(({ images, title, id, username }: SearchResult) => (
    <ImageListItem key={id}>
      <img loading="lazy" src={images.original.url} title={title} alt={title} />
      <ImageListItemBar
        title={title}
        subtitle={`@${username}`}
      />
    </ImageListItem>
  ), []);

  const handlePageChange = useCallback((event: React.ChangeEvent<unknown>, page: number) => {
    setCurrentPage(page);
    fetchResults(getValues('query'), page);
  }, [setCurrentPage, fetchResults, getValues]);

  const clearSearch = useCallback(() => {
    fetchResults();
    setValue('query', '');
  }, [fetchResults, setValue]);

  const handleDeleteHistory = useCallback(async () => {
    await deleteHistory(userId!);
    getHistoryByUserId(userId!);
    setShowRemoveHistoryModal(false)
  }, [userId, deleteHistory, getHistoryByUserId]);

  const renderChip = useCallback(() => (
    <Chip onDelete={clearSearch} label={currentTerm} />
  ), [currentTerm, clearSearch]);

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Grid container item xs={12} justifyContent="center">
        <Grid item xs={6}>
          <form onSubmit={handleSubmit(submitSearch)}>
            <Grid container gap={5} justifyContent="center">
              {history?.length ? (
                <>
                  <Button
                    startIcon={<Delete />}
                    disabled={loadingSearch || loadingHistory}
                    variant='contained'
                    onClick={() => setShowRemoveHistoryModal(true)}
                    color="error"
                    title="Delete history"
                  >
                    Delete history
                  </Button>
                  <Modal
                    open={showRemoveHistoryModal}
                    onClose={() => setShowRemoveHistoryModal(false)}
                  >
                    <Box sx={{
                      position: 'absolute' as 'absolute',
                      top: '50%',
                      left: '50%',
                      transform: 'translate(-50%, -50%)',
                      width: 400,
                      bgcolor: 'background.paper',
                      border: '2px solid #000',
                      boxShadow: 24,
                      p: 4,
                    }}>
                      <Typography component="h4" color="error" variant="h4">Warning</Typography>
                      <Typography sx={{ mt: 2 }}>You're about to delete your <strong>entire</strong> search history, are you sure?</Typography>
                      <Grid container justifyContent="space-around" marginTop={2}>
                        <Button disabled={loadingHistory} sx={{ width: 100 }} variant="contained" color="error" onClick={handleDeleteHistory}>Yes</Button>
                        <Button disabled={loadingHistory} sx={{ width: 100 }} variant="contained" color="secondary" onClick={() => setShowRemoveHistoryModal(false)}>No</Button>
                      </Grid>
                    </Box>
                  </Modal>
                </>
              ) : null}
              <Autocomplete
                options={history}
                noOptionsText="No search history"
                sx={{ width: 200 }}
                freeSolo
                onChange={(_, value) => {
                  setValue('query', value!);
                }}
                renderInput={(params) => (
                  <TextField
                    {...register('query')}
                    {...params}
                    variant="filled"
                    disabled={loadingSearch}
                    label="Search term"
                  />
                )} />
              <FormControl variant="filled">
                <InputLabel>Images per page</InputLabel>
                <Select
                  disabled={loadingSearch || loadingHistory}
                  sx={{ width: 200 }}
                  value={itemsPerPage}
                  onChange={({ target: { value } }) => setItemsPerPage(value as number)}
                >
                  <MenuItem value={10}>10</MenuItem>
                  <MenuItem value={20}>20</MenuItem>
                  <MenuItem value={50}>50</MenuItem>
                </Select>
              </FormControl>
              <Button endIcon={<Search />} type="submit" title="Search" disabled={!watch('query') || loadingSearch || loadingHistory} variant="contained">Search</Button>

              <IconButton color="secondary" onClick={() => setDarkMode((darkMode) => !darkMode)}>{darkMode ? <DarkMode /> : <LightMode />}</IconButton>
            </Grid>
          </form>
        </Grid>

        <Grid xs={10} item container justifyContent="center">
          {!searchResult || !currentTerm ? null : !searchResult.data.length ? (
            <Grid container justifyContent="center" xs={12}>
              <Typography sx={{ marginTop: 5 }}>No results found for: {renderChip()}</Typography>
            </Grid>
          ) : (
            <>
              <Grid xs={10} item justifyContent="center">
                <ImageList cols={3}>
                  <ImageListItem key="subheader" cols={3}>
                    <ListSubheader component="div">Showing results for: {renderChip()}</ListSubheader>
                  </ImageListItem>
                  {searchResult.data.map(renderImage)}
                </ImageList>
              </Grid>
              <Grid xs={10} item justifyContent="center">
                <Pagination
                  showFirstButton
                  showLastButton
                  page={currentPage}
                  onChange={handlePageChange}
                  count={searchResult?.pagination.count}
                  disabled={loadingSearch}
                />
              </Grid>
            </>
          )}
        </Grid>
      </Grid>
    </ThemeProvider>
  );
}

export default App;

