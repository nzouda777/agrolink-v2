"use client"

import { useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import { Loader2, CheckCircle, XCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useRouter } from 'next/navigation';
import { toast } from '@/components/ui/use-toast';

export default function PaymentConfirmation() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [status, setStatus] = useState<'success' | 'failed' | 'pending' | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const verifyPayment = async () => {
      try {
        const reference = searchParams.get('reference');
        const status = searchParams.get('status');
        
        if (!reference) {
          setError('No payment reference found');
          setIsLoading(false);
          return;
        }

        // Check if we have a status in the URL
        if (status) {
          if (status === 'success') {
            setStatus('success');
            toast({
              title: 'Paiement réussi',
              description: 'Votre paiement a été traité avec succès.',
              variant: 'default',
            });
          } else {
            setStatus('failed');
            toast({
              title: 'Paiement échoué',
              description: 'Le paiement n\'a pas pu être traité.',
              variant: 'destructive',
            });
          }
          setIsLoading(false);
          return;
        }

        // If no status in URL, verify with the server
        const response = await fetch(`/api/payments/verify?reference=${reference}`);
        const data = await response.json();

        if (data.success) {
          setStatus('success');
          toast({
            title: 'Paiement réussi',
            description: 'Votre paiement a été traité avec succès.',
            variant: 'default',
          });
        } else {
          setStatus('failed');
          toast({
            title: 'Paiement échoué',
            description: data.message || 'Le paiement n\'a pas pu être traité.',
            variant: 'destructive',
          });
        }
      } catch (err) {
        console.error('Error verifying payment:', err);
        setError('Une erreur est survenue lors de la vérification du paiement');
        setStatus('failed');
      } finally {
        setIsLoading(false);
      }
    };

    verifyPayment();
  }, [searchParams]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <Loader2 className="h-12 w-12 animate-spin mx-auto text-primary mb-4" />
          <h2 className="text-xl font-semibold">Vérification du paiement en cours...</h2>
          <p className="text-muted-foreground mt-2">Veuillez patienter pendant que nous vérifions votre paiement.</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <XCircle className="h-12 w-12 text-destructive mx-auto mb-4" />
          <h2 className="text-xl font-semibold">Erreur</h2>
          <p className="text-muted-foreground mt-2">{error}</p>
          <Button className="mt-6" onClick={() => router.push('/')}>
            Retour à l'accueil
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-md text-center">
        {status === 'success' ? (
          <>
            <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-green-100">
              <CheckCircle className="h-8 w-8 text-green-600" />
            </div>
            <h1 className="mt-4 text-2xl font-bold text-gray-900">Paiement Réussi !</h1>
            <p className="mt-2 text-gray-600">
              Votre paiement a été traité avec succès. Merci pour votre achat !
            </p>
            <div className="mt-6">
              <Button onClick={() => router.push('/orders')} className="w-full">
                Voir mes commandes
              </Button>
              <Button 
                variant="outline" 
                className="mt-3 w-full"
                onClick={() => router.push('/')}
              >
                Retour à l'accueil
              </Button>
            </div>
          </>
        ) : (
          <>
            <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-red-100">
              <XCircle className="h-8 w-8 text-red-600" />
            </div>
            <h1 className="mt-4 text-2xl font-bold text-gray-900">Paiement Échoué</h1>
            <p className="mt-2 text-gray-600">
              Votre paiement n'a pas pu être traité. Veuillez réessayer ou contacter le support.
            </p>
            <div className="mt-6">
              <Button 
                variant="destructive" 
                className="w-full"
                onClick={() => router.push('/checkout')}
              >
                Réessayer le paiement
              </Button>
              <Button 
                variant="outline" 
                className="mt-3 w-full"
                onClick={() => router.push('/')}
              >
                Retour à l'accueil
              </Button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
