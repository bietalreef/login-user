import { useState } from 'react';
import { toast } from 'sonner@2.0.3';
import { useUser } from '../utils/UserContext';
import { checkPolicy, LegacyPolicyResult } from '../utils/uiPolicy';

export function usePermissionGuard() {
  const { profile } = useUser();
  const [modalState, setModalState] = useState<{ isOpen: boolean; type: 'login' | 'verify' | 'upgrade'; feature: string }>({
    isOpen: false,
    type: 'login',
    feature: ''
  });

  // Use string for feature to allow both new and legacy keys
  const guard = (feature: string, featureName: string, action: () => void) => {
    const policy: LegacyPolicyResult = checkPolicy(profile, feature);

    if (policy.allowed) {
      action();
    } else {
      // Determine the modal type based on actionRequired
      let type: 'login' | 'verify' | 'upgrade' = 'login';
      
      if (policy.actionRequired === 'upgrade') type = 'upgrade';
      else if (policy.actionRequired === 'verify') type = 'verify';
      else if (policy.actionRequired === 'login') type = 'login';

      setModalState({
        isOpen: true,
        type,
        feature: featureName
      });
      
      // Optional: Sound effect or vibration here for strict feel
    }
  };

  const closeModal = () => {
    setModalState(prev => ({ ...prev, isOpen: false }));
  };

  return {
    guard,
    modalState,
    closeModal
  };
}