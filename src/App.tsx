import { useState, useEffect } from 'react'
import './App.css'
import { AccountsService } from './generated/services/AccountsService';
import type { Accounts } from './generated/models/AccountsModel';
import { initialize } from '@microsoft/power-apps/app';
import { AccountFormDialog } from './components/AccountFormDialog';
import { ThemeSelector } from './components/ThemeSelector';
import { useTheme } from './contexts/ThemeContext';

function App() {
  const { theme } = useTheme();
  const [isPowerPlatformSDKInitialized, setIsPowerPlatformSDKInitialized] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [accounts, setAccounts] = useState<Accounts[]>([]);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [selectedAccount, setSelectedAccount] = useState<Accounts | null>(null);

  // Load theme CSS dynamically
  useEffect(() => {
    // Remove any existing theme stylesheets
    const existingThemeLinks = document.querySelectorAll('link[data-theme]');
    existingThemeLinks.forEach(link => link.remove());

    // Add new theme stylesheet
    const link = document.createElement('link');
    link.rel = 'stylesheet';
    link.href = `/src/themes/${theme}.css`;
    link.setAttribute('data-theme', theme);
    document.head.appendChild(link);

    return () => {
      link.remove();
    };
  }, [theme]);

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
        <h1>Power Platform Accounts</h1>
        
        <ThemeSelector />
        
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
                      className="account-item"
                    >
                      <div className="account-content">
                        <div>
                          <h3>{account.name || 'Unnamed Account'}</h3>
                          {account.accountnumber && <p>Account Number: {account.accountnumber}</p>}
                          {account.emailaddress1 && <p>Email: {account.emailaddress1}</p>}
                          {account.telephone1 && <p>Phone: {account.telephone1}</p>}
                        </div>
                        <div className="account-actions">
                          <button
                            onClick={() => handleOpenDialog(account)}
                            className="btn btn-edit"
                            title="Edit Account"
                          >
                            ✎
                          </button>
                          <button
                            onClick={(e) => handleDeleteAccount(account.accountid!, e)}
                            className="btn btn-delete"
                            title="Delete Account"
                          >
                            ✕
                          </button>
                        </div>
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
