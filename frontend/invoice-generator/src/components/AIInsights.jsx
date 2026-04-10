import React from 'react';
import { Lightbulb } from 'lucide-react';

const AIInsights = ({ invoices = [] }) => {
  
  // A function to dynamically generate insights based on your database!
  const generateInsights = () => {
    const insights = [];

    // Scenario 1: Brand new user
    if (invoices.length === 0) {
      insights.push("Welcome to the AI Invoice App! Create your first invoice using the AI Generator to see insights here.");
      return insights;
    }

    // Scenario 2: Exactly one invoice (Matches your screenshot!)
    if (invoices.length === 1) {
      insights.push("Congratulations on your first invoice! Let's get that payment secured.");
    } else {
      // Scenario 3: Multiple invoices
      const paidInvoices = invoices.filter(inv => inv.status === 'Paid').length;
      if (paidInvoices > 0) {
        insights.push(`Great job! You have successfully collected payment on ${paidInvoices} invoice(s).`);
      }
    }

    // Unpaid Invoice check (Matches your screenshot's second bullet!)
    const unpaidInvoices = invoices.filter(inv => inv.status !== 'Paid');
    if (unpaidInvoices.length > 0) {
      // Grab the most recent unpaid invoice to suggest a reminder
      const targetInvoice = unpaidInvoices[0];
      insights.push(`Sending a friendly payment reminder for invoice ${targetInvoice.invoiceNumber || 'INV-000'} might expedite the payment process.`);
    }

    // Overdue check
    const overdueInvoices = invoices.filter(inv => new Date(inv.dueDate) < new Date() && inv.status !== 'Paid');
    if (overdueInvoices.length > 0) {
      insights.push(`Warning: You have ${overdueInvoices.length} overdue invoice(s). Consider using the AI email generator to follow up.`);
    }

    return insights;
  };

  const insightsList = generateInsights();

  return (
    <div className="bg-[#e9ecef] border border-gray-200/60 rounded-xl p-5 shadow-sm">
      <div className="flex items-center gap-2 mb-3">
        <Lightbulb className="text-yellow-500" size={20} />
        <h2 className="text-lg font-bold text-slate-800">AI Insights</h2>
      </div>
      
      <ul className="list-disc pl-6 space-y-2">
        {insightsList.map((insight, index) => (
          <li key={index} className="text-sm text-slate-600 leading-relaxed">
            {insight}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default AIInsights;