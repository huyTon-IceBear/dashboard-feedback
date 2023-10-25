'use client';
import { useState, useCallback } from 'react';
import { gql, useQuery } from '@apollo/client';
// @mui
import { useTheme, alpha } from '@mui/material/styles';
import Tab from '@mui/material/Tab';
import Tabs from '@mui/material/Tabs';
import Card from '@mui/material/Card';
import Table from '@mui/material/Table';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import Divider from '@mui/material/Divider';
import Tooltip from '@mui/material/Tooltip';
import Container from '@mui/material/Container';
import TableBody from '@mui/material/TableBody';
import IconButton from '@mui/material/IconButton';
import TableContainer from '@mui/material/TableContainer';
// routes
import { paths } from 'src/routes/paths';
import { useRouter } from 'src/routes/hooks';
import { RouterLink } from 'src/routes/components';
// hooks
import { useBoolean } from 'src/hooks/use-boolean';
// utils
import { fTimestamp } from 'src/utils/format-time';
// _mock
import { _feedbacks, FEEDBACK_ISSUE_OPTIONS, FEEDBACK_ELEMENT_OPTIONS } from 'src/_mock';
// components
import Label from 'src/components/label';
import Iconify from 'src/components/iconify';
import Scrollbar from 'src/components/scrollbar';
import { ConfirmDialog } from 'src/components/custom-dialog';
import { useSettingsContext } from 'src/components/settings';
import CustomBreadcrumbs from 'src/components/custom-breadcrumbs';
import {
  useTable,
  getComparator,
  emptyRows,
  TableNoData,
  TableEmptyRows,
  TableHeadCustom,
  TableSelectedAction,
  TablePaginationCustom,
} from 'src/components/table';
// types
import {
  FeedbackDatagrids,
  FeedbackTableFilters,
  FeedbackTableFilterValue,
} from 'src/types/feedback';
//
import FeedbackTableRow from '../feedback-table-row';
import FeedbackTableToolbar from '../feedback-table-toolbar';
import FeedbackTableFiltersResult from '../feedback-table-filters-result';

// ----------------------------------------------------------------------

const TABLE_HEAD = [
  { id: 'createBy', label: 'Customer' },
  { id: 'type', label: 'Type' },
  { id: 'createAt', label: 'Create at' },
  { id: 'description', label: 'Description' },
  { id: '' },
];

const defaultFilters: FeedbackTableFilters = {
  name: '',
  type: 'all',
  issue: '',
  element: '',
  startDate: null,
};

// ----------------------------------------------------------------------

const GET_FEEDBACKS = gql`
  query GET_FEEDBACKS {
    feedback {
      id
      description
      element
      issue
      type
      created_at
      created_by
    }
  }
`;

export default function FeedbackListView() {
  const theme = useTheme();

  const settings = useSettingsContext();

  const router = useRouter();

  const table = useTable({ defaultOrderBy: 'createDate' });

  const confirm = useBoolean();

  const [tableData, setTableData] = useState<FeedbackDatagrids[]>([]);

  const [filters, setFilters] = useState(defaultFilters);

  const { loading } = useQuery(GET_FEEDBACKS, {
    onCompleted: (data) => {
      setTableData(data.feedback);
    },
  });

  const dataFiltered = applyFilter({
    inputData: tableData,
    comparator: getComparator(table.order, table.orderBy),
    filters,
  });

  const dataInPage = dataFiltered.slice(
    table.page * table.rowsPerPage,
    table.page * table.rowsPerPage + table.rowsPerPage
  );

  const denseHeight = table.dense ? 56 : 76;

  const canReset =
    !!filters.name ||
    filters.type !== 'all' ||
    filters.issue !== '' ||
    filters.element !== '' ||
    !!filters.startDate;

  const notFound = (!dataFiltered.length && canReset) || !dataFiltered.length;

  const getFeedbackLength = (type: string) =>
    tableData?.filter((item) => item.type === type).length;

  const TABS = [
    { value: 'all', label: 'All', color: 'default', count: tableData.length },
    {
      value: 'positive',
      label: 'Positive',
      color: 'success',
      count: getFeedbackLength('positive'),
    },
    {
      value: 'negative',
      label: 'Negative',
      color: 'error',
      count: getFeedbackLength('negative'),
    },
  ] as const;

  const handleFilters = useCallback(
    (name: string, value: FeedbackTableFilterValue) => {
      table.onResetPage();
      setFilters((prevState) => ({
        ...prevState,
        [name]: value,
      }));
    },
    [table]
  );

  const handleDeleteRow = useCallback(
    (id: string) => {
      const deleteRow = tableData.filter((row) => row.id !== id);
      setTableData(deleteRow);

      table.onUpdatePageDeleteRow(dataInPage.length);
    },
    [dataInPage.length, table, tableData]
  );

  const handleDeleteRows = useCallback(() => {
    const deleteRows = tableData.filter((row) => !table.selected.includes(row.id));
    setTableData(deleteRows);

    table.onUpdatePageDeleteRows({
      totalRows: tableData.length,
      totalRowsInPage: dataInPage.length,
      totalRowsFiltered: dataFiltered.length,
    });
  }, [dataFiltered.length, dataInPage.length, table, tableData]);

  const handleViewRow = useCallback(
    (id: string) => {
      router.push(paths.dashboard.feedback.details(id));
    },
    [router]
  );

  const handleFilterType = useCallback(
    (event: React.SyntheticEvent, newValue: string) => {
      handleFilters('type', newValue);
    },
    [handleFilters]
  );

  const handleResetFilters = useCallback(() => {
    setFilters(defaultFilters);
  }, []);

  return (
    <>
      <Container maxWidth={settings.themeStretch ? false : 'lg'}>
        <CustomBreadcrumbs
          heading="List"
          links={[
            {
              name: 'Dashboard',
              href: paths.dashboard.root,
            },
            {
              name: 'Feedback',
              href: paths.dashboard.feedback.root,
            },
            {
              name: 'List',
            },
          ]}
          sx={{
            mb: { xs: 3, md: 5 },
          }}
        />

        <Card>
          <Tabs
            value={filters.type}
            onChange={handleFilterType}
            sx={{
              px: 2.5,
              boxShadow: `inset 0 -2px 0 0 ${alpha(theme.palette.grey[500], 0.08)}`,
            }}
          >
            {TABS.map((tab) => (
              <Tab
                key={tab.value}
                value={tab.value}
                label={tab.label}
                iconPosition="end"
                icon={
                  <Label
                    variant={
                      ((tab.value === 'all' || tab.value === filters.type) && 'filled') || 'soft'
                    }
                    color={tab.color}
                  >
                    {tab.count}
                  </Label>
                }
              />
            ))}
          </Tabs>

          <FeedbackTableToolbar
            filters={filters}
            onFilters={handleFilters}
            //
            issueOptions={FEEDBACK_ISSUE_OPTIONS.map((issue) => issue.value)}
            elementOptions={FEEDBACK_ELEMENT_OPTIONS.map((element) => element.value)}
          />

          {canReset && (
            <FeedbackTableFiltersResult
              filters={filters}
              onFilters={handleFilters}
              //
              onResetFilters={handleResetFilters}
              //
              results={dataFiltered.length}
              sx={{ p: 2.5, pt: 0 }}
            />
          )}

          <TableContainer sx={{ position: 'relative', overflow: 'unset' }}>
            <TableSelectedAction
              dense={table.dense}
              numSelected={table.selected.length}
              rowCount={tableData.length}
              onSelectAllRows={(checked) =>
                table.onSelectAllRows(
                  checked,
                  tableData.map((row) => row.id)
                )
              }
              action={
                <Tooltip title="Delete">
                  <IconButton color="primary" onClick={confirm.onTrue}>
                    <Iconify icon="solar:trash-bin-trash-bold" />
                  </IconButton>
                </Tooltip>
              }
            />

            <Scrollbar>
              <Table size={table.dense ? 'small' : 'medium'} sx={{ minWidth: 800 }}>
                <TableHeadCustom
                  order={table.order}
                  orderBy={table.orderBy}
                  headLabel={TABLE_HEAD}
                  rowCount={tableData?.length ?? 0}
                  numSelected={table.selected.length}
                  onSort={table.onSort}
                  onSelectAllRows={(checked) =>
                    table.onSelectAllRows(checked, tableData?.map((row) => row.id))
                  }
                />

                <TableBody>
                  {dataFiltered
                    .slice(
                      table.page * table.rowsPerPage,
                      table.page * table.rowsPerPage + table.rowsPerPage
                    )
                    .map((row) => (
                      <FeedbackTableRow
                        key={row.id}
                        row={row}
                        selected={table.selected.includes(row.id)}
                        onSelectRow={() => table.onSelectRow(row.id)}
                        onViewRow={() => handleViewRow(row.id)}
                        onDeleteRow={() => handleDeleteRow(row.id)}
                      />
                    ))}

                  <TableEmptyRows
                    height={denseHeight}
                    emptyRows={emptyRows(table.page, table.rowsPerPage, tableData.length)}
                  />

                  <TableNoData notFound={notFound} />
                </TableBody>
              </Table>
            </Scrollbar>
          </TableContainer>

          <TablePaginationCustom
            count={dataFiltered.length}
            page={table.page}
            rowsPerPage={table.rowsPerPage}
            onPageChange={table.onChangePage}
            onRowsPerPageChange={table.onChangeRowsPerPage}
            //
            dense={table.dense}
            onChangeDense={table.onChangeDense}
          />
        </Card>
      </Container>

      <ConfirmDialog
        open={confirm.value}
        onClose={confirm.onFalse}
        title="Delete"
        content={
          <>
            Are you sure want to delete <strong> {table.selected.length} </strong> items?
          </>
        }
        action={
          <Button
            variant="contained"
            color="error"
            onClick={() => {
              handleDeleteRows();
              confirm.onFalse();
            }}
          >
            Delete
          </Button>
        }
      />
    </>
  );
}

// ----------------------------------------------------------------------

function applyFilter({
  inputData,
  comparator,
  filters,
}: {
  inputData: FeedbackDatagrids[];
  comparator: (a: any, b: any) => number;
  filters: FeedbackTableFilters;
}) {
  const { name, type, issue, element, startDate } = filters;

  const stabilizedThis = inputData.map((el, index) => [el, index] as const);

  stabilizedThis.sort((a, b) => {
    const order = comparator(a[0], b[0]);
    if (order !== 0) return order;
    return a[1] - b[1];
  });

  inputData = stabilizedThis.map((el) => el[0]);

  if (name) {
    inputData = inputData.filter(
      (feedback) =>
        feedback.created_by.toLowerCase().indexOf(name.toLowerCase()) !== -1 ||
        feedback.description.toLowerCase().indexOf(name.toLowerCase()) !== -1
    );
  }

  if (type !== 'all') {
    inputData = inputData.filter((feedback) => feedback.type === type);
  }

  if (issue !== '') {
    inputData = inputData.filter((feedback) => feedback.issue === issue);
  }

  if (element !== '') {
    inputData = inputData.filter((feedback) => feedback.element === element);
  }

  if (startDate) {
    inputData = inputData.filter(
      (feedback) => fTimestamp(feedback.created_at) >= fTimestamp(startDate)
    );
  }

  return inputData;
}
