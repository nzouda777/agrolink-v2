import { NextResponse } from "next/server"
import axios from 'axios';

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000',
  headers: {
    'Accept': 'application/json',
    'Authorization': `Bearer ${process.env.API_TOKEN}`
  }
});

export async function GET() {
  try {
    const response = await api.get('/api/user/profile');
    const data = response.data;
    
    // Transform the backend data to match the frontend format
    const profileData = {
      personalInfo: {
        id: data.id.toString(),
        firstName: data.first_name || '',
        lastName: data.last_name || '',
        email: data.email || '',
        phone: data.phone || '',
        avatar: data.avatar || '/placeholder.svg',
        joinDate: data.created_at || new Date().toISOString(),
        lastLogin: data.last_login_at || new Date().toISOString(),
      },
      businessInfo: {
        businessName: data.business_name || '',
        businessType: data.type?.name || '',
        description: data.bio || '',
        address: {
          street: data.address?.street || '',
          city: data.city?.name || '',
          region: data.city?.region || '',
          country: 'Sénégal',
          postalCode: data.address?.postal_code || '',
        },
        taxNumber: data.tax_number || '',
        businessLicense: data.business_license || '',
        certifications: data.certifications?.map((c: any) => c.name) || [],
      },
      bankInfo: {
        api_key: data.payment_api_key || '',
        api_secret: data.payment_api_secret || '',
        accountNumber: data.bank_account_number || '',
        iban: data.iban || '',
      },
      preferences: {
        language: data.language || 'fr',
        currency: data.currency || 'XOF',
        timezone: data.timezone || 'Africa/Dakar',
        notifications: {
          email: data.notification_preferences?.email || true,
          sms: data.notification_preferences?.sms || true,
          push: data.notification_preferences?.push || true,
          marketing: data.notification_preferences?.marketing || false,
        },
      },
      stats: {
        totalProducts: data.products_count || 0,
        totalOrders: data.orders_count || 0,
        totalRevenue: data.total_revenue || 0,
        rating: parseFloat(data.average_rating) || 0,
        reviewsCount: data.reviews_count || 0,
      },
    };

    return NextResponse.json(profileData);
  } catch (error: any) {
    console.error("Erreur lors du chargement du profil:", error);
    const errorMessage = error.response?.data?.message || "Erreur lors du chargement du profil";
    return NextResponse.json(
      { error: errorMessage },
      { status: error.response?.status || 500 }
    );
  }
}

export async function PATCH(request: Request) {
  try {
    const body = await request.json();
    const { section, data } = body;

    const response = await api.patch('/api/user/profile', { section, data });
    return NextResponse.json(response.data);
    
  } catch (error: any) {
    console.error("Erreur lors de la mise à jour du profil:", error);
    const errorMessage = error.response?.data?.message || "Erreur lors de la mise à jour du profil";
    return NextResponse.json(
      { error: errorMessage },
      { status: error.response?.status || 500 }
    );
  }
}
