import React, { useEffect, useState } from 'react';
import TransactionForm from '../components/TransactionForm';
import TransactionTable from '../components/TransactionTable';
import { useQuery } from '@tanstack/react-query';
import { getTransactions, getIncomeExpenseTotals } from '../Services/api';
import { Card, CardHeader, CardTitle, CardContent } from '../components/ui/card';
import { useNavigate } from 'react-router-dom';

const Dashboard: React.FC = () => {
  const navigate = useNavigate();
  const token = localStorage.getItem('authToken');

  if (!token) {
    navigate('/login');
  }

  const { data: transactions = [], refetch } = useQuery({
    queryKey: ['transactions'],
    queryFn: getTransactions,
    enabled: !!token,
  });

  const [totals, setTotals] = useState({ income: 0, expense: 0, balance: 0 });

  useEffect(() => {
    if (token) {
      getIncomeExpenseTotals().then(setTotals);
    }
  }, [transactions, token]);

  return (
    <div className="min-h-screen bg-gray-100 py-8 px-4">
      <div className="max-w-4xl mx-auto space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-3xl font-bold text-purple-700">Dashboard</h1>
          <button
            onClick={() => {
              localStorage.removeItem('authToken');
              navigate('/login');
            }}
            className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600 transition"
          >
            Logout
          </button>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>
              Personal Finance Tracker
            </CardTitle>
          </CardHeader>

          <CardContent>
            <div className="mb-6 grid grid-cols-3 gap-4 text-center">
              <div className="bg-green-100 text-green-800 p-4 rounded shadow">
                <p className="text-sm">Total Income</p>
                <p className="text-xl font-semibold">₹{totals.income}</p>
              </div>
              <div className="bg-red-100 text-red-800 p-4 rounded shadow">
                <p className="text-sm">Total Expense</p>
                <p className="text-xl font-semibold">₹{totals.expense}</p>
              </div>
              <div className="bg-blue-100 text-blue-800 p-4 rounded shadow">
                <p className="text-sm">Balance</p>
                <p className="text-xl font-semibold">₹{totals.balance}</p>
              </div>
            </div>

            <TransactionForm onSuccess={refetch} />
            <TransactionTable transactions={transactions} onDelete={refetch} onUpdate={refetch} />
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Dashboard;
