import { useState, useEffect } from 'react'
import './App.css'
import { AccountsService } from './generated/services/AccountsService';
import type { Accounts } from './generated/models/AccountsModel';
import { initialize } from '@microsoft/power-apps/app';
import { AccountFormDialog } from './components/AccountFormDialog';

function App() {
  const [isPowerPlatformSDKInitialized, setIsPowerPlatformSDKInitialized] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [accounts, setAccounts] = useState<Accounts[]>([]);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [selectedAccount, setSelectedAccount] = useState<Accounts | null>(null);

  // Initialize Power Apps SDK on component mount
  // Will called only once when the component is mounted (rendered for the first time)
  useEffect(() => {
    // Define an async function to initialize the Power Apps SDK
    const init = async () => {
          try {
                await initialize(); // Wait for SDK initialization
                setIsPowerPlatformSDKInitialized(true); // Mark the app as ready for data operations
          } catch (err) {
                setError('Failed to initialize Power Apps SDK'); // Handle initialization errors
                setLoading(false); // Stop any loading indicators
          }
    };

    init(); // Call the initialization function when the component mounts
    }, []);

    // Fetch accounts once the SDK is initialized
    useEffect(() => {
      fetchAccounts();
    }, [isPowerPlatformSDKInitialized]);

     // Fetch accounts from Dataverse
    const fetchAccounts = async () => {
      if (!isPowerPlatformSDKInitialized) return;
      
      try {
        setLoading(true);
        const result = await AccountsService.getAll();

        if (result.data) {
          const accounts = result.data;
          console.log(`Retrieved ${accounts.length} accounts`);
          setAccounts( accounts.length > 0  ? accounts : []);
        }  
        setError(null);
      } catch (err) {
        setError('Failed to load accounts: ' + (err instanceof Error ? err.message : String(err)));
      } finally {
        setLoading(false);
      }
    };

  const handleOpenDialog = (account?: Accounts) => {
    setSelectedAccount(account || null);
    setIsDialogOpen(true);
  };

  const handleCloseDialog = () => {
    setSelectedAccount(null);
    setIsDialogOpen(false);
  };

  // Render the app UI  
  return (
    <>
      <div>
        <h1>Power Platform Accounts</h1>
        
        {error && <div style={{ color: 'red', padding: '10px', background: '#ffe6e6', borderRadius: '5px' }}>{error}</div>}
        
        {loading ? (
          <p>Loading accounts...</p>
        ) : (
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
              <h2>Total Accounts: {accounts.length}</h2>
              <div style={{ display: 'flex', gap: '10px' }}>
                <button 
                  onClick={() => handleOpenDialog()}
                  style={{ 
                    padding: '8px 16px',
                    backgroundColor: '#107c10',
                    color: 'white',
                    border: 'none',
                    borderRadius: '4px',
                    cursor: 'pointer',
                    fontWeight: '500'
                  }}
                >
                  + New Account
                </button>
                <button 
                  onClick={fetchAccounts}
                  style={{ 
                    padding: '8px 16px',
                    backgroundColor: '#0078d4',
                    color: 'white',
                    border: 'none',
                    borderRadius: '4px',
                    cursor: 'pointer',
                    fontWeight: '500'
                  }}
                >
                  Refresh
                </button>
              </div>
            </div>
            <div style={{ maxHeight: '500px', overflowY: 'auto', border: '1px solid #ccc', padding: '10px' }}>
              {accounts.length === 0 ? (
                <p>No accounts found.</p>
              ) : (
                <ul style={{ listStyle: 'none', padding: 0 }}>
                  {accounts.map((account, index) => (
                    <li 
                      key={account.accountid || index} 
                      onClick={() => handleOpenDialog(account)}
                      style={{ 
                        padding: '10px', 
                        margin: '5px 0', 
                        background: '#f5f5f5', 
                        borderRadius: '5px',
                        borderLeft: '4px solid #0078d4',
                        cursor: 'pointer',
                        transition: 'background 0.2s'
                      }}
                      onMouseEnter={(e) => e.currentTarget.style.background = '#e8e8e8'}
                      onMouseLeave={(e) => e.currentTarget.style.background = '#f5f5f5'}
                    >
                      <strong>{account.name || 'Unnamed Account'}</strong>
                      {account.accountnumber && <div>Account Number: {account.accountnumber}</div>}
                      {account.emailaddress1 && <div>Email: {account.emailaddress1}</div>}
                      {account.telephone1 && <div>Phone: {account.telephone1}</div>}
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </div>
        )}
        
        <AccountFormDialog
          isOpen={isDialogOpen}
          account={selectedAccount}
          onClose={handleCloseDialog}
          onSuccess={fetchAccounts}
          onError={setError}
        />
      </div>
    </>
  )
}

export default App
