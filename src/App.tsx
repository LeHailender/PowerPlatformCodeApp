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

  const handleDeleteAccount = async (accountId: string, event: React.MouseEvent) => {
    event.stopPropagation();
    
    if (!confirm('Are you sure you want to delete this account?')) {
      return;
    }

    try {
      await AccountsService.delete(accountId);
      await fetchAccounts();
      setError(null);
    } catch (err) {
      setError('Failed to delete account: ' + (err instanceof Error ? err.message : String(err)));
    }
  };

  // Render the app UI  
  return (
    <>
      <div>
        <h1>Space Accounts</h1>
        
        {error && <div className="error-message">{error}</div>}
        
        {loading ? (
          <p>Loading accounts...</p>
        ) : (
          <div>
            <div className="header-actions">
              <h2>Total Accounts: {accounts.length}</h2>
            </div>
            <div className="button-group">
              <button 
                onClick={() => handleOpenDialog()}
                className="btn btn-success"
              >
                + New Account
              </button>
              <button 
                onClick={fetchAccounts}
                className="btn btn-primary"
              >
                Refresh
              </button>
            </div>
            <div className="accounts-container">
              {accounts.length === 0 ? (
                <p>No accounts found.</p>
              ) : (
                <ul className="accounts-list">
                  {accounts.map((account, index) => (
                    <li 
                      key={account.accountid || index} 
                      onClick={() => handleOpenDialog(account)}
                      className="account-item"
                    >
                      <div className="account-content">
                        <div>
                          <h3>{account.name || 'Unnamed Account'}</h3>
                          {account.accountnumber && <p>Account Number: {account.accountnumber}</p>}
                          {account.emailaddress1 && <p>Email: {account.emailaddress1}</p>}
                          {account.telephone1 && <p>Phone: {account.telephone1}</p>}
                        </div>
                        <button
                          onClick={(e) => handleDeleteAccount(account.accountid!, e)}
                          className="btn btn-delete"
                          title="Delete Account"
                        >
                          ✕
                        </button>
                      </div>
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
