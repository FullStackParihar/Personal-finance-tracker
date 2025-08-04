import React from 'react';
import { useForm } from 'react-hook-form';
import { createTransaction, updateTransaction } from '../Services/api';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

type TransactionFormInputs = {
  amount: number;
  type: 'income' | 'expense';
  category: string;
  date: string;
  note: string;
};

export type Transaction = {
  id: string;
  amount: number;
  type: 'income' | 'expense'; 
  category: string;
  date: string;
  note: string;
};

type Props = {
  onSuccess: () => void;
  editTransaction?: Transaction; // Optional transaction to edit
  onCancel?: () => void; // Optional cancel callback for edit mode
};

const TransactionForm: React.FC<Props> = ({ onSuccess, editTransaction, onCancel }) => {
  const isEditMode = !!editTransaction;
  
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<TransactionFormInputs>({
    defaultValues: editTransaction ? {
      amount: editTransaction.amount,
      type: editTransaction.type,
      category: editTransaction.category,
      date: editTransaction.date,
      note: editTransaction.note,
    } : undefined,
  });

  const onSubmit = async (data: TransactionFormInputs) => {
    try {
      if (isEditMode && editTransaction) {
        await updateTransaction(editTransaction.id, data);
        toast.success('Transaction updated successfully!');
      } else {
        await createTransaction(data);
        toast.success('Transaction added successfully!');
      }
      
      reset();
      onSuccess();
    } catch (error) {
      console.error(`Failed to ${isEditMode ? 'update' : 'create'} transaction:`, error);
      toast.error(`Failed to ${isEditMode ? 'update' : 'add'} transaction`);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 max-w-md mx-auto">
      <input
        type="number"
        placeholder="Amount"
        step="0.01"
        {...register('amount', { required: true, min: 0 })}
        className="w-full px-3 py-2 border rounded-md"
      />
      {errors.amount && <p className="text-red-500 text-xs">Amount is required</p>}

      <select
        {...register('type', { required: true })}
        className="w-full px-3 py-2 border rounded-md"
      >
        <option value="">Select Type</option>
        <option value="income">Income</option>
        <option value="expense">Expense</option>
      </select>
      {errors.type && <p className="text-red-500 text-xs">Type is required</p>}

      <select
        {...register('category', { required: true })}
        className="w-full px-3 py-2 border rounded-md"
      >
        <option value="">Select Category</option>
        <option value="salary">Salary</option>
        <option value="food">Food</option>
        <option value="shopping">Shopping</option>
        <option value="other">Other</option>
      </select>
      {errors.category && <p className="text-red-500 text-xs">Category is required</p>}

      <input
        type="date"
        {...register('date', { required: true })}
        className="w-full px-3 py-2 border rounded-md"
      />
      {errors.date && <p className="text-red-500 text-xs">Date is required</p>}

      <input
        placeholder="Note (optional)"
        {...register('note')}
        className="w-full px-3 py-2 border rounded-md"
      />

      <div className="flex gap-2">
        <button
          type="submit"
          className="flex-1 bg-blue-600 text-white py-2 rounded-md hover:bg-blue-700 transition"
        >
          {isEditMode ? 'Update Transaction' : 'Add Transaction'}
        </button>
        
        {isEditMode && onCancel && (
          <button
            type="button"
            onClick={onCancel}
            className="flex-1 bg-gray-500 text-white py-2 rounded-md hover:bg-gray-600 transition"
          >
            Cancel
          </button>
        )}
      </div>
    </form>
  );
};

export default TransactionForm;