import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { PromotionService } from '../../services/PromotionService';
import { Banner, NotificationBar } from '../../models/Promotion';
import { ChromePicker } from 'react-color';
import { toast } from 'react-toastify';
import Tooltip from '../../components/common/Tooltip';
import AdminLayout from '../../components/layouts/AdminLayout';

// Styled components
const PageContainer = styled.div`
  padding: 20px;
`;

const PageTitle = styled.h1`
  font-size: 24px;
  margin-bottom: 20px;
  color: #333;
`;

const HeaderSection = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
`;

const TabGroup = styled.div`
  display: flex;
  gap: 10px;
`;

const TabsContainer = styled.div`
  display: flex;
  margin-bottom: 20px;
  border-bottom: 1px solid #e0e0e0;
`;

const Tab = styled.button<{ active: boolean }>`
  padding: 10px 20px;
  background: ${props => props.active ? '#0071BC' : 'transparent'};
  color: ${props => props.active ? 'white' : '#333'};
  border: none;
  cursor: pointer;
  font-size: 16px;
  border-radius: 4px 4px 0 0;
  transition: all 0.3s ease;
  
  &:hover {
    background: ${props => props.active ? '#0071BC' : '#f0f0f0'};
  }
`;

const Card = styled.div`
  background: white;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  padding: 20px;
  margin-bottom: 20px;
`;

const CardTitle = styled.h2`
  font-size: 18px;
  margin-bottom: 15px;
  display: flex;
  align-items: center;
  justify-content: space-between;
`;

const FormGroup = styled.div`
  margin-bottom: 15px;
`;

const Label = styled.label`
  display: block;
  margin-bottom: 5px;
  font-weight: 500;
`;

const Input = styled.input`
  width: 100%;
  padding: 8px 12px;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 14px;
  
  &:focus {
    outline: none;
    border-color: #0071BC;
  }
`;

const TextArea = styled.textarea`
  width: 100%;
  padding: 8px 12px;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 14px;
  min-height: 100px;
  
  &:focus {
    outline: none;
    border-color: #0071BC;
  }
`;

const Button = styled.button`
  background: #0071BC;
  color: white;
  border: none;
  padding: 8px 16px;
  border-radius: 4px;
  cursor: pointer;
  font-size: 14px;
  transition: background 0.3s ease;
  
  &:hover {
    background: #005a9c;
  }
  
  &:disabled {
    background: #cccccc;
    cursor: not-allowed;
  }
`;

const DeleteButton = styled(Button)`
  background: #dc3545;
  
  &:hover {
    background: #c82333;
  }
`;

const ToggleButton = styled.button<{ active: boolean }>`
  background: ${props => props.active ? '#4CAF50' : '#f44336'};
  color: white;
  border: none;
  padding: 6px 12px;
  border-radius: 4px;
  cursor: pointer;
  font-size: 14px;
  transition: background 0.3s ease;
  
  &:hover {
    background: ${props => props.active ? '#43a047' : '#e53935'};
  }
`;

const ColorPickerContainer = styled.div`
  position: relative;
  margin-bottom: 15px;
`;

const ColorPreview = styled.div<{ color: string }>`
  width: 36px;
  height: 36px;
  border-radius: 4px;
  background-color: ${props => props.color};
  cursor: pointer;
  border: 1px solid #ddd;
`;

const ColorPickerPopover = styled.div`
  position: absolute;
  z-index: 2;
  top: 45px;
`;

const ColorPickerCover = styled.div`
  position: fixed;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
`;

const BannerPreview = styled.div<{ bgColor: string }>`
  background-color: ${props => props.bgColor};
  border-radius: 8px;
  padding: 20px;
  margin-top: 20px;
  display: flex;
  min-height: 200px;
`;

const BannerContent = styled.div`
  width: 50%;
  padding: 20px;
  color: white;
`;

const BannerImage = styled.div<{ bgColor: string }>`
  width: 50%;
  background-color: ${props => props.bgColor};
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 8px;
  
  img {
    max-width: 100%;
    max-height: 150px;
  }
`;

const NotificationPreview = styled.div<{ bgColor: string }>`
  background-color: ${props => props.bgColor};
  color: white;
  padding: 10px 20px;
  text-align: center;
  border-radius: 4px;
  margin-top: 20px;
  
  a {
    color: white;
    text-decoration: underline;
    margin-left: 5px;
    
    &:hover {
      text-decoration: none;
    }
  }
`;

const BannerList = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 20px;
  margin-top: 20px;
`;

const BannerCard = styled.div`
  border: 1px solid #ddd;
  border-radius: 8px;
  overflow: hidden;
`;

const BannerCardHeader = styled.div<{ bgColor: string }>`
  background-color: ${props => props.bgColor};
  padding: 15px;
  color: white;
`;

const BannerCardTitle = styled.h3`
  font-size: 16px;
  margin: 0;
`;

const BannerCardBody = styled.div`
  padding: 15px;
`;

const BannerCardActions = styled.div`
  display: flex;
  justify-content: space-between;
  margin-top: 15px;
`;

const BannerCardLabel = styled.span`
  display: inline-block;
  background-color: #ffa500;
  color: white;
  padding: 3px 8px;
  border-radius: 12px;
  font-size: 12px;
  margin-bottom: 8px;
`;

const EmptyMessage = styled.div`
  padding: 20px;
  text-align: center;
  color: #666;
  background: #f8f8f8;
  border-radius: 4px;
  margin: 20px 0;
`;

const LoadingMessage = styled.div`
  padding: 20px;
  text-align: center;
  color: #0071BC;
`;

const ErrorMessage = styled.div`
  padding: 15px;
  text-align: center;
  color: #e53935;
  background: #ffebee;
  border-radius: 4px;
  margin: 20px 0;
`;

const ButtonRow = styled.div`
  margin: 20px 0;
  display: flex;
  justify-content: flex-end;
`;

enum TabType {
  BANNERS = 'banners',
  NOTIFICATION = 'notification'
}

const PromotionsPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState<TabType>(TabType.BANNERS);
  const [banners, setBanners] = useState<Banner[]>([]);
  const [notificationBar, setNotificationBar] = useState<NotificationBar | null>(null);
  const [editingBanner, setEditingBanner] = useState<Banner | null>(null);
  const [showBgColorPicker, setShowBgColorPicker] = useState(false);
  const [showImgBgColorPicker, setShowImgBgColorPicker] = useState(false);
  const [showNotificationBgColorPicker, setShowNotificationBgColorPicker] = useState(false);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Load banners and notification bar data
    const loadBanners = async () => {
      try {
        setLoading(true);
        const banners = await PromotionService.getBanners();
        setBanners(Array.isArray(banners) ? banners : []);
      } catch (error) {
        console.error('Error loading banners:', error);
        setError('Failed to load banners');
        setBanners([]);
      }
    };

    const loadNotificationBar = async () => {
      try {
        const notificationBar = await PromotionService.getNotificationBar();
        setNotificationBar(notificationBar);
      } catch (error) {
        console.error('Error loading notification bar:', error);
        setError('Failed to load notification bar');
      } finally {
        setLoading(false);
      }
    };

    loadBanners();
    loadNotificationBar();
  }, []);

  const handleTabChange = (tab: TabType) => {
    setActiveTab(tab);
  };

  const handleEditBanner = (banner: Banner) => {
    setEditingBanner({ ...banner });
  };

  const handleBannerInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    if (!editingBanner) return;
    
    const { name, value } = e.target;
    setEditingBanner({
      ...editingBanner,
      [name]: value
    });
  };

  const handleBannerBgColorChange = (color: any) => {
    if (!editingBanner) return;
    
    setEditingBanner({
      ...editingBanner,
      bgColor: color.hex
    });
  };

  const handleBannerImgBgColorChange = (color: any) => {
    if (!editingBanner) return;
    
    setEditingBanner({
      ...editingBanner,
      imgBgColor: color.hex
    });
  };

  const handleNotificationBgColorChange = (color: any) => {
    if (!notificationBar) return;
    
    setNotificationBar({
      ...notificationBar,
      bgColor: color.hex
    });
  };

  const handleNotificationInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!notificationBar) return;
    
    const { name, value } = e.target;
    setNotificationBar({
      ...notificationBar,
      [name]: value
    });
  };

  const handleSaveBanner = async () => {
    if (!editingBanner) return;
    
    try {
      const updatedBanner = await PromotionService.updateBanner(editingBanner);
      // Update the banner in the state
      setBanners(prev => prev.map(b => b.id === updatedBanner.id ? updatedBanner : b));
      setEditingBanner(null);
      toast.success('Banner updated successfully!');
    } catch (error) {
      console.error('Error updating banner:', error);
      toast.error('Failed to update banner');
    }
  };

  const handleSaveNotification = async () => {
    if (!notificationBar) return;
    
    try {
      const updatedNotificationBar = await PromotionService.updateNotificationBar(notificationBar);
      setNotificationBar(updatedNotificationBar);
      toast.success('Notification bar updated successfully!');
    } catch (error) {
      console.error('Error updating notification bar:', error);
      toast.error('Failed to update notification bar');
    }
  };
  
  const handleToggleBanner = async (id: number) => {
    try {
      const updatedBanner = await PromotionService.toggleBannerStatus(id);
      // Update the banner in the state
      setBanners(prev => prev.map(b => b.id === updatedBanner.id ? updatedBanner : b));
      toast.info('Banner status updated!');
    } catch (error) {
      console.error('Error toggling banner status:', error);
      toast.error('Failed to update banner status');
    }
  };
  
  const handleToggleNotification = async () => {
    if (!notificationBar) return;
    
    try {
      const updatedNotificationBar = await PromotionService.toggleNotificationBarStatus();
      setNotificationBar(updatedNotificationBar);
      toast.info('Notification bar status updated!');
    } catch (error) {
      console.error('Error toggling notification bar status:', error);
      toast.error('Failed to update notification bar status');
    }
  };

  const cancelEditBanner = () => {
    setEditingBanner(null);
  };

  return (
    <AdminLayout title="Promotions">
      <PageContainer>
        <HeaderSection>
          <PageTitle>Promotions</PageTitle>
          <TabGroup>
            <Tab 
              active={activeTab === TabType.BANNERS} 
              onClick={() => setActiveTab(TabType.BANNERS)}
            >
              Banner Slides
            </Tab>
            <Tab 
              active={activeTab === TabType.NOTIFICATION} 
              onClick={() => setActiveTab(TabType.NOTIFICATION)}
            >
              Notification Bar
            </Tab>
          </TabGroup>
        </HeaderSection>
        
        {loading ? (
          <LoadingMessage>Loading promotion data...</LoadingMessage>
        ) : error ? (
          <ErrorMessage>{error}</ErrorMessage>
        ) : (
          <>
            {activeTab === TabType.BANNERS && (
              <>
                <Card>
                  <CardTitle>Banner Slides</CardTitle>
                  <p>Manage promotional banner slides that appear on the homepage. Toggle banners on/off or edit their content.</p>
                  
                  <ButtonRow>
                    <Button onClick={() => handleAddBanner()}>Add New Banner</Button>
                  </ButtonRow>
                  
                  <BannerList>
                    {Array.isArray(banners) && banners.length > 0 ? (
                      banners.map(banner => (
                        <BannerCard key={banner.id}>
                          <BannerCardHeader bgColor={banner.bgColor}>
                            <BannerCardLabel>{banner.label}</BannerCardLabel>
                            <BannerCardTitle>{banner.title}</BannerCardTitle>
                          </BannerCardHeader>
                          <BannerCardBody>
                            <p style={{ fontSize: '14px', margin: '0 0 10px' }}>{banner.description}</p>
                            <div style={{ fontSize: '12px', color: '#666' }}>
                              <div>Link: {banner.link}</div>
                            </div>
                            <BannerCardActions>
                              <Button onClick={() => handleEditBanner(banner)}>Edit</Button>
                              <ToggleButton 
                                active={banner.active}
                                onClick={() => handleToggleBanner(banner.id)}
                              >
                                {banner.active ? 'Active' : 'Inactive'}
                              </ToggleButton>
                            </BannerCardActions>
                          </BannerCardBody>
                        </BannerCard>
                      ))
                    ) : (
                      <EmptyMessage>No banners found. Create your first banner to get started.</EmptyMessage>
                    )}
                  </BannerList>
                </Card>
              </>
            )}
            
            {activeTab === TabType.NOTIFICATION && notificationBar && (
              <Card>
                <CardTitle>
                  Notification Bar
                  <ToggleButton 
                    active={notificationBar.active}
                    onClick={handleToggleNotification}
                  >
                    {notificationBar.active ? 'Active' : 'Inactive'}
                  </ToggleButton>
                </CardTitle>
                
                <FormGroup>
                  <Tooltip content="The main message displayed in the notification bar" position="right">
                    <Label htmlFor="message">Message</Label>
                  </Tooltip>
                  <Input
                    id="message"
                    name="message"
                    value={notificationBar.message}
                    onChange={handleNotificationInputChange}
                  />
                </FormGroup>
                
                <FormGroup>
                  <Tooltip content="Text for the clickable link in the notification bar" position="right">
                    <Label htmlFor="linkText">Link Text</Label>
                  </Tooltip>
                  <Input
                    id="linkText"
                    name="linkText"
                    value={notificationBar.linkText}
                    onChange={handleNotificationInputChange}
                  />
                </FormGroup>
                
                <FormGroup>
                  <Tooltip content="URL where users will be directed when clicking the link" position="right">
                    <Label htmlFor="linkUrl">Link URL</Label>
                  </Tooltip>
                  <Input
                    id="linkUrl"
                    name="linkUrl"
                    value={notificationBar.linkUrl}
                    onChange={handleNotificationInputChange}
                  />
                </FormGroup>
                
                <ColorPickerContainer>
                  <Tooltip content="Background color of the notification bar" position="right">
                    <Label>Background Color</Label>
                  </Tooltip>
                  <ColorPreview 
                    color={notificationBar.bgColor}
                    onClick={() => setShowNotificationBgColorPicker(!showNotificationBgColorPicker)}
                  />
                  {showNotificationBgColorPicker && (
                    <ColorPickerPopover>
                      <ColorPickerCover onClick={() => setShowNotificationBgColorPicker(false)} />
                      <ChromePicker 
                        color={notificationBar.bgColor}
                        onChange={handleNotificationBgColorChange}
                      />
                    </ColorPickerPopover>
                  )}
                </ColorPickerContainer>
                
                <NotificationPreview bgColor={notificationBar.bgColor}>
                  {notificationBar.message}
                  <a href="#">{notificationBar.linkText}</a>
                </NotificationPreview>
                
                <div style={{ marginTop: '20px', display: 'flex', justifyContent: 'flex-end' }}>
                  <Button onClick={handleSaveNotification}>Save Changes</Button>
                </div>
              </Card>
            )}
          </>
        )}
      </PageContainer>
    </AdminLayout>
  );
};

export default PromotionsPage;
