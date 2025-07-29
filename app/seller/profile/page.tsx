"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Switch } from "@/components/ui/switch"
import { LoadingSpinner } from "@/components/ui/loading-spinner"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { User, Building, CreditCard, Settings, Camera, MapPin, Calendar, Star, Shield, Bell } from "lucide-react"
import axios from "axios"
import process from "process"
import { useAuthStore } from '@/stores/auth-store';

interface ProfileData {
  personalInfo: {
    id: string
    name: string
    lastName: string
    email: string
    phone: string
    avatar: string
    joinDate: string
    lastLogin: string
  }
  businessInfo: {
    businessName: string
    businessType: string
    description: string
    address: {
      street: string
      city: string
      region: string
      country: string
      postalCode: string
    }
    taxNumber: string
    businessLicense: string
    certifications: string[]
  }
  bankInfo: {
    api_key: string
    accountNumber: string
    api_secret: string
    iban: string
  }
  preferences: {
    language: string
    currency: string
    timezone: string
    notifications: {
      email: boolean
      sms: boolean
      push: boolean
      marketing: boolean
    }
  }
  stats: {
    totalProducts: number
    totalOrders: number
    totalRevenue: number
    rating: number
    reviewsCount: number
  }
}

export default function ProfilePage() {
  const [profile, setProfile] = useState<ProfileData | null>(null)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [activeTab, setActiveTab] = useState("personal");
  const id = useAuthStore((state) => state.user?.id);

  useEffect(() => {
    if (id) {
      fetchProfile();
    }
  }, [id]);

  const fetchProfile = async () => {
    if (!id) return;
    
    setLoading(true);
    try {
      const response = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/users/${id}`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem("token")}`,
          'Accept': 'application/json'
        } 
      });
      const userData = response.data || response.data;
      console.log(userData)
      // Transform the API response to match the expected profile data structure
      const profileData: ProfileData = {
        personalInfo: {
          id: userData.id.toString(),
          name: userData.name || '',
          lastName: userData.last_name || '',
          email: userData.email || '',
          phone: userData.phone || '',
          avatar: userData.avatar || '/placeholder.svg',
          joinDate: userData.created_at || new Date().toISOString(),
          lastLogin: userData.last_login_at || new Date().toISOString(),
        },
        businessInfo: {
          businessName: userData.business_name || '',
          businessType: userData.type?.name || '',
          description: userData.bio || '',
          address: {
            street: userData.address?.street || '',
            city: userData.city?.name || '',
            region: userData.city?.region || '',
            country: 'Sénégal',
            postalCode: userData.address?.postal_code || '',
          },
          taxNumber: userData.tax_number || '',
          businessLicense: userData.business_license || '',
          certifications: userData.certifications?.map((c: any) => c.name) || [],
        },
        bankInfo: {
          api_key: userData.payment_api_key || '',
          accountNumber: userData.bank_account_number || '',
          api_secret: userData.payment_api_secret || '',
          iban: userData.iban || ''
        },
        preferences: {
          language: userData.language || 'fr',
          currency: userData.currency || 'XOF',
          timezone: userData.timezone || 'Africa/Dakar',
          notifications: {
            email: userData.notification_preferences?.email ?? true,
            sms: userData.notification_preferences?.sms ?? true,
            push: userData.notification_preferences?.push ?? true,
            marketing: userData.notification_preferences?.marketing ?? false,
          },
        },
        stats: {
          totalProducts: userData.products_count || 0,
          totalOrders: userData.orders_count || 0,
          totalRevenue: userData.total_revenue || 0,
          rating: parseFloat(userData.average_rating) || 0,
          reviewsCount: userData.reviews_count || 0,
        }
      };
      
      setProfile(profileData);
    } catch (error) {
      console.error("Erreur lors du chargement du profil:", error);
    } finally {
      setLoading(false);
    }
  }

  const handleSave = async (section: string, formData: any) => {
    if (!id) return;
    
    setSaving(true);
    try {
      // Transform data based on section
      let dataToSend: any = {};
      
      if (section === 'personal') {
        dataToSend = {
          first_name: formData.firstName,
          last_name: formData.lastName,
          email: formData.email,
          phone: formData.phone,
          avatar: formData.avatar
        };
      } else if (section === 'business') {
        dataToSend = {
          business_name: formData.businessName,
          type_id: formData.businessTypeId, // Assuming you have type_id in your form
          bio: formData.description,
          address: formData.address?.street ? {
            street: formData.address.street,
            city: formData.address.city,
            region: formData.address.region,
            postal_code: formData.address.postalCode,
            country: 'Sénégal'
          } : undefined,
          tax_number: formData.taxNumber,
          business_license: formData.businessLicense,
          certifications: formData.certifications?.map((name: string) => ({ name }))
        };
      } else if (section === 'banking') {
        dataToSend = {
          payment_api_key: formData.api_key,
          payment_api_secret: formData.api_secret,
          bank_account_number: formData.accountNumber,
          iban: formData.iban
        };
      } else if (section === 'settings') {
        dataToSend = {
          language: formData.language,
          currency: formData.currency,
          timezone: formData.timezone,
          notification_preferences: formData.notifications
        };
      }

      // Remove undefined values from the payload
      Object.keys(dataToSend).forEach(key => {
        if (dataToSend[key] === undefined) {
          delete dataToSend[key];
        }
      });

      // Send the update request
      await axios.patch(`${process.env.NEXT_PUBLIC_API_URL}/users/${id}`, dataToSend, {
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        }
      });

      // Refresh the profile data
      await fetchProfile();
      
      // Show success message (you can replace this with a toast notification)
      console.log('Profile updated successfully');
      
    } catch (error: any) {
      console.error('Error saving profile:', error);
      if (error.response?.data) {
        console.error('Server error:', error.response.data);
        // You can show this error to the user
        if (error.response.data.errors) {
          // Handle validation errors
          console.error('Validation errors:', error.response.data.errors);
        }
      }
    } finally {
      setSaving(false);
    }
  }

  const handleSavePayment = async () => {
    if (!profile) return;
    
    setSaving(true);
    try {
      // Get the API key and secret from the form inputs
      const apiKeyInput = document.getElementById('api_key') as HTMLInputElement;
      const apiSecretInput = document.getElementById('api_secret') as HTMLInputElement;
      
      if (!apiKeyInput || !apiSecretInput) {
        throw new Error('Could not find payment form inputs');
      }

      const paymentData = {
        user_id: profile.personalInfo.id,
        provider: 'agro_pay', // or get this from a select input if you have multiple providers
        api_key: apiKeyInput.value,
        api_secret: apiSecretInput.value,
        is_live: true
      };

      // Send the request to create/update the payment API key
      const response = await axios.patch(
        `${process.env.NEXT_PUBLIC_API_URL}/payment-api-keys/${id}`,
        paymentData,
        {
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${localStorage.getItem('token')}`
          }
        }
      );

      if (response.status === 200 || response.status === 201) {
        // Update the local profile state with the new payment info
        setProfile(prev => {
          if (!prev) return prev;
          return {
            ...prev,
            bankInfo: {
              ...prev.bankInfo,
              api_key: paymentData.api_key,
              api_secret: paymentData.api_secret
            }
          };
        });
        
        // Show success message (you can replace this with a toast notification)
        console.log('Payment information saved successfully');
      }
    } catch (error) {
      console.error("Error saving payment information:", error);
      // You can add error handling here (e.g., show error message to user)
    } finally {
      setSaving(false);
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <LoadingSpinner />
      </div>
    )
  }

  if (!profile) {
    return <div>Erreur lors du chargement du profil</div>
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Profil Vendeur</h1>
        <p className="text-muted-foreground">Gérez vos informations personnelles et professionnelles</p>
      </div>

      {/* En-tête du profil */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex items-center space-x-6">
            <div className="relative">
              <Avatar className="h-24 w-24">
                <AvatarImage src={profile.personalInfo.avatar || "/placeholder.svg"} />
                <AvatarFallback className="text-lg">
                  {profile.personalInfo.name}
                </AvatarFallback>
              </Avatar>
              <Button size="sm" className="absolute -bottom-2 -right-2 h-8 w-8 rounded-full p-0">
                <Camera className="h-4 w-4" />
              </Button>
            </div>
            <div className="flex-1">
              <h2 className="text-2xl font-bold">
                {profile.personalInfo.name} 
              </h2>
              <p className="text-muted-foreground">{profile.businessInfo.businessName}</p>
              <div className="flex items-center space-x-4 mt-2">
                <div className="flex items-center space-x-1">
                  <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                  <span className="font-medium">{profile.stats.rating}</span>
                  <span className="text-sm text-muted-foreground">({profile.stats.reviewsCount} avis)</span>
                </div>
                <Badge variant="secondary">{profile.stats.totalProducts} produits</Badge>
                <Badge variant="secondary">{profile.stats.totalOrders} commandes</Badge>
              </div>
            </div>
            <div className="text-right">
              <div className="text-2xl font-bold text-green-600">{profile.stats.totalRevenue.toLocaleString()} XOF</div>
              <p className="text-sm text-muted-foreground">Revenus totaux</p>
            </div>
          </div>
        </CardContent>
      </Card>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="personal" className="flex items-center space-x-2">
            <User className="h-4 w-4" />
            <span>Personnel</span>
          </TabsTrigger>
          <TabsTrigger value="business" className="flex items-center space-x-2">
            <Building className="h-4 w-4" />
            <span>Entreprise</span>
          </TabsTrigger>
          <TabsTrigger value="banking" className="flex items-center space-x-2">
            <CreditCard className="h-4 w-4" />
            <span>Paiement</span>
          </TabsTrigger>
          <TabsTrigger value="settings" className="flex items-center space-x-2">
            <Settings className="h-4 w-4" />
            <span>Paramètres</span>
          </TabsTrigger>
        </TabsList>

        <TabsContent value="personal" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Informations Personnelles</CardTitle>
              <CardDescription>Gérez vos informations personnelles et de contact</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="firstName">Noms & Prénoms</Label>
                  <Input id="firstName" defaultValue={profile.personalInfo.name} />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="lastName">Email</Label>
                  <Input id="lastName" defaultValue={profile.personalInfo.email} />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="phone">Téléphone</Label>
                  <Input id="phone" defaultValue={profile.personalInfo.phone} />
                </div>
              </div>
              <div className="flex items-center justify-between pt-4 border-t">
                <div className="space-y-1">
                  <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                    <Calendar className="h-4 w-4" />
                    <span>Membre depuis le {new Date(profile.personalInfo.joinDate).toLocaleDateString("fr-FR")}</span>
                  </div>
                  <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                    <Shield className="h-4 w-4" />
                    <span>
                      Dernière connexion: {new Date(profile.personalInfo.lastLogin).toLocaleDateString("fr-FR")}
                    </span>
                  </div>
                </div>
                <Button onClick={() => handleSave("personal", {})} disabled={saving}>
                  {saving ? <LoadingSpinner className="h-4 w-4" /> : "Sauvegarder"}
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="business" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Informations Entreprise</CardTitle>
              <CardDescription>Gérez les informations de votre entreprise</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="businessName">Nom de l'entreprise</Label>
                  <Input id="businessName" defaultValue={profile.businessInfo.businessName} />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="businessType">Type d'entreprise</Label>
                  <Input id="businessType" defaultValue={profile.businessInfo.businessType} />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <Textarea id="description" defaultValue={profile.businessInfo.description} rows={3} />
              </div>
              <div className="space-y-4">
                <h4 className="font-medium flex items-center space-x-2">
                  <MapPin className="h-4 w-4" />
                  <span>Adresse</span>
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="street">Rue</Label>
                    <Input id="street" defaultValue={profile.businessInfo.address.street} />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="city">Ville</Label>
                    <Input id="city" defaultValue={profile.businessInfo.address.city} />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="region">Région</Label>
                    <Input id="region" defaultValue={profile.businessInfo.address.region} />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="postalCode">Code postal</Label>
                    <Input id="postalCode" defaultValue={profile.businessInfo.address.postalCode} />
                  </div>
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="taxNumber">Numéro fiscal</Label>
                  <Input id="taxNumber" defaultValue={profile.businessInfo.taxNumber} />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="businessLicense">Licence commerciale</Label>
                  <Input id="businessLicense" defaultValue={profile.businessInfo.businessLicense} />
                </div>
              </div>
              <div className="space-y-2">
                <Label>Certifications</Label>
                <div className="flex flex-wrap gap-2">
                  {profile.businessInfo.certifications.map((cert, index) => (
                    <Badge key={index} variant="secondary">
                      {cert}
                    </Badge>
                  ))}
                </div>
              </div>
              <div className="flex justify-end pt-4 border-t">
                <Button onClick={() => handleSave("business", {})} disabled={saving}>
                  {saving ? <LoadingSpinner className="h-4 w-4" /> : "Sauvegarder"}
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="banking" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Informations de Paiements</CardTitle>
              <CardDescription>Gérez vos informations de paiement</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="api_key">API key</Label>
                  <Input id="api_key" defaultValue={profile.bankInfo.api_key} />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="api_secret">API secret</Label>
                  <Input id="api_secret" defaultValue={profile.bankInfo.api_secret} />
                </div>
                {/* <div className="space-y-2">
                  <Label htmlFor="accountNumber">Numéro de compte</Label>
                  <Input id="accountNumber" defaultValue={profile.bankInfo.accountNumber} type="password" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="iban">IBAN</Label>
                  <Input id="iban" defaultValue={profile.bankInfo.iban} />
                </div> */}
              </div>
              <div className="flex justify-end pt-4 border-t">
                <Button onClick={() => handleSavePayment()} disabled={saving}>
                  {saving ? <LoadingSpinner className="h-4 w-4" /> : "Sauvegarder"}
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="settings" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Préférences</CardTitle>
              <CardDescription>Configurez vos préférences d'application</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="language">Langue</Label>
                  <Input id="language" defaultValue={profile.preferences.language} />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="currency">Devise</Label>
                  <Input id="currency" defaultValue={profile.preferences.currency} />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="timezone">Fuseau horaire</Label>
                  <Input id="timezone" defaultValue={profile.preferences.timezone} />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Bell className="h-5 w-5" />
                <span>Notifications</span>
              </CardTitle>
              <CardDescription>Gérez vos préférences de notification</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <Label htmlFor="email-notifications">Notifications par email</Label>
                    <p className="text-sm text-muted-foreground">Recevez des notifications par email</p>
                  </div>
                  <Switch id="email-notifications" defaultChecked={profile.preferences.notifications.email} />
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <Label htmlFor="sms-notifications">Notifications SMS</Label>
                    <p className="text-sm text-muted-foreground">Recevez des notifications par SMS</p>
                  </div>
                  <Switch id="sms-notifications" defaultChecked={profile.preferences.notifications.sms} />
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <Label htmlFor="push-notifications">Notifications push</Label>
                    <p className="text-sm text-muted-foreground">Recevez des notifications push</p>
                  </div>
                  <Switch id="push-notifications" defaultChecked={profile.preferences.notifications.push} />
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <Label htmlFor="marketing-notifications">Notifications marketing</Label>
                    <p className="text-sm text-muted-foreground">Recevez des offres et promotions</p>
                  </div>
                  <Switch id="marketing-notifications" defaultChecked={profile.preferences.notifications.marketing} />
                </div>
              </div>
              <div className="flex justify-end pt-4 border-t">
                <Button onClick={() => handleSave("settings", {})} disabled={saving}>
                  {saving ? <LoadingSpinner className="h-4 w-4" /> : "Sauvegarder"}
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
