export default function ConsumerPage() {
  return (
    <div className="max-w-6xl mx-auto p-6">
      <h1 className="text-4xl font-bold mb-8 text-[#03305c] border-b-2 border-[#e8742c] pb-4">
        Consumer Banking Services at ZenaTrust Bank
      </h1>
      
      <div className="space-y-8 text-gray-800 text-lg leading-relaxed">
        <section>
          <h2 className="text-2xl font-semibold mb-4 text-[#03305c]">Personal Checking Accounts</h2>
          <p>
            ZenaTrust Bank offers a range of checking account options designed to meet your individual needs. 
            Whether you're looking for a basic checking account with no monthly fees or a premium account with 
            enhanced benefits, we have solutions for every stage of your financial journey.
          </p>
          <ul className="list-disc pl-6 mt-4 space-y-2">
            <li><strong>Essential Checking</strong> - No minimum balance, free online banking</li>
            <li><strong>Advantage Checking</strong> - Earn interest on your balance</li>
            <li><strong>Premium Checking</strong> - Free checks and ATM fee reimbursements</li>
            <li><strong>Student Checking</strong> - Special accounts for students aged 17-24</li>
          </ul>
        </section>

        <section>
          <h2 className="text-2xl font-semibold mb-4 text-[#03305c]">Savings & Money Market Accounts</h2>
          <p>
            Grow your savings with competitive interest rates and flexible account options. Our savings solutions 
            help you build financial security while providing easy access to your funds when you need them.
          </p>
          <div className="grid md:grid-cols-2 gap-6 mt-4">
            <div className="bg-gray-50 p-4 rounded-lg">
              <h3 className="text-xl font-medium text-[#03305c]">Regular Savings</h3>
              <p className="mt-2">
                Start saving with just $25 and enjoy easy transfers between your ZenaTrust Bank accounts.
              </p>
            </div>
            <div className="bg-gray-50 p-4 rounded-lg">
              <h3 className="text-xl font-medium text-[#03305c]">Money Market</h3>
              <p className="mt-2">
                Higher yields with check-writing privileges and debit card access.
              </p>
            </div>
          </div>
        </section>

        <section>
          <h2 className="text-2xl font-semibold mb-4 text-[#03305c]">Certificates of Deposit (CDs)</h2>
          <p>
            Secure, fixed-rate investments with terms ranging from 3 months to 5 years. Our CD specials offer 
            particularly competitive rates for various term lengths.
          </p>
          <div className="overflow-x-auto mt-4">
            <table className="min-w-full bg-white border border-gray-200">
              <thead>
                <tr className="bg-[#03305c] text-white">
                  <th className="py-3 px-4 text-left">Term</th>
                  <th className="py-3 px-4 text-left">Minimum Deposit</th>
                  <th className="py-3 px-4 text-left">APY</th>
                </tr>
              </thead>
              <tbody>
                <tr className="border-b border-gray-200">
                  <td className="py-3 px-4">3 Months</td>
                  <td className="py-3 px-4">$500</td>
                  <td className="py-3 px-4">0.50%</td>
                </tr>
                <tr className="border-b border-gray-200">
                  <td className="py-3 px-4">6 Months</td>
                  <td className="py-3 px-4">$500</td>
                  <td className="py-3 px-4">0.75%</td>
                </tr>
                <tr className="border-b border-gray-200">
                  <td className="py-3 px-4">12 Months</td>
                  <td className="py-3 px-4">$500</td>
                  <td className="py-3 px-4">1.25%</td>
                </tr>
                <tr>
                  <td className="py-3 px-4">60 Months</td>
                  <td className="py-3 px-4">$500</td>
                  <td className="py-3 px-4">2.50%</td>
                </tr>
              </tbody>
            </table>
          </div>
          <p className="text-sm mt-2 text-gray-600">
            * Rates are subject to change. APY = Annual Percentage Yield.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-semibold mb-4 text-[#03305c]">Personal Loans & Credit</h2>
          <p>
            Whether you're consolidating debt, making home improvements, or financing a major purchase, 
            ZenaTrust Bank offers competitive rates and flexible terms.
          </p>
          <div className="mt-4 space-y-4">
            <div className="p-4 border-l-4 border-[#e8742c] bg-gray-50">
              <h3 className="text-xl font-medium text-[#03305c]">Personal Installment Loans</h3>
              <p className="mt-1">
                Fixed rates from 6.99% APR with terms from 12 to 60 months
              </p>
            </div>
            <div className="p-4 border-l-4 border-[#e8742c] bg-gray-50">
              <h3 className="text-xl font-medium text-[#03305c]">Home Equity Lines</h3>
              <p className="mt-1">
                Variable rates starting at Prime + 1% with 10-year draw periods
              </p>
            </div>
            <div className="p-4 border-l-4 border-[#e8742c] bg-gray-50">
              <h3 className="text-xl font-medium text-[#03305c]">Credit Cards</h3>
              <p className="mt-1">
                Low-rate and rewards cards with no annual fee options
              </p>
            </div>
          </div>
        </section>

        <section>
          <h2 className="text-2xl font-semibold mb-4 text-[#03305c]">Digital Banking Features</h2>
          <p>
            Manage your accounts anytime, anywhere with our secure digital banking platform:
          </p>
          <div className="grid md:grid-cols-3 gap-4 mt-4">
            <div className="bg-[#03305c] text-white p-4 rounded-lg">
              <h3 className="text-xl font-medium">Mobile Banking</h3>
              <p className="mt-2">
                Deposit checks, pay bills, and transfer funds from your smartphone
              </p>
            </div>
            <div className="bg-[#03305c] text-white p-4 rounded-lg">
              <h3 className="text-xl font-medium">Online Bill Pay</h3>
              <p className="mt-2">
                Schedule one-time or recurring payments to anyone in the U.S.
              </p>
            </div>
            <div className="bg-[#03305c] text-white p-4 rounded-lg">
              <h3 className="text-xl font-medium">Zelle® Payments</h3>
              <p className="mt-2">
                Send money to friends and family quickly using just an email or phone number
              </p>
            </div>
          </div>
        </section>

        <section className="bg-[#f8f9fa] p-6 rounded-lg border border-[#e8742c]">
          <h2 className="text-2xl font-semibold mb-4 text-[#03305c]">Contact Our Consumer Banking Team</h2>
          <p>
            Have questions about our consumer banking products? Our dedicated team is ready to help you 
            find the right solutions for your financial needs.
          </p>
          <div className="mt-4 space-y-2">
            <p><strong>Phone:</strong> +1-780-476-1737</p>
            <p><strong>Email:</strong> amalgamateedbank@gmail.com</p>
            <p><strong>Branch Locator:</strong> Visit our website to find a location near you</p>
            <p><strong>Hours:</strong> Monday-Friday 8:00 AM - 6:00 PM EST</p>
          </div>
          <button className="mt-4 bg-[#e8742c] text-white px-6 py-2 rounded-md hover:bg-[#d66425] transition-colors">
            Schedule a Consultation
          </button>
        </section>
      </div>
    </div>
  );
}