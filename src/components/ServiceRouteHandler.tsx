import { useParams, useNavigate } from 'react-router@7.1.1';
import { useSearchStore } from '../stores/search-store';
import { ServiceDetailPlumbing } from './mobile/ServiceDetailPlumbing';
import { ServiceDetailElectricity } from './mobile/ServiceDetailElectricity';
import { ServiceDetailAC } from './mobile/ServiceDetailAC';
import { ServiceDetailPainting } from './mobile/ServiceDetailPainting';
import { ServiceDetailCleaning } from './mobile/ServiceDetailCleaning';
import { ServiceDetailCarpentry } from './mobile/ServiceDetailCarpentry';
import { ServiceDetailInterior } from './mobile/ServiceDetailInterior';
import { ServiceDetailExterior } from './mobile/ServiceDetailExterior';
import { ServiceDetailConstruction } from './mobile/ServiceDetailConstruction';
import { ServiceDetailConsultation } from './mobile/ServiceDetailConsultation';
import { ServiceDetailConstructionContracting } from './mobile/ServiceDetailConstructionContracting';
import { ServiceDetailEngineeringConsultation } from './mobile/ServiceDetailEngineeringConsultation';
import { ServiceDetailMaintenance } from './mobile/ServiceDetailMaintenance';
import { ServiceDetailCraftsmen } from './mobile/ServiceDetailCraftsmen';
import { ServiceDetailWorkshops } from './mobile/ServiceDetailWorkshops';
import { ServiceDetailEquipmentRental } from './mobile/ServiceDetailEquipmentRental';
import { ServiceDetailBuildingMaterials } from './mobile/ServiceDetailBuildingMaterials';
import { ServiceDetailFurnitureDecor } from './mobile/ServiceDetailFurnitureDecor';

export function ServiceRouteHandler() {
  const { id, city } = useParams<{ id: string; city?: string }>();
  const navigate = useNavigate();
  const setOpenSearch = useSearchStore((state) => state.setOpen);

  const handleOpenSearch = (term: string) => {
    setOpenSearch(true);
  };

  const handleBack = () => {
    navigate('/services');
  };

  const handleNavigate = (tab: string) => {
      navigate(`/${tab}`);
  }

  switch (id) {
    case 'plumbing':
      return <ServiceDetailPlumbing onBack={handleBack} onOpenSearch={() => handleOpenSearch('Plumbing')} />;
    case 'electricity':
      return <ServiceDetailElectricity onBack={handleBack} onOpenSearch={() => handleOpenSearch('Electricity')} />;
    case 'ac':
      return <ServiceDetailAC onBack={handleBack} onOpenSearch={() => handleOpenSearch('Air Conditioning')} />;
    case 'painting':
      return <ServiceDetailPainting onBack={handleBack} onOpenSearch={() => handleOpenSearch('Painting')} />;
    case 'cleaning':
    case 'cleaning-services':
      return <ServiceDetailCleaning onBack={handleBack} onNavigate={handleNavigate} onOpenSearch={() => handleOpenSearch('Cleaning Services')} />;
    case 'carpentry':
      return <ServiceDetailCarpentry onBack={handleBack} />;
    case 'interior':
      return <ServiceDetailInterior onBack={handleBack} />;
    case 'exterior':
      return <ServiceDetailExterior onBack={handleBack} />;
    case 'construction':
      return <ServiceDetailConstruction onBack={handleBack} onOpenSearch={() => handleOpenSearch('Construction')} />;
    case 'consultation':
      return <ServiceDetailConsultation onBack={handleBack} />;
    case 'constructionContracting':
    case 'construction-contracting':
      return <ServiceDetailConstructionContracting onBack={handleBack} onNavigate={handleNavigate} onOpenSearch={() => handleOpenSearch('Construction Contracting')} />;
    case 'engineeringConsultation':
    case 'engineering-consultation':
      return <ServiceDetailEngineeringConsultation onBack={handleBack} onNavigate={handleNavigate} onOpenSearch={() => handleOpenSearch('Engineering Consultation')} />;
    case 'maintenance':
    case 'maintenance-companies':
      return <ServiceDetailMaintenance onBack={handleBack} onNavigate={handleNavigate} onOpenSearch={() => handleOpenSearch('Maintenance Companies')} />;
    case 'craftsmen':
      return <ServiceDetailCraftsmen onBack={handleBack} onNavigate={handleNavigate} onOpenSearch={() => handleOpenSearch('Craftsmen')} />;
    case 'workshops':
      return <ServiceDetailWorkshops onBack={handleBack} onNavigate={handleNavigate} onOpenSearch={() => handleOpenSearch('Workshops')} />;
    case 'equipmentRental':
    case 'equipment-rental':
      return <ServiceDetailEquipmentRental onBack={handleBack} onNavigate={handleNavigate} onOpenSearch={() => handleOpenSearch('Equipment Rental')} />;
    case 'buildingMaterials':
    case 'building-materials':
      return <ServiceDetailBuildingMaterials onBack={handleBack} onNavigate={handleNavigate} onOpenSearch={() => handleOpenSearch('Building Materials')} />;
    case 'furnitureDecor':
    case 'furniture-stores':
      return <ServiceDetailFurnitureDecor onBack={handleBack} onNavigate={handleNavigate} onOpenSearch={() => handleOpenSearch('Furniture & Decor')} />;
    default:
      return <div className="p-4 text-center">Service not found: {id}</div>;
  }
}