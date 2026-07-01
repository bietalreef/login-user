# Batch Update Script for All 9 Service Pages

## Files to Update:
1. ✅ ServiceDetailConstructionContracting.tsx - DONE
2. ❌ ServiceDetailEngineeringConsultation.tsx
3. ❌ ServiceDetailMaintenance.tsx
4. ❌ ServiceDetailCraftsmen.tsx
5. ❌ ServiceDetailWorkshops.tsx
6. ❌ ServiceDetailEquipmentRental.tsx
7. ❌ ServiceDetailBuildingMaterials.tsx
8. ❌ ServiceDetailFurnitureDecor.tsx
9. ❌ ServiceDetailCleaning.tsx

## Pattern for Each File:

### Step 1: Add import
```typescript
import { useTranslation } from '../../contexts/LanguageContext';
```

### Step 2: Add hook
```typescript
const { t, dir } = useTranslation('services');
```

### Step 3: Update dir attribute
```typescript
<div className="..." dir={dir}>
```

### Step 4: Replace text with t() calls

#### Common replacements:
- Title: `{t('serviceName')}` 
- Tabs: `{t('tabs.details')}`, `{t('tabs.providers')}`, `{t('tabs.reviews')}`
- Buttons: Based on context

#### Service-specific:
Each service uses its own translation key from `/locales/*/services.ts`

## Processing Now...
