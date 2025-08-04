import React, { useMemo, useState } from 'react';
import {
  useReactTable,
  getCoreRowModel,
  getFilteredRowModel,
  getSortedRowModel,
  getPaginationRowModel,
  type ColumnDef,
  type SortingState,
  flexRender,
} from '@tanstack/react-table';

import { Button } from './ui/button';
import { Input } from './ui/input';
import { deleteTransaction } from '../Services/api';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import TransactionForm from './TransactionForm';

export type Transaction = {
  id: string;
  amount: number;
  type: 'income' | 'expense';
  category: string;
  date: string;
  note: string;
};

type Props = {
  transactions: Transaction[];
  onDelete: () => void;
  onUpdate?: () => void;
};

const globalFilterFn = (row: any, columnId: string, filterValue: string) => {
  const value = String(row.getValue(columnId)).toLowerCase();
  return value.includes(filterValue.toLowerCase());
};

const SortableHeader = ({ column, label }: { column: any; label: string }) => (
  <div className="flex items-center">
    {label}
    {column.getCanSort() && (
      <button
        type="button"
        onClick={column.getToggleSortingHandler()}
        className="ml-1 text-xs text-gray-500"
      >
        {column.getIsSorted() === 'asc'
          ? '↑'
          : column.getIsSorted() === 'desc'
          ? '↓'
          : '⇅'}
      </button>
    )}
  </div>
);

const Modal = ({
  isOpen,
  onClose,
  children,
}: {
  isOpen: boolean;
  onClose: () => void;
  children: React.ReactNode;
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded-lg max-w-md w-full mx-4 max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold">Edit Transaction</h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 text-xl"
          >
            ×
          </button>
        </div>
        {children}
      </div>
    </div>
  );
};

const TransactionTable: React.FC<Props> = ({ transactions, onDelete, onUpdate }) => {
  const [sorting, setSorting] = useState<SortingState>([]);
  const [globalFilter, setGlobalFilter] = useState('');
  const [editingTransaction, setEditingTransaction] = useState<Transaction | null>(null);

  const handleEditSuccess = () => {
    setEditingTransaction(null);
    onUpdate?.();
  };

  const handleEditCancel = () => {
    setEditingTransaction(null);
  };

  const columns = useMemo<ColumnDef<Transaction>[]>(() => [
    {
      accessorKey: 'amount',
      header: ({ column }) => <SortableHeader column={column} label="Amount" />,
      filterFn: globalFilterFn,
      cell: ({ row }) => `${row.original.amount.toFixed(2)}`,
    },
    {
      accessorKey: 'type',
      header: ({ column }) => <SortableHeader column={column} label="Type" />,
      filterFn: globalFilterFn,
      cell: ({ row }) => (
        <span
          className={`px-2 py-1 rounded text-xs font-medium ${
            row.original.type === 'income'
              ? 'bg-green-100 text-green-800'
              : 'bg-red-100 text-red-800'
          }`}
        >
          {row.original.type}
        </span>
      ),
    },
    {
      accessorKey: 'category',
      header: ({ column }) => <SortableHeader column={column} label="Category" />,
      filterFn: globalFilterFn,
    },
    {
      accessorKey: 'date',
      header: ({ column }) => <SortableHeader column={column} label="Date" />,
      filterFn: globalFilterFn,
    },
    {
      accessorKey: 'note',
      header: ({ column }) => <SortableHeader column={column} label="Note" />,
      filterFn: globalFilterFn,
    },
    {
      id: 'actions',
      header: 'Actions',
      enableSorting: false,
      cell: ({ row }) => (
        <div className="flex flex-wrap gap-2">
          <Button onClick={() => setEditingTransaction(row.original)}>
            Edit
          </Button>
          <Button
            variant="destructive"
            onClick={async () => {
              try {
                await deleteTransaction(row.original.id);
                toast.success('Transaction deleted');
                onDelete();
              } catch (err) {
                console.error('Delete failed:', err);
                toast.error('Failed to delete transaction');
              }
            }}
          >
            Delete
          </Button>
        </div>
      ),
    },
  ], [onDelete]);

  const table = useReactTable({
    data: transactions,
    columns,
    state: {
      sorting,
      globalFilter,
    },
    onSortingChange: setSorting,
    onGlobalFilterChange: setGlobalFilter,
    globalFilterFn,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    initialState: {
      pagination: { pageSize: 10 },
    },
  });

  return (
    <div className="w-full">
      <Input
        placeholder="Search..."
        value={globalFilter}
        onChange={(e) => setGlobalFilter(e.target.value)}
        className="mb-4"
      />

      <div className="w-full overflow-x-auto">
        <table className="min-w-full border-collapse text-sm">
          <thead>
            {table.getHeaderGroups().map((group) => (
              <tr key={group.id}>
                {group.headers.map((header) => (
                  <th
                    key={header.id}
                    className="p-2 border text-left whitespace-nowrap bg-gray-100"
                  >
                    {flexRender(header.column.columnDef.header, header.getContext())}
                  </th>
                ))}
              </tr>
            ))}
          </thead>

          <tbody>
            {table.getRowModel().rows.map((row) => (
              <tr key={row.id} className="border hover:bg-gray-50">
                {row.getVisibleCells().map((cell) => (
                  <td
                    key={cell.id}
                    className="p-2 border whitespace-nowrap text-gray-700"
                  >
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="flex flex-wrap items-center justify-between gap-2 mt-4 text-sm">
        <Button onClick={() => table.previousPage()} disabled={!table.getCanPreviousPage()}>
          Previous
        </Button>
        <span>
          Page {table.getState().pagination.pageIndex + 1} of {table.getPageCount()}
        </span>
        <Button onClick={() => table.nextPage()} disabled={!table.getCanNextPage()}>
          Next
        </Button>
      </div>

      {/* Edit Modal */}
      <Modal isOpen={!!editingTransaction} onClose={handleEditCancel}>
        {editingTransaction && (
          <TransactionForm
            editTransaction={editingTransaction}
            onSuccess={handleEditSuccess}
            onCancel={handleEditCancel}
          />
        )}
      </Modal>
    </div>
  );
};

export default TransactionTable;
