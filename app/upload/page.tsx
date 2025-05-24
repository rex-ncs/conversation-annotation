import { getLoggedInUser } from '@/app/actions/auth';
import { redirect } from 'next/navigation';
import MultiFileUploadPage from './file-upload';

export default async function UploadPage() {
  const user = await getLoggedInUser();
  if (!user || user.role !== 'ADMIN') {
    redirect('/'); 
  }
  return (
    <MultiFileUploadPage />
  )

}