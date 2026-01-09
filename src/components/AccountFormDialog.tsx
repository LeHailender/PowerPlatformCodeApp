import { useState, useEffect } from 'react';
import { AccountsService } from '../generated/services/AccountsService';
import type { Accounts } from '../generated/models/AccountsModel';
import '../App.css';

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
    <div className="dialog-overlay">
      <div className="dialog-content">
        <h2>
          {isEditMode ? 'Edit Account' : 'Create New Account'}
        </h2>
        
        <div className="form-field">
          <label className="form-label">
            Account Name *
          </label>
          <input
            type="text"
            value={accountName}
            onChange={(e) => setAccountName(e.target.value)}
            placeholder="Enter account name"
            className="form-input"
          />
        </div>

        <div className="form-field">
          <label className="form-label">
            Email
          </label>
          <input
            type="email"
            value={accountEmail}
            onChange={(e) => setAccountEmail(e.target.value)}
            placeholder="Enter email address"
            className="form-input"
          />
        </div>

        <div className="form-field">
          <label className="form-label">
            Phone
          </label>
          <input
            type="tel"
            value={accountPhone}
            onChange={(e) => setAccountPhone(e.target.value)}
            placeholder="Enter phone number"
            className="form-input"
          />
        </div>

        <div className="form-actions">
          <button
            onClick={handleClose}
            disabled={saving}
            className="btn btn-secondary"
          >
            Cancel
          </button>
          <button
            onClick={handleSaveAccount}
            disabled={saving}
            className="btn btn-success"
          >
            {saving ? (isEditMode ? 'Updating...' : 'Creating...') : (isEditMode ? 'Update' : 'Create')}
          </button>
        </div>
      </div>
    </div>
  );
}
