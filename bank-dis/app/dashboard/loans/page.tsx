'use client';
import CurrentLoans from './components/CurrentLoans';
import RequestLoanForm from './components/RequestLoanForm';

export default function LoansPage() {
  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6 text-[#03305c]">Loans</h1>
      
      <div className="space-y-6">
        <CurrentLoans />
        <RequestLoanForm />
      </div>
    </div>
  );
}