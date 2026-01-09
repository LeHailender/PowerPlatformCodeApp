import { useState, useEffect } from 'react';
import { AccountsService } from '../generated/services/AccountsService';
import type { Accounts } from '../generated/models/AccountsModel';

interface AccountFormDialogProps {
  isOpen: boolean;
  account?: Accounts | null;
  onClose: () => void;
  onSuccess: () => void;
  onError: (error: string) => void;
}

export function AccountFormDialog({ isOpen, account, onClose, onSuccess, onError }: AccountFormDialogProps) {
  const [accountName, setAccountName] = useState('');
  const [accountEmail, setAccountEmail] = useState('');
  const [accountPhone, setAccountPhone] = useState('');
  const [saving, setSaving] = useState(false);

  const isEditMode = !!account;

  // Populate form when editing an existing account
  useEffect(() => {
    if (account) {
      setAccountName(account.name || '');
      setAccountEmail(account.emailaddress1 || '');
      setAccountPhone(account.telephone1 || '');
    } else {
      setAccountName('');
      setAccountEmail('');
      setAccountPhone('');
    }
  }, [account]);

  const handleClose = () => {
    setAccountName('');
    setAccountEmail('');
    setAccountPhone('');
    onClose();
  };

  const handleSaveAccount = async () => {
    if (!accountName.trim()) {
      onError('Account name is required');
      return;
    }

    try {
      setSaving(true);
      onError(''); // Clear any previous errors
      
      if (isEditMode && account) {
        // Update existing account
        await AccountsService.update(account.accountid, {
          name: accountName,
          emailaddress1: accountEmail || undefined,
          telephone1: accountPhone || undefined
        } as any);
      } else {
        // Create new account
        await AccountsService.create({
          name: accountName,
          emailaddress1: accountEmail || undefined,
          telephone1: accountPhone || undefined
        } as any);
      }

      // Reset form and close dialog
      setAccountName('');
      setAccountEmail('');
      setAccountPhone('');
      
      onSuccess();
      onClose();
    } catch (err) {
      onError(`Failed to ${isEditMode ? 'update' : 'create'} account: ` + (err instanceof Error ? err.message : String(err)));
    } finally {
      setSaving(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      backgroundColor: 'rgba(0, 0, 0, 0.5)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 1000
    }}>
      <div style={{
        backgroundColor: 'white',
        padding: '30px',
        borderRadius: '8px',
        minWidth: '400px',
        maxWidth: '500px',
        boxShadow: '0 4px 12px rgba(0,0,0,0.15)'
      }}>
        <h2 style={{ marginTop: 0, color: '#333' }}>
          {isEditMode ? 'Edit Account' : 'Create New Account'}
        </h2>
        
        <div style={{ marginBottom: '15px' }}>
          <label style={{ display: 'block', marginBottom: '5px', fontWeight: '500', color: '#333' }}>
            Account Name *
          </label>
          <input
            type="text"
            value={accountName}
            onChange={(e) => setAccountName(e.target.value)}
            placeholder="Enter account name"
            style={{
              width: '100%',
              padding: '8px',
              border: '1px solid #ccc',
              borderRadius: '4px',
              fontSize: '14px'
            }}
          />
        </div>

        <div style={{ marginBottom: '15px' }}>
          <label style={{ display: 'block', marginBottom: '5px', fontWeight: '500', color: '#333' }}>
            Email
          </label>
          <input
            type="email"
            value={accountEmail}
            onChange={(e) => setAccountEmail(e.target.value)}
            placeholder="Enter email address"
            style={{
              width: '100%',
              padding: '8px',
              border: '1px solid #ccc',
              borderRadius: '4px',
              fontSize: '14px'
            }}
          />
        </div>

        <div style={{ marginBottom: '20px' }}>
          <label style={{ display: 'block', marginBottom: '5px', fontWeight: '500', color: '#333' }}>
            Phone
          </label>
          <input
            type="tel"
            value={accountPhone}
            onChange={(e) => setAccountPhone(e.target.value)}
            placeholder="Enter phone number"
            style={{
              width: '100%',
              padding: '8px',
              border: '1px solid #ccc',
              borderRadius: '4px',
              fontSize: '14px'
            }}
          />
        </div>

        <div style={{ display: 'flex', gap: '10px', justifyContent: 'flex-end' }}>
          <button
            onClick={handleClose}
            disabled={saving}
            style={{
              padding: '8px 16px',
              backgroundColor: '#f3f2f1',
              color: '#333',
              border: '1px solid #ccc',
              borderRadius: '4px',
              cursor: saving ? 'not-allowed' : 'pointer',
              fontWeight: '500'
            }}
          >
            Cancel
          </button>
          <button
            onClick={handleSaveAccount}
            disabled={saving}
            style={{
              padding: '8px 16px',
              backgroundColor: saving ? '#ccc' : '#107c10',
              color: 'white',
              border: 'none',
              borderRadius: '4px',
              cursor: saving ? 'not-allowed' : 'pointer',
              fontWeight: '500'
            }}
          >
            {saving ? (isEditMode ? 'Updating...' : 'Creating...') : (isEditMode ? 'Update' : 'Create')}
          </button>
        </div>
      </div>
    </div>
  );
}
